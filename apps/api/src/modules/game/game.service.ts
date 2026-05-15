import { GameSchema, GameWithRelationsSchema, type GamesQuery } from '@only-must/shared';
import type { SQL } from 'drizzle-orm';
import { and, inArray, sql } from 'drizzle-orm';

import { NotFoundError } from '@/errors/index.js';

import { gamesTable } from '../../../db/schemas/game/game.schema.js';
import {
  gameDurationsTable,
  gameGenresTable,
  gamePlatformsTable,
} from '../../../db/schemas/index.js';
import * as gameRepository from './game.repository.js';

const PAGE_SIZE = 24;

export async function getGames({
  page,
  platforms,
  genres,
  search,
  releaseYear,
  releaseYearMin,
  releaseYearMax,
  playtimeMin,
  playtimeMax,
  sort,
}: GamesQuery) {
  const pageSize = PAGE_SIZE;
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

  if (playtimeMin !== undefined || playtimeMax !== undefined) {
    const minSeconds = (playtimeMin ?? 0) * 3600;
    const maxSeconds = (playtimeMax ?? Number.MAX_SAFE_INTEGER) * 3600;
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

  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, total] = await Promise.all([
    gameRepository.findGames({ where, page, pageSize, sort }),
    gameRepository.countGames({ where }),
  ]);

  const parsedRows = rows.map(
    ({ mainStorySeconds, mainExtraSeconds, completionistSeconds, ...gameData }) =>
      GameSchema.parse({
        ...gameData,
        durations: {
          mainStorySeconds,
          mainExtraSeconds,
          completionistSeconds,
        },
      }),
  );

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    rows: parsedRows,
    total,
    totalPages,
    page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export async function getGameBySlug(slug: string) {
  const game = await gameRepository.findGameBySlug(slug);
  if (!game) throw new NotFoundError('Game');
  return GameWithRelationsSchema.parse(game);
}

export async function getGamesDurationRange() {
  const { minHours, maxHours } = await gameRepository.findDurationRangeHours();
  return { minMainStoryHours: minHours, maxMainStoryHours: maxHours };
}
