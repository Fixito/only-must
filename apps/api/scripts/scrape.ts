import { chromium, type Page } from 'playwright';
import slug from 'slug';

import { db } from '../db/client.js';
import type { GameInsert } from '../db/schemas/game/game.schema.js';
import { gamesTable } from '../db/schemas/game/game.schema.js';
import { withRetry } from './utils.js';

const SOURCES = [
  (page: number) => `https://www.metacritic.com/browse/game/?page=${page}`,
  (page: number) =>
    `https://www.metacritic.com/browse/game/all/all/current-year/metascore/?platform=mobile&platform=nintendo-switch&platform=nintendo-switch-2&platform=pc&platform=ps5&platform=xbox-series-x&page=${page}`,
];

const MAX_PAGE = 590;

interface ScrapedItem {
  link: string;
  img: string;
  heroImg: string;
  title: string;
  description: string;
  metaScore: number;
}

async function scrapePage(page: Page): Promise<ScrapedItem[]> {
  return page.$$eval(
    '[data-testid="filter-results"]:has(.c-global-image.score-badge__image)',
    (cards) =>
      cards.map((card) => ({
        link: card.querySelector('a[href]')?.getAttribute('href') ?? '',
        img: (() => {
          const imgEl = card.querySelector('img[data-nuxt-img]');
          return imgEl instanceof HTMLImageElement ? imgEl.src : '';
        })(),
        heroImg: (() => {
          const imgEl = card.querySelector('img[data-nuxt-img]');
          if (!(imgEl instanceof HTMLImageElement)) return '';
          const srcset2x = imgEl.srcset
            .split(',')
            .find((s: string) => s.trim().endsWith('2x'))
            ?.trim()
            .split(' ')[0];
          return srcset2x || imgEl.src;
        })(),
        title:
          card
            .querySelector('[data-testid="product-title"] span:nth-of-type(2)')
            ?.textContent?.trim() ?? '',
        description: card.querySelector('.line-clamp-2 span')?.textContent?.trim() ?? '',
        metaScore: Number(card.querySelector('.c-siteReviewScore')?.textContent?.trim() || '') || 0,
      })),
  );
}

async function insertItems(items: ScrapedItem[]) {
  await db
    .insert(gamesTable)
    .values(
      items.map(
        (i): GameInsert => ({
          slug: slug(i.title),
          title: i.title,
          description: i.description,
          link: i.link,
          image: i.img,
          metaScore: i.metaScore,
          heroImage: i.heroImg,
        }),
      ),
    )
    .onConflictDoNothing();
}

async function scrapeSource(page: Page, getUrl: (page: number) => string) {
  let pageNumber = 1;
  let total = 0;

  while (pageNumber <= MAX_PAGE) {
    console.log(`🕷️  Scraping page ${pageNumber} — ${getUrl(pageNumber)}`);

    try {
      const items = await withRetry(async () => {
        await page.goto(getUrl(pageNumber), { waitUntil: 'domcontentloaded', timeout: 60_000 });
        await page.waitForSelector('[data-testid="filter-results"]', { timeout: 15_000 });
        return scrapePage(page);
      });

      if (!items.length || items.every((i) => !i.title)) {
        console.log(`⚠️  Page ${pageNumber} — no items — stopping`);
        break;
      }

      await insertItems(items);
      total += items.length;
      console.log(`✅ Page ${pageNumber} — ${items.length} items inserted`);
      pageNumber++;
    } catch (error) {
      console.error(`❌ Page ${pageNumber} failed:`, error);
      pageNumber++;
    }
  }

  return total;
}

async function main() {
  const headless =
    process.env['HEADLESS'] === 'false'
      ? false
      : process.env['CI'] !== undefined || process.env['HEADLESS'] === 'true';
  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
  });
  const page = await context.newPage();

  const start = Date.now();
  let totalItems = 0;

  console.log(`🕷️  Starting scrape...`);

  for (const getUrl of SOURCES) {
    totalItems += await scrapeSource(page, getUrl);
  }

  await browser.close();

  console.log(
    `\n📦 Scraping done in ${((Date.now() - start) / 1000).toFixed(1)}s — ${totalItems} items total`,
  );
}

main().catch(console.error);
