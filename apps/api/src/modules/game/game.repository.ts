import { asc, count, desc, eq, getTableColumns, sql } from 'drizzle-orm';

import { db } from '../../../db/client.js';
import { gamesTable } from '../../../db/schemas/game/game.schema.js';
import { gameDurationsTable } from '../../../db/schemas/index.js';
import { buildWhere, type GameFilters } from './game-filter.utils.js';

const defaultOrder = [
  sql`${gamesTable.metaScore} DESC NULLS LAST`,
  asc(gamesTable.releaseDate),
  asc(gamesTable.id),
];

export const sortMap = {
  'metascore-desc': defaultOrder,
  'release-asc': [
    asc(gamesTable.releaseDate),
    sql`${gamesTable.metaScore} DESC NULLS LAST`,
    asc(gamesTable.id),
  ],
  'release-desc': [
    desc(gamesTable.releaseDate),
    sql`${gamesTable.metaScore} DESC NULLS LAST`,
    asc(gamesTable.id),
  ],
  'shortest-duration-asc': [
    sql`${gameDurationsTable.mainStorySeconds} ASC NULLS LAST`,
    asc(gamesTable.releaseDate),
    asc(gamesTable.id),
  ],
  'longest-duration-desc': [
    sql`${gameDurationsTable.mainStorySeconds} DESC NULLS LAST`,
    desc(gamesTable.releaseDate),
    asc(gamesTable.id),
  ],
};

export type { GameFilters } from './game-filter.utils.js';

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
