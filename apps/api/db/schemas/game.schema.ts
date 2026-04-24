import {
  boolean,
  date,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const gamesTable = pgTable(
  'games',
  {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    description: text().notNull(),
    slug: text().notNull().unique(),
    link: text().notNull(),
    image: text().notNull(),
    metaScore: smallint().notNull(),
    platform: text(),
    releaseDate: date('relase_date'),
    isMust: boolean().notNull().default(false),
    scrapedAt: timestamp('scraped_at').defaultNow(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex('games_slug_platform_idx').on(t.slug, t.platform)],
);

export type GameInsert = typeof gamesTable.$inferInsert;
