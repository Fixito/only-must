import type { SQL as SQLType } from 'drizzle-orm';
import { asc, count, eq, getTableColumns, sql } from 'drizzle-orm';

import { db } from '../../../db/client.js';
import { gamesTable } from '../../../db/schemas/game.schema.js';

interface FindGamesParams {
  where?: SQLType | undefined;
  page: number;
  pageSize: number;
}

export const findGames = async ({ where, page, pageSize }: FindGamesParams) => {
  const sq = db
    .select({ id: gamesTable.id })
    .from(gamesTable)
    .where(where)
    .orderBy(sql`${gamesTable.metaScore} DESC NULLS LAST`)
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .as('subquery');

  return db
    .select((({ scrapedAt, updatedAt, ...cols }) => cols)(getTableColumns(gamesTable)))
    .from(gamesTable)
    .innerJoin(sq, eq(gamesTable.id, sq.id))
    .orderBy(sql`${gamesTable.metaScore} DESC NULLS LAST`, asc(gamesTable.releaseDate));
};

export const countGames = async ({ where }: { where?: SQLType | undefined }) => {
  const result = await db.select({ total: count() }).from(gamesTable).where(where);
  return result[0]?.total ?? 0;
};
