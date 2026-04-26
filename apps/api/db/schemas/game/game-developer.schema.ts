import { pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { developersTable } from '../developer/developer.schema.js';
import { gamesTable } from './game.schema.js';

export const gameDevelopersTable = pgTable(
  'game_developers',
  {
    gameId: uuid('game_id')
      .notNull()
      .references(() => gamesTable.id, { onDelete: 'cascade' }),
    developerId: text('developer_id')
      .notNull()
      .references(() => developersTable.id),
  },
  (t) => [primaryKey({ columns: [t.gameId, t.developerId] })],
);
