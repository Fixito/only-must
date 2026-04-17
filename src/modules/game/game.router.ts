import { and, asc, count, desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { db } from '../../../db/client.js';
import { gamesTable } from '../../../db/schemas/game.schema.js';
import { gamesQuerySchema } from './game.schema.js';

interface GamesFilters {
  page?: number | undefined;
  pageSize?: number | undefined;
  platform?: string | undefined;
  search?: string | undefined;
  releaseYear?: number | undefined;
  releaseYearMin?: number | undefined;
  releaseYearMax?: number | undefined;
}

const getGames = async ({
  page = 1,
  pageSize = 24,
  platform,
  search,
  releaseYear,
  releaseYearMin,
  releaseYearMax,
}: GamesFilters = {}) => {
  const conditions = [];

  if (search) {
    conditions.push(sql`${gamesTable.title} ILIKE ${`%${search}%`}`);
  }

  if (releaseYear) {
    conditions.push(sql`EXTRACT(YEAR FROM ${gamesTable.releaseDate}) = ${releaseYear}`);
  } else {
    if (releaseYearMin) {
      conditions.push(sql`EXTRACT(YEAR FROM ${gamesTable.releaseDate}) >= ${releaseYearMin}`);
    }

    if (releaseYearMax) {
      conditions.push(sql`EXTRACT(YEAR FROM ${gamesTable.releaseDate}) <= ${releaseYearMax}`);
    }
  }

  if (platform) {
    conditions.push(eq(gamesTable.platform, platform));
  }

  const where = conditions.length ? and(...conditions) : undefined;

  const sq = db
    .select({ id: gamesTable.id })
    .from(gamesTable)
    .where(where)
    .orderBy(desc(gamesTable.metaScore))
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .as('subquery');

  const [rows, countResult] = await Promise.all([
    db
      .select((({ scrapedAt, updatedAt, ...cols }) => cols)(getTableColumns(gamesTable)))
      .from(gamesTable)
      .innerJoin(sq, eq(gamesTable.id, sq.id))
      .orderBy(sql`${gamesTable.metaScore} DESC NULLS LAST`, asc(gamesTable.title)),
    db.select({ total: count() }).from(gamesTable).where(where),
  ]);

  const total = countResult?.[0]?.total ?? 0;

  return { rows, total };
};

const router = Router();

function createGamesRouter() {
  router.get('/', async (req, res) => {
    const filters = gamesQuerySchema.parse(req.query);

    const { rows, total } = await getGames(filters);

    return res.status(StatusCodes.OK).json({ data: rows, total });
  });

  return router;
}

export const gamesRouter = createGamesRouter();
