import { pgTable, text } from 'drizzle-orm/pg-core';

export const developersTable = pgTable('developers', {
  id: text().primaryKey(),
  name: text().notNull().unique(),
});
