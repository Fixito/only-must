import { chromium, type Page } from 'playwright';
import slug from 'slug';

import { db } from '../db/client.js';
import type { GameInsert } from '../db/schemas/game/game.schema.js';
import { gamesTable } from '../db/schemas/game/game.schema.js';
import { withRetry } from './utils.js';

interface ScrapedItem {
  link: string;
  img: string;
  isMust: boolean;
  title: string;
  description: string;
  metaScore: number;
}

const MAX_PAGE = 590;

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
        isMust: card.querySelector('[data-testid="score-badge"]') !== null,
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
          isMust: i.isMust,
        }),
      ),
    )
    .onConflictDoNothing();
}

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
  });
  const page = await context.newPage();

  const start = Date.now();
  let totalItems = 0;
  let pageNumber = 1;

  console.log(`🕷️  Starting scrape...`);

  while (pageNumber <= MAX_PAGE) {
    console.log(`🕷️  Scraping page ${pageNumber}...`);

    try {
      const items = await withRetry(async () => {
        await page.goto(`https://www.metacritic.com/browse/game/?page=${pageNumber}`, {
          waitUntil: 'domcontentloaded',
          timeout: 60_000,
        });
        await page.waitForSelector('[data-testid="filter-results"]', { timeout: 15_000 });
        return scrapePage(page);
      });

      if (!items.length || items.every((i) => !i.title)) {
        console.log(`⚠️  Page ${pageNumber} — no items — stopping`);
        break;
      }

      await insertItems(items);
      totalItems += items.length;

      console.log(`✅ Page ${pageNumber} — ${items.length} items inserted (+${totalItems} total)`);

      pageNumber++;
    } catch (error) {
      console.error(`❌ Page ${pageNumber} failed after retries:`, error);
      pageNumber++;
    }
  }

  await browser.close();

  console.log(
    `\n📦 Scraping done in ${((Date.now() - start) / 1000).toFixed(1)}s — ${totalItems} items total`,
  );
}

main().catch(console.error);
