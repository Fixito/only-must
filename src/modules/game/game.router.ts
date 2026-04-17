import { desc, eq, and, sql, asc, count } from 'drizzle-orm';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { gamesTable } from '../../../db/schemas/game.schema.js';
import { db } from '../../../db/client.js';
import { gamesQuerySchema } from './game.schema.js';

interface GamesFilters {
  page?: number | undefined;
  pageSize?: number | undefined;
  releaseYear?: number | undefined;
  releaseYearMin?: number | undefined;
  releaseYearMax?: number | undefined;
  platform?: string | undefined;
}

const getGames = async ({
  page = 1,
  pageSize = 24,
  releaseYear,
  releaseYearMin,
  releaseYearMax,
  platform,
}: GamesFilters = {}) => {
  const conditions = [];

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
      .select()
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
