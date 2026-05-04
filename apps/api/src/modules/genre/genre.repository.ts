import { asc } from 'drizzle-orm';

import { db } from '../../../db/client.js';
import { genresTable } from '../../../db/schemas/index.js';

export async function findGenres() {
  return db.select().from(genresTable).orderBy(asc(genresTable.name));
}
