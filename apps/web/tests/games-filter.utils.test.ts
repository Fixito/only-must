import { describe, expect, it, vi } from 'vitest';

import {
  buildFilterChips,
  formatPlaytimeRangeLabel,
  formatYearRangeLabel,
} from '@/features/games/utils/games-filter.utils.ts';

const BASE_SEARCH = {
  platforms: [],
  genres: [],
  page: 1,
  sort: 'metascore-desc' as const,
};
const PLATFORM_MAP = { pc: 'PC', ps5: 'PlayStation 5' };
const GENRE_MAP = { action: 'Action', rpg: 'RPG' };
const BOUNDS = { min: 0, max: 100 };

describe('buildFilterChips', () => {
  it('returns empty array when no filters are active', () => {
    expect(buildFilterChips(BASE_SEARCH, {}, {}, BOUNDS, vi.fn())).toHaveLength(0);
  });

  it('generates a chip per active platform', () => {
    const chips = buildFilterChips(
      { ...BASE_SEARCH, platforms: ['pc', 'ps5'] },
      PLATFORM_MAP,
      {},
      BOUNDS,
      vi.fn(),
    );
    expect(chips).toHaveLength(2);
    expect(chips[0]).toMatchObject({ key: 'platform-pc', label: 'PC' });
    expect(chips[1]).toMatchObject({ key: 'platform-ps5', label: 'PlayStation 5' });
  });

  it('falls back to the id when platform name is unknown', () => {
    const chips = buildFilterChips(
      { ...BASE_SEARCH, platforms: ['unknown-id'] },
      {},
      {},
      BOUNDS,
      vi.fn(),
    );
    expect(chips[0]?.label).toBe('unknown-id');
  });

  it('generates a chip per active genre', () => {
    const chips = buildFilterChips(
      { ...BASE_SEARCH, genres: ['action', 'rpg'] },
      {},
      GENRE_MAP,
      BOUNDS,
      vi.fn(),
    );
    expect(chips).toHaveLength(2);
    expect(chips[0]).toMatchObject({ key: 'genre-action', label: 'Action' });
  });

  it('generates a year-range chip when year bounds are set', () => {
    const chips = buildFilterChips(
      { ...BASE_SEARCH, releaseYearMin: 2010, releaseYearMax: 2020 },
      {},
      {},
      BOUNDS,
      vi.fn(),
    );
    expect(chips).toHaveLength(1);
    expect(chips[0]).toMatchObject({ key: 'year-range', label: '2010–2020' });
  });

  it('generates a playtime-range chip when playtime bounds are set', () => {
    const chips = buildFilterChips(
      { ...BASE_SEARCH, playtimeMin: 10, playtimeMax: 50 },
      {},
      {},
      BOUNDS,
      vi.fn(),
    );
    expect(chips).toHaveLength(1);
    expect(chips[0]).toMatchObject({ key: 'playtime-range', label: '10h–50h' });
  });

  it('calls onNavigate with the correct updater when platform chip is removed', () => {
    const onNavigate = vi.fn();
    const chips = buildFilterChips(
      { ...BASE_SEARCH, platforms: ['pc'] },
      PLATFORM_MAP,
      {},
      BOUNDS,
      onNavigate,
    );
    chips[0]?.onRemove();
    expect(onNavigate).toHaveBeenCalledOnce();
    const updater = onNavigate.mock.calls[0][0];
    const result = updater({ ...BASE_SEARCH, platforms: ['pc', 'ps5'] });
    expect(result.platforms).toEqual(['ps5']);
  });

  it('calls onNavigate with removeYearRange when year chip is removed', () => {
    const onNavigate = vi.fn();
    const chips = buildFilterChips(
      { ...BASE_SEARCH, releaseYearMin: 2010, releaseYearMax: 2020 },
      {},
      {},
      BOUNDS,
      onNavigate,
    );
    chips[0]?.onRemove();
    const updater = onNavigate.mock.calls[0][0];
    const result = updater({ ...BASE_SEARCH, releaseYearMin: 2010, releaseYearMax: 2020 });
    expect(result.releaseYearMin).toBeUndefined();
    expect(result.releaseYearMax).toBeUndefined();
  });
});

describe('formatYearRangeLabel', () => {
  it('formats a full min–max range', () => {
    expect(formatYearRangeLabel(2010, 2020)).toBe('2010–2020');
  });

  it('formats an open-ended range when only min is set', () => {
    expect(formatYearRangeLabel(2015, undefined)).toBe('2015–');
  });

  it('formats a range from start when only max is set', () => {
    expect(formatYearRangeLabel(undefined, 2018)).toBe('–2018');
  });
});

describe('formatPlaytimeRangeLabel', () => {
  it('formats with both min and max provided', () => {
    expect(formatPlaytimeRangeLabel(5, 20, { min: 0, max: 100 })).toBe('5h–20h');
  });

  it('falls back to fallback.min when min is undefined', () => {
    expect(formatPlaytimeRangeLabel(undefined, 30, { min: 0, max: 100 })).toBe('0h–30h');
  });

  it('falls back to fallback.max when max is undefined', () => {
    expect(formatPlaytimeRangeLabel(10, undefined, { min: 0, max: 100 })).toBe('10h–100h');
  });

  it('uses both fallbacks when both are undefined', () => {
    expect(formatPlaytimeRangeLabel(undefined, undefined, { min: 0, max: 100 })).toBe('0h–100h');
  });
});
