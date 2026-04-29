import type { SQL as SQLType } from 'drizzle-orm';
import { asc, count, eq, getTableColumns, sql } from 'drizzle-orm';

import { db } from '../../../db/client.js';
import { gamesTable } from '../../../db/schemas/game/game.schema.js';
import {
  developersTable,
  gameDevelopersTable,
  gameGenresTable,
  gamePlatformsTable,
  genresTable,
  platformsTable,
} from '../../../db/schemas/index.js';

interface FindGamesParams {
  where?: SQLType | undefined;
  page: number;
  pageSize: number;
}

export async function findGames({ where, page, pageSize }: FindGamesParams) {
  const sq = db
    .select({ id: gamesTable.id })
    .from(gamesTable)
    .where(where)
    .orderBy(sql`${gamesTable.metaScore} DESC NULLS LAST`)
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .as('subquery');

  return db
    .select(
      (({ scrapedAt, updatedAt, isDetailsScraped, ...cols }) => cols)(getTableColumns(gamesTable)),
    )
    .from(gamesTable)
    .innerJoin(sq, eq(gamesTable.id, sq.id))
    .orderBy(sql`${gamesTable.metaScore} DESC NULLS LAST`, asc(gamesTable.releaseDate));
}

export async function countGames({ where }: { where?: SQLType | undefined }) {
  const result = await db.select({ total: count() }).from(gamesTable).where(where);
  return result[0]?.total ?? 0;
}

export async function findGameBySlug(slug: string) {
  const game = await db.query.gamesTable.findFirst({
    where: eq(gamesTable.slug, slug),
  });

  if (!game) return null;

  const [platforms, genres, developers] = await Promise.all([
    db
      .select({
        id: platformsTable.id,
        name: platformsTable.name,
      })
      .from(gamePlatformsTable)
      .innerJoin(platformsTable, eq(platformsTable.id, gamePlatformsTable.platformId))
      .where(eq(gamePlatformsTable.gameId, game.id)),

    db
      .select({
        id: genresTable.id,
        name: genresTable.name,
      })
      .from(gameGenresTable)
      .innerJoin(genresTable, eq(genresTable.id, gameGenresTable.genreId))
      .where(eq(gameGenresTable.gameId, game.id)),

    db
      .select({
        id: developersTable.id,
        name: developersTable.name,
      })
      .from(gameDevelopersTable)
      .innerJoin(developersTable, eq(developersTable.id, gameDevelopersTable.developerId))
      .where(eq(gameDevelopersTable.gameId, game.id)),
  ]);

  return {
    ...game,
    platforms,
    genres,
    developers,
  };
}
