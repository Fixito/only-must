import { boolean, date, pgTable, smallint, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const gamesTable = pgTable('games', {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text().notNull(),
  slug: text().notNull().unique(),
  link: text().notNull(),
  image: text().notNull(),
  metaScore: smallint().notNull().default(0),
  isMust: boolean().notNull().default(false),
  releaseDate: date('release_date'),
  isDetailsScraped: boolean('is_details_scraped').notNull().default(false),
  scrapedAt: timestamp('scraped_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Game = typeof gamesTable.$inferSelect;
export type GameInsert = typeof gamesTable.$inferInsert;
