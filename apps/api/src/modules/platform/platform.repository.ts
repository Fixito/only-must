import { asc } from 'drizzle-orm';

import { db } from '../../../db/client.js';
import { platformsTable } from '../../../db/schemas/index.js';

export async function findPlatforms() {
  return db.select().from(platformsTable).orderBy(asc(platformsTable.name));
}
