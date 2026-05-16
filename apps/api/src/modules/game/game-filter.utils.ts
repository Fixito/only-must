import type { SQL as SQLType } from 'drizzle-orm';
import { and, inArray, sql } from 'drizzle-orm';

import { gamesTable } from '../../../db/schemas/game/game.schema.js';
import {
  gameDurationsTable,
  gameGenresTable,
  gamePlatformsTable,
} from '../../../db/schemas/index.js';

export interface GameFilters {
  platforms?: string[] | undefined;
  genres?: string[] | undefined;
  search?: string | undefined;
  releaseYear?: number | undefined;
  releaseYearMin?: number | undefined;
  releaseYearMax?: number | undefined;
  playtimeMin?: number | undefined;
  playtimeMax?: number | undefined;
  metaScoreMin?: number | undefined;
  metaScoreMax?: number | undefined;
}

export function buildWhere(filters: GameFilters): SQLType | undefined {
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

  if (filters.metaScoreMin !== undefined) {
    conditions.push(sql`${gamesTable.metaScore} >= ${filters.metaScoreMin}`);
  }

  if (filters.metaScoreMax !== undefined) {
    conditions.push(sql`${gamesTable.metaScore} <= ${filters.metaScoreMax}`);
  }

  return conditions.length ? and(...conditions) : undefined;
}
