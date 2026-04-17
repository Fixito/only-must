import { chromium, type Page } from 'playwright';
import slug from 'slug';

import { db } from '../db/client.js';
import type { GameInsert } from '../db/schemas/game.schema.js';
import { gamesTable } from '../db/schemas/game.schema.js';

interface ScrapedItem {
  link: string;
  img: string | null;
  isMust: boolean;
  title: string;
  metaScore: number | null;
  releaseDate: string | null;
}

async function scrapePage(page: Page): Promise<ScrapedItem[]> {
  const items = await page.$$eval(
    '[data-testid="filter-results"]:has(.c-global-image.score-badge__image)',
    (cards) =>
      cards.map((card) => ({
        link: card.querySelector('a[href]')?.getAttribute('href') ?? '',
        img: card.querySelector('img')?.getAttribute('src') ?? null,
        isMust: card.querySelector('[data-testid="score-badge"]') !== null,
        title:
          card
            .querySelector('h3[data-testid="product-title"] span:nth-of-type(2)')
            ?.textContent?.trim() ?? '',
        rawDate: card.querySelector('[data-title] + div span')?.textContent?.trim() ?? null,
        metaScore:
          Number(card.querySelector('.c-siteReviewScore')?.textContent?.trim() || '') || null,
      })),
  );

  return items.map(
    ({ rawDate, ...item }): ScrapedItem => ({
      ...item,
      releaseDate: rawDate ? new Date(rawDate).toISOString() : null,
    }),
  );
}

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
  });
  const page = await context.newPage();

  await page.goto('https://www.metacritic.com/browse/game/?page=1', {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  await page.waitForSelector('[data-testid="filter-results"]', { timeout: 15_000 });

  const TOTAL_PAGES = 590;

  const start = Date.now();

  console.log(`🕷️  Starting scrape — ${TOTAL_PAGES} pages to go`);

  const allItems = await scrapePage(page);

  console.log(`✅ Page 1/${TOTAL_PAGES} — ${allItems.length} items`);

  for (let pageNumber = 2; pageNumber <= TOTAL_PAGES; pageNumber++) {
    console.log(`Scraping page ${pageNumber}/${TOTAL_PAGES}`);

    try {
      await page.goto(`https://www.metacritic.com/browse/game/?page=${pageNumber}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60_000,
      });
      await page.waitForSelector('[data-testid="filter-results"]', { timeout: 15_000 });

      const items = await scrapePage(page);

      if (!items.length || items.every((i) => !i.title)) {
        console.log(`⚠️  Page ${pageNumber} — no items or no must-play — stopping`);
        break;
      }

      allItems.push(...items);
      console.log(
        `✅ Page ${pageNumber}/${TOTAL_PAGES} — ${items.length} items (+${allItems.length} total)`,
      );
    } catch (error) {
      console.error(`❌ Page ${pageNumber}/${TOTAL_PAGES} failed:`, error);
    }
  }

  await browser.close();

  console.log(
    `\n📦 Scraping done in ${((Date.now() - start) / 1000).toFixed(1)}s — ${allItems.length} items total`,
  );
  console.log(`💾 Inserting into DB...`);

  await db
    .insert(gamesTable)
    .values(
      allItems.map(
        (i): GameInsert => ({
          slug: slug(i.title),
          title: i.title,
          link: i.link,
          image: i.img,
          metaScore: i.metaScore,
          releaseDate: i.releaseDate ? new Date(i.releaseDate).toLocaleDateString('en-CA') : null,
          isMust: i.isMust,
        }),
      ),
    )
    .onConflictDoNothing();

  console.log(`✅ Insert done`);
}

main().catch(console.error);
