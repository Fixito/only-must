import { integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { gamesTable } from './game.schema.js';

export const gameDurationsTable = pgTable('game_durations', {
  id: uuid().primaryKey().defaultRandom(),
  hltbId: integer('hltb_id'),
  mainStorySeconds: integer('main_story_seconds'),
  mainExtraSeconds: integer('main_extra_seconds'),
  completionistSeconds: integer('completionist_seconds'),
  gameId: uuid('game_id')
    .notNull()
    .unique()
    .references(() => gamesTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type GameDuration = typeof gameDurationsTable.$inferSelect;
export type GameDurationInsert = typeof gameDurationsTable.$inferInsert;
