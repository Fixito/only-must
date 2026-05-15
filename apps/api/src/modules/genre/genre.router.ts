import { GenreSchema } from '@only-must/shared';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import * as genreRepository from './genre.repository.js';

const router = Router();

function createGenreRouter() {
  router.get('/', async (_req, res) => {
    const genres = GenreSchema.array().parse(await genreRepository.findGenres());
    return res.status(StatusCodes.OK).json({ data: genres });
  });

  return router;
}

export const genreRouter: Router = createGenreRouter();
