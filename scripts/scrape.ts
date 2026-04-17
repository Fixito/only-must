import { chromium, type Page } from 'playwright';

import { gamesTable } from '../db/schemas/game.schema.js';
import type { GameInsert } from '../db/schemas/game.schema.js';
import { db } from '../db/client.js';
import slug from 'slug';

async function scrapePage(page: Page) {
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

  return items.map((item) => ({
    ...item,
    releaseDate: item.rawDate ? new Date(item.rawDate).toISOString() : null,
  }));
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

  const allItems = await scrapePage(page);
  console.log(`Scraping page 1/${TOTAL_PAGES}`);

  for (let pageNumber = 2; pageNumber <= TOTAL_PAGES; pageNumber++) {
    console.log(`Scraping page ${pageNumber}/${TOTAL_PAGES}`);

    try {
      await page.goto(`https://www.metacritic.com/browse/game/?page=${pageNumber}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60_000,
      });
      await page.waitForSelector('[data-testid="filter-results"]', { timeout: 15_000 });

      const items = await scrapePage(page);

      if (!items.length || items.every((i) => !i.title)) break;

      allItems.push(...items);
    } catch (error) {
      console.error(`Error scraping page ${pageNumber}:`, error);
    }
  }

  await browser.close();

  console.log('Scraping completed. Total items:', allItems.length);

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
}

main().catch(console.error);
