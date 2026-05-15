import { GameSchema, GameWithRelationsSchema, type GamesQuery } from '@only-must/shared';

import { NotFoundError } from '@/errors/index.js';

import type { GameFilters } from './game.repository.js';
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
  const filters: GameFilters = {
    platforms,
    genres,
    search,
    releaseYear,
    releaseYearMin,
    releaseYearMax,
    playtimeMin,
    playtimeMax,
  };

  const [rows, total] = await Promise.all([
    gameRepository.findGames({ ...filters, page, pageSize, sort }),
    gameRepository.countGames(filters),
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
