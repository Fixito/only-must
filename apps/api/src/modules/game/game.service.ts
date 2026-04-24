import { and, eq, sql } from 'drizzle-orm';

import { gamesTable } from '../../../db/schemas/game.schema.js';
import * as gameRepository from './game.repository.js';

export interface GamesFilters {
  page?: number | undefined;
  pageSize?: number | undefined;
  platform?: string | undefined;
  search?: string | undefined;
  releaseYear?: number | undefined;
  releaseYearMin?: number | undefined;
  releaseYearMax?: number | undefined;
}

export const getGames = async ({
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

  const [rows, total] = await Promise.all([
    gameRepository.findGames({ where, page, pageSize }),
    gameRepository.countGames({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return { rows, total, totalPages, page, hasNext: page < totalPages, hasPrev: page > 1 };
};
