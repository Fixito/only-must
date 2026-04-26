import { pgTable, text } from 'drizzle-orm/pg-core';

export const platformsTable = pgTable('platforms', {
  id: text().primaryKey(),
  name: text().notNull().unique(),
});
