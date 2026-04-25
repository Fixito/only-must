import { eq } from 'drizzle-orm';
import { chromium, type Page } from 'playwright';
import slug from 'slug';

import { db } from '../db/client.js';
import {
  developersTable,
  gameDevelopersTable,
  gameGenresTable,
  gamePlatformsTable,
  gamesTable,
  genresTable,
  platformsTable,
} from '../db/schemas/index.js';
import { sleep, withRetry } from './utils.js';

interface GameDetails {
  platforms: string[];
  releaseDate: Date | null;
  developer: string;
  genres: string[];
}

async function scrapeGameDetail(page: Page, url: string): Promise<GameDetails> {
  await page.goto(`https://www.metacritic.com${url}`, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });

  const details: GameDetails = await page.evaluate((selector) => {
    const result: GameDetails = {
      platforms: [],
      releaseDate: null,
      developer: '',
      genres: [],
    };
    const detailsElement = document.querySelector(selector);

    if (!detailsElement) return result;

    const items = detailsElement.querySelectorAll(
      '.c-product-details__section.c-product-details__section--grouped',
    );

    items.forEach((item) => {
      const label = item.querySelector('.c-product-details__section__label')?.textContent?.trim();

      if (!label) return;

      if (label.includes('Platform')) {
        result.platforms = Array.from(
          item.querySelectorAll('.c-product-details__section__list-item'),
        )
          .map((platform) => platform.textContent?.trim())
          .filter((p) => !!p);
      }

      if (label.includes('Initial Release Date')) {
        const value = item.querySelector('.c-product-details__section__value')?.textContent?.trim();
        if (value) result.releaseDate = new Date(value);
      }

      if (label.includes('Developer')) {
        const dev = item.querySelector('.c-product-detail-link')?.textContent?.trim();
        if (dev) result.developer = dev;
      }

      if (label.includes('Genres')) {
        result.genres = Array.from(item.querySelectorAll('.c-genreList_item'))
          .map((genre) => genre.textContent?.trim())
          .filter((g) => !!g);
      }
    });

    return result;
  }, '.c-game-details__details');

  return details;
}

async function main() {
  const gamesToScrape = await db
    .select()
    .from(gamesTable)
    .where(eq(gamesTable.isDetailsScraped, false));

  const browser = await chromium.launch({ headless: false });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
  });

  let page = await context.newPage();

  console.log(`🕷️  Starting scrape...`);

  const start = Date.now();

  for (const game of gamesToScrape) {
    console.log(`🕷️  Scraping details for "${game.title}" (${game.link})`);

    try {
      const gameDetails = await withRetry(() => scrapeGameDetail(page, game.link));

      console.log(`💾 Inserting into DB...`);

      await db.transaction(async (tx) => {
        if (gameDetails.developer) {
          const devSlug = slug(gameDetails.developer);

          await tx
            .insert(developersTable)
            .values({ id: devSlug, name: gameDetails.developer })
            .onConflictDoNothing({ target: developersTable.id });

          await tx
            .insert(gameDevelopersTable)
            .values({ gameId: game.id, developerId: devSlug })
            .onConflictDoNothing({
              target: [gameDevelopersTable.gameId, gameDevelopersTable.developerId],
            });
        }

        if (gameDetails.genres.length > 0) {
          const genreSlugs = gameDetails.genres.map((g) => ({
            name: g,
            id: slug(g),
          }));

          await tx
            .insert(genresTable)
            .values(genreSlugs)
            .onConflictDoNothing({ target: genresTable.id });

          await tx
            .insert(gameGenresTable)
            .values(
              genreSlugs.map((genre) => ({
                gameId: game.id,
                genreId: genre.id,
              })),
            )
            .onConflictDoNothing({
              target: [gameGenresTable.gameId, gameGenresTable.genreId],
            });
        }

        if (gameDetails.platforms.length > 0) {
          const platformSlugs = gameDetails.platforms.map((p) => ({
            name: p,
            id: slug(p),
          }));

          await tx
            .insert(platformsTable)
            .values(platformSlugs)
            .onConflictDoNothing({ target: platformsTable.id });

          await tx
            .insert(gamePlatformsTable)
            .values(
              platformSlugs.map((platform) => ({
                gameId: game.id,
                platformId: platform.id,
              })),
            )
            .onConflictDoNothing({
              target: [gamePlatformsTable.gameId, gamePlatformsTable.platformId],
            });
        }

        await tx
          .update(gamesTable)
          .set({
            releaseDate: gameDetails.releaseDate ? gameDetails.releaseDate.toISOString() : null,
            isDetailsScraped: true,
          })
          .where(eq(gamesTable.id, game.id));
      });

      console.log(`✅ Insert done`);
    } catch (error) {
      console.error(`❌ Failed to scrape "${game.title}":`, error);
      await page.close();
      page = await context.newPage();
    }

    await sleep(1500 + Math.random() * 2000);
  }

  console.log(
    `\n📦 Scraping done in ${((Date.now() - start) / 1000).toFixed(1)}s -- ${gamesToScrape.length} games scraped`,
  );

  await browser.close();
}

main().catch(console.error);
