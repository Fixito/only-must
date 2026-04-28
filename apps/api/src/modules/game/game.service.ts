import { GameSchema, GameWithRelationsSchema } from '@only-must/shared';
import type { SQL } from 'drizzle-orm';
import { and, inArray, sql } from 'drizzle-orm';

import { gamesTable } from '../../../db/schemas/game/game.schema.js';
import { gameGenresTable, gamePlatformsTable } from '../../../db/schemas/index.js';
import * as gameRepository from './game.repository.js';

export interface GamesFilters {
  page?: number | undefined;
  pageSize?: number | undefined;
  platforms?: string[] | undefined;
  genres?: string[] | undefined;
  search?: string | undefined;
  releaseYear?: number | undefined;
  releaseYearMin?: number | undefined;
  releaseYearMax?: number | undefined;
}

export const getGames = async ({
  page = 1,
  pageSize = 24,
  platforms,
  genres,
  search,
  releaseYear,
  releaseYearMin,
  releaseYearMax,
}: GamesFilters = {}) => {
  const conditions: SQL[] = [];

  if (search) {
    conditions.push(sql`${gamesTable.title} ILIKE ${`%${search}%`}`);
  }

  if (releaseYear != null) {
    conditions.push(sql`
      ${gamesTable.releaseDate} IS NOT NULL
      AND EXTRACT(YEAR FROM ${gamesTable.releaseDate}) = ${releaseYear}
    `);
  } else {
    if (releaseYearMin) {
      conditions.push(sql`
      ${gamesTable.releaseDate} IS NOT NULL
      AND EXTRACT(YEAR FROM ${gamesTable.releaseDate}) >= ${releaseYearMin}`);
    }

    if (releaseYearMax) {
      conditions.push(sql`
      ${gamesTable.releaseDate} IS NOT NULL
      AND EXTRACT(YEAR FROM ${gamesTable.releaseDate}) <= ${releaseYearMax}`);
    }
  }

  if (platforms?.length) {
    conditions.push(sql`
		EXISTS (
			SELECT 1
			FROM ${gamePlatformsTable}
			WHERE ${gamePlatformsTable.gameId} = ${gamesTable.id}
			AND ${inArray(gamePlatformsTable.platformId, platforms)}
		)
	`);
  }

  if (genres?.length) {
    conditions.push(sql`
		EXISTS (
			SELECT 1
			FROM ${gameGenresTable}
			WHERE ${gameGenresTable.gameId} = ${gamesTable.id}
			AND ${inArray(gameGenresTable.genreId, genres)}
		)
	`);
  }

  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, total] = await Promise.all([
    gameRepository.findGames({ where, page, pageSize }),
    gameRepository.countGames({ where }),
  ]);

  const parsedRows = rows.map((row) => GameSchema.parse(row));

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    rows: parsedRows,
    total,
    totalPages,
    page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

export const getGameBySlug = async (slug: string) => {
  const game = await gameRepository.findGameBySlug(slug);
  if (!game) return null;
  return GameWithRelationsSchema.parse(game);
};
