import { GameSchema, GameWithRelationsSchema, type GamesQuery } from '@only-must/shared';

import { NotFoundError } from '@/errors/index.js';

import * as gameRepository from './game.repository.js';

const PAGE_SIZE = 24;

export async function getGames({ page, sort, ...filters }: GamesQuery) {
  const pageSize = PAGE_SIZE;

  const [rows, total] = await Promise.all([
    gameRepository.findGames({ ...filters, page, pageSize, sort }),
    gameRepository.countGames(filters),
  ]);

  const parsedRows = rows.map((game) => GameSchema.parse(game));

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

export function getGamesDurationRange() {
  return gameRepository.findDurationRangeHours();
}
