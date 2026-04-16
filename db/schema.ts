import { pgTable, text, integer, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';

export const games = pgTable('games', {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  slug: text().notNull(),
  link: text().notNull(),
  image: text(),
  metaScore: integer(),
  releaseDate: timestamp(),
  isMust: boolean().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
