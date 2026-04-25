import { pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { platformsTable } from '../platform/platform.schema.js';
import { gamesTable } from './game.schema.js';

export const gamePlatformsTable = pgTable(
  'game_platforms',
  {
    gameId: uuid('game_id')
      .notNull()
      .references(() => gamesTable.id, { onDelete: 'cascade' }),
    platformId: text('platform_id')
      .notNull()
      .references(() => platformsTable.id),
  },
  (t) => [primaryKey({ columns: [t.gameId, t.platformId] })],
);
