import { pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { genresTable } from '../genre/genre.schema.js';
import { gamesTable } from './game.schema.js';

export const gameGenresTable = pgTable(
  'game_genres',
  {
    gameId: uuid('game_id')
      .notNull()
      .references(() => gamesTable.id),
    genreId: text('genre_id')
      .notNull()
      .references(() => genresTable.id),
  },
  (t) => [primaryKey({ columns: [t.gameId, t.genreId] })],
);
