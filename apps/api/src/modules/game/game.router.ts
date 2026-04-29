import { GamesQuerySchema } from '@only-must/shared';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotFoundError } from '@/errors/index.js';

import * as gameService from './game.service.js';

const router = Router();

function createGameRouter() {
  router.get('/', async (req, res) => {
    const filters = GamesQuerySchema.parse(req.query);

    const { rows, total, totalPages, page, hasNext, hasPrev } = await gameService.getGames(filters);

    return res
      .status(StatusCodes.OK)
      .json({ data: rows, meta: { page, total, totalPages, hasNext, hasPrev } });
  });

  router.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    const game = await gameService.getGameBySlug(slug);

    if (!game) {
      throw new NotFoundError(`Game with slug "${slug}" not found`);
    }

    return res.status(StatusCodes.OK).json({ data: game });
  });

  return router;
}

export const gameRouter: Router = createGameRouter();
