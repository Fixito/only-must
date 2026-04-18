import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { gamesQuerySchema } from './game.schema.js';
import * as gameService from './game.service.js';

const router = Router();

function createGamesRouter() {
  router.get('/', async (req, res) => {
    const filters = gamesQuerySchema.parse(req.query);

    const { rows, total } = await gameService.getGames(filters);

    return res.status(StatusCodes.OK).json({ data: rows, total });
  });

  return router;
}

export const gamesRouter: Router = createGamesRouter();
