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

const CONCURRENCY = 5;

interface GameDetails {
  platforms: string[];
  releaseDate: string | null;
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
        if (value) result.releaseDate = value;
      }

      if (label.includes('Developer')) {
        const dev = item
          .querySelector('.c-product-details__section__list-item')
          ?.textContent?.trim();
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

  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
  });

  await context.route('**/*', async (route) => {
    const blocked = ['image', 'media', 'font', 'stylesheet'];

    if (blocked.includes(route.request().resourceType())) {
      await route.abort();
    } else {
      await route.continue();
    }
  });

  const chunks: (typeof gamesToScrape)[] = [];

  for (let i = 0; i < gamesToScrape.length; i += CONCURRENCY) {
    chunks.push(gamesToScrape.slice(i, i + CONCURRENCY));
  }

  console.log(`🕷️  Starting scrape... (${gamesToScrape.length} games, ${chunks.length} chunks)`);

  const start = Date.now();

  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(async (game) => {
        const page = await context.newPage();

        try {
          console.log(`🕷️  Scraping "${game.title}"`);
          const gameDetails = await withRetry(() => scrapeGameDetail(page, game.link));

          console.log(`💾 Inserting "${game.title}"...`);

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
              const genreMap = new Map<string, { name: string; id: string }>();

              gameDetails.genres.forEach((g) => {
                const genreSlug = slug(g);

                if (!genreMap.has(genreSlug)) {
                  genreMap.set(genreSlug, { name: g, id: genreSlug });
                }
              });

              const genreSlugs = Array.from(genreMap.values());

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
              const platformMap = new Map<string, { name: string; id: string }>();

              gameDetails.platforms.forEach((p) => {
                const platformSlug = slug(p);

                if (!platformMap.has(platformSlug)) {
                  platformMap.set(platformSlug, { name: p, id: platformSlug });
                }
              });

              const platformSlugs = Array.from(platformMap.values());

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
                releaseDate: gameDetails.releaseDate
                  ? (() => {
                      const d = new Date(gameDetails.releaseDate);
                      return d instanceof Date && !isNaN(d.getTime())
                        ? d.toISOString().substring(0, 10)
                        : null;
                    })()
                  : null,
                isDetailsScraped: true,
              })
              .where(eq(gamesTable.id, game.id));
          });

          console.log(`✅ Done: "${game.title}"`);
        } catch (error) {
          console.error(`❌ Failed "${game.title}":`, error);
        } finally {
          await page.close();
        }
      }),
    );

    await sleep(500 + Math.random() * 500);
  }

  console.log(
    `\n📦 Done in ${((Date.now() - start) / 1000).toFixed(1)}s -- ${gamesToScrape.length} games`,
  );

  await browser.close();
}

main().catch(console.error);
