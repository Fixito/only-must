import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import * as genreService from './genre.service.js';

const router = Router();

function createGenreRouter() {
  router.get('/', async (_req, res) => {
    const genres = await genreService.getGenres();
    return res.status(StatusCodes.OK).json({ data: genres });
  });

  return router;
}

export const genreRouter: Router = createGenreRouter();
