import type { SQL as SQLType } from 'drizzle-orm';
import { and, asc, count, desc, eq, getTableColumns, inArray, sql } from 'drizzle-orm';

import { db } from '../../../db/client.js';
import { gamesTable } from '../../../db/schemas/game/game.schema.js';
import {
  gameDurationsTable,
  gameGenresTable,
  gamePlatformsTable,
} from '../../../db/schemas/index.js';

const defaultOrder = [sql`${gamesTable.metaScore} DESC NULLS LAST`, asc(gamesTable.releaseDate)];

export const sortMap = {
  'metascore-desc': defaultOrder,
  'release-asc': [asc(gamesTable.releaseDate), sql`${gamesTable.metaScore} DESC NULLS LAST`],
  'release-desc': [desc(gamesTable.releaseDate), sql`${gamesTable.metaScore} DESC NULLS LAST`],
  'shortest-duration-asc': [
    sql`${gameDurationsTable.mainStorySeconds} ASC NULLS LAST`,
    asc(gamesTable.releaseDate),
  ],
  'longest-duration-desc': [
    sql`${gameDurationsTable.mainStorySeconds} DESC NULLS LAST`,
    desc(gamesTable.releaseDate),
  ],
};

export interface GameFilters {
  platforms?: string[] | undefined;
  genres?: string[] | undefined;
  search?: string | undefined;
  releaseYear?: number | undefined;
  releaseYearMin?: number | undefined;
  releaseYearMax?: number | undefined;
  playtimeMin?: number | undefined;
  playtimeMax?: number | undefined;
}

interface FindGamesParams extends GameFilters {
  page: number;
  pageSize: number;
  sort?: keyof typeof sortMap | undefined;
}

const durationSorts = new Set<keyof typeof sortMap>([
  'shortest-duration-asc',
  'longest-duration-desc',
]);

const gameColumns = (({ scrapedAt, updatedAt, isDetailsScraped, ...cols }) => cols)(
  getTableColumns(gamesTable),
);

const durationColumns = {
  mainStorySeconds: gameDurationsTable.mainStorySeconds,
  mainExtraSeconds: gameDurationsTable.mainExtraSeconds,
  completionistSeconds: gameDurationsTable.completionistSeconds,
};

function buildWhere(filters: GameFilters): SQLType | undefined {
  const conditions: SQLType[] = [];

  if (filters.search) {
    conditions.push(sql`${gamesTable.title} ILIKE ${`%${filters.search}%`}`);
  }

  if (filters.releaseYear != null) {
    conditions.push(sql`
      ${gamesTable.releaseDate} IS NOT NULL
      AND EXTRACT(YEAR FROM ${gamesTable.releaseDate}) = ${filters.releaseYear}
    `);
  } else {
    if (filters.releaseYearMin) {
      conditions.push(sql`
      ${gamesTable.releaseDate} IS NOT NULL
      AND EXTRACT(YEAR FROM ${gamesTable.releaseDate}) >= ${filters.releaseYearMin}`);
    }

    if (filters.releaseYearMax) {
      conditions.push(sql`
      ${gamesTable.releaseDate} IS NOT NULL
      AND EXTRACT(YEAR FROM ${gamesTable.releaseDate}) <= ${filters.releaseYearMax}`);
    }
  }

  if (filters.platforms?.length) {
    conditions.push(sql`
      EXISTS (
        SELECT 1
        FROM ${gamePlatformsTable}
        WHERE ${gamePlatformsTable.gameId} = ${gamesTable.id}
        AND ${inArray(gamePlatformsTable.platformId, filters.platforms)}
      )
    `);
  }

  if (filters.genres?.length) {
    conditions.push(sql`
      EXISTS (
        SELECT 1
        FROM ${gameGenresTable}
        WHERE ${gameGenresTable.gameId} = ${gamesTable.id}
        AND ${inArray(gameGenresTable.genreId, filters.genres)}
      )
    `);
  }

  if (filters.playtimeMin !== undefined || filters.playtimeMax !== undefined) {
    const minSeconds = (filters.playtimeMin ?? 0) * 3600;
    const maxSeconds = (filters.playtimeMax ?? Number.MAX_SAFE_INTEGER) * 3600;
    conditions.push(sql`
      EXISTS (
        SELECT 1
        FROM ${gameDurationsTable}
        WHERE ${gameDurationsTable.gameId} = ${gamesTable.id}
        AND ${gameDurationsTable.mainStorySeconds} IS NOT NULL
        AND ${gameDurationsTable.mainStorySeconds} >= ${minSeconds}
        AND ${gameDurationsTable.mainStorySeconds} <= ${maxSeconds}
      )
    `);
  }

  return conditions.length ? and(...conditions) : undefined;
}

