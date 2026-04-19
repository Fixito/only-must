import { GamesQuerySchema } from '@only-must/shared';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import * as gameService from './game.service.js';

const router = Router();

function createGamesRouter() {
  router.get('/', async (req, res) => {
    const filters = GamesQuerySchema.parse(req.query);

    const { rows, total, totalPages, page, hasNext, hasPrev } = await gameService.getGames(filters);

    return res
      .status(StatusCodes.OK)
      .json({ data: rows, meta: { page, total, totalPages, hasNext, hasPrev } });
  });

  return router;
}

export const gamesRouter: Router = createGamesRouter();
