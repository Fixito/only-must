import { chromium, type Page } from 'playwright';
import slug from 'slug';

import { db } from '../db/client.js';
import type { GameInsert } from '../db/schemas/game/game.schema.js';
import { gamesTable } from '../db/schemas/game/game.schema.js';

interface ScrapedItem {
  link: string;
  img: string;
  isMust: boolean;
  title: string;
  description: string;
  metaScore: number;
}

/**
 * Extracts an array of scraped game items from the current page's browse results.
 *
 * Each returned item contains `link`, `img`, `isMust`, `title`, `description`, and `metaScore`.
 * Missing textual or attribute values are normalized to empty strings; `metaScore` is converted to a number and defaults to `0` when missing or invalid.
 *
 * @returns An array of `ScrapedItem` objects representing the result cards found on the page.
 */
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

/**
 * Insert an array of scraped game records into the database games table, ignoring conflicts.
 *
 * Each `ScrapedItem` is mapped to a `GameInsert` object (the `slug` is generated from the item's `title`) and inserted; any rows that would violate constraints are skipped via `ON CONFLICT DO NOTHING`.
 *
 * @param items - Array of scraped records to insert into the games table
 */
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

/**
 * Orchestrates a Playwright scraping loop that walks Metacritic browse pages, extracts game records, inserts them into the database, and logs progress.
 *
 * Launches a Chromium browser and page, navigates pages sequentially until a page yields no usable items, calls the scraper to extract items, persists each page's items via the inserter, reports per-page progress and errors, and closes the browser when finished.
 */
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

  while (true) {
    console.log(`🕷️  Scraping page ${pageNumber}...`);

    try {
      await page.goto(`https://www.metacritic.com/browse/game/?page=${pageNumber}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60_000,
      });
      await page.waitForSelector('[data-testid="filter-results"]', { timeout: 15_000 });

      const items = await scrapePage(page);

      if (!items.length || items.every((i) => !i.title)) {
        console.log(`⚠️  Page ${pageNumber} — no items — stopping`);
        break;
      }

      await insertItems(items);
      totalItems += items.length;

      console.log(`✅ Page ${pageNumber} — ${items.length} items inserted (+${totalItems} total)`);

      pageNumber++;
    } catch (error) {
      console.error(`❌ Page ${pageNumber} failed:`, error);
      pageNumber++;
    }
  }

  await browser.close();

  console.log(
    `\n📦 Scraping done in ${((Date.now() - start) / 1000).toFixed(1)}s — ${totalItems} items total`,
  );
}

main().catch(console.error);
