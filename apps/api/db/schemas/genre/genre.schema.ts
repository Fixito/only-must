import { pgTable, text } from 'drizzle-orm/pg-core';

export const genresTable = pgTable('genres', {
  id: text().primaryKey(),
  name: text().notNull().unique(),
});