export async function findGames({ page, pageSize, sort, ...filters }: FindGamesParams) {
  const where = buildWhere(filters);
  const orderBy = sort ? sortMap[sort] : defaultOrder;
  const offset = (page - 1) * pageSize;
  const needsDurationSort = sort !== undefined && durationSorts.has(sort);

  const baseSubquery = db
    .select({ id: gamesTable.id })
    .from(gamesTable)
    .where(where)
    .orderBy(...orderBy);

  const sq = needsDurationSort
    ? baseSubquery
        .leftJoin(gameDurationsTable, eq(gameDurationsTable.gameId, gamesTable.id))
        .limit(pageSize)
        .offset(offset)
        .as('subquery')
    : baseSubquery.limit(pageSize).offset(offset).as('subquery');

  return db
    .select({ ...gameColumns, ...durationColumns })
    .from(gamesTable)
    .innerJoin(sq, eq(gamesTable.id, sq.id))
    .leftJoin(gameDurationsTable, eq(gameDurationsTable.gameId, gamesTable.id))
    .orderBy(...orderBy)
    .then((rows) =>
      rows.map(({ mainStorySeconds, mainExtraSeconds, completionistSeconds, ...gameData }) => ({
        ...gameData,
        durations: { mainStorySeconds, mainExtraSeconds, completionistSeconds },
      })),
    );
}

export async function countGames(filters: GameFilters) {
  const where = buildWhere(filters);
  const result = await db.select({ total: count() }).from(gamesTable).where(where);
  return result[0]?.total ?? 0;
}

export async function findDurationRangeHours(): Promise<{
  minMainStoryHours: number;
  maxMainStoryHours: number;
}> {
  const result = await db
    .select({
      minMainStoryHours: sql<number>`FLOOR(MIN(${gameDurationsTable.mainStorySeconds}) / 3600.0)`,
      maxMainStoryHours: sql<number>`CEIL(MAX(${gameDurationsTable.mainStorySeconds}) / 3600.0)`,
    })
    .from(gameDurationsTable);
  // The pg driver returns numeric aggregates as strings at runtime despite the sql<number> hint.
  return {
    minMainStoryHours: Number(result[0]?.minMainStoryHours ?? 0),
    maxMainStoryHours: Number(result[0]?.maxMainStoryHours ?? 0),
  };
}

export async function findGameBySlug(slug: string) {
  const game = await db.query.gamesTable.findFirst({
    where: eq(gamesTable.slug, slug),
    columns: {
      scrapedAt: false,
      updatedAt: false,
      isDetailsScraped: false,
    },
    with: {
      gamePlatforms: {
        columns: {},
        with: { platform: { columns: { id: true, name: true } } },
      },
      gameGenres: {
        columns: {},
        with: { genre: { columns: { id: true, name: true } } },
      },
      gameDevelopers: {
        columns: {},
        with: { developer: { columns: { id: true, name: true } } },
      },
      duration: {
        columns: {
          mainStorySeconds: true,
          mainExtraSeconds: true,
          completionistSeconds: true,
        },
      },
    },
  });

  if (!game) return null;

  const { gamePlatforms, gameGenres, gameDevelopers, duration, ...gameData } = game;

  return {
    ...gameData,
    platforms: gamePlatforms.map((gp) => gp.platform),
    genres: gameGenres.map((gg) => gg.genre),
    developers: gameDevelopers.map((gd) => gd.developer),
    durations: duration ?? null,
  };
}
