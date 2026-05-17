import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { afterAll, describe, expect, it } from 'vitest';

import { gamesTable } from '../db/schemas/game/game.schema.js';
import { buildWhere, type GameFilters } from '../src/modules/game/game-filter.utils.js';

// Pool is never actually used to connect — .toSQL() only invokes the SQL dialect, not the client.
const fakePool = new Pool({ connectionString: 'postgresql://fake/test' });
const db = drizzle(fakePool);

afterAll(async () => {
  await fakePool.end();
});

function toSQL(filters: GameFilters) {
  return db.select({ id: gamesTable.id }).from(gamesTable).where(buildWhere(filters)).toSQL();
}

describe('buildWhere', () => {
  it('returns undefined when no filters are provided', () => {
    expect(buildWhere({})).toBeUndefined();
  });

  describe('text search', () => {
    it('adds an ILIKE condition with wildcard-wrapped search term', () => {
      const { sql, params } = toSQL({ search: 'zelda' });
      expect(sql).toContain('ILIKE');
      expect(params).toContain('%zelda%');
    });

    it('skips the search condition for an empty string', () => {
      expect(buildWhere({ search: '' })).toBeUndefined();
    });
  });

  describe('playtime → seconds conversion', () => {
    it('converts playtimeMin hours to seconds', () => {
      const { params } = toSQL({ playtimeMin: 5 });
      expect(params).toContain(18000); // 5h × 3600
    });

    it('converts playtimeMax hours to seconds', () => {
      const { params } = toSQL({ playtimeMax: 10 });
      expect(params).toContain(36000); // 10h × 3600
    });

    it('converts both bounds independently', () => {
      const { params } = toSQL({ playtimeMin: 5, playtimeMax: 10 });
      expect(params).toContain(18000);
      expect(params).toContain(36000);
    });
  });

  describe('release year', () => {
    it('adds a >= / <= range when only min/max are given', () => {
      const { sql, params } = toSQL({ releaseYearMin: 2000, releaseYearMax: 2010 });
      expect(sql).toContain('EXTRACT');
      expect(params).toContain(2000);
      expect(params).toContain(2010);
    });

    it('uses an exact = condition for releaseYear, ignoring min/max', () => {
      const { params } = toSQL({ releaseYear: 2005, releaseYearMin: 2000, releaseYearMax: 2010 });
      expect(params).toContain(2005);
      expect(params).not.toContain(2000);
      expect(params).not.toContain(2010);
    });

    it('handles releaseYearMin alone', () => {
      const { params } = toSQL({ releaseYearMin: 2015 });
      expect(params).toContain(2015);
    });
  });

  describe('multi-filter combination', () => {
    it('combines search, platforms, and genres into a single AND clause', () => {
      const { sql, params } = toSQL({ search: 'mario', platforms: ['ps4'], genres: ['action'] });
      expect(sql).toContain('ILIKE');
      expect((sql.match(/EXISTS/g) ?? []).length).toBe(2);
      expect(params).toContain('%mario%');
      expect(params).toContain('ps4');
      expect(params).toContain('action');
    });
  });
});
