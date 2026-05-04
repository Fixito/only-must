import { GenreSchema } from '@only-must/shared';

import * as genreRepository from './genre.repository.js';

export async function getGenres() {
  const genres = await genreRepository.findGenres();
  return GenreSchema.array().parse(genres);
}
