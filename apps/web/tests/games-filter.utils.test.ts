import { describe, expect, it } from 'vitest';

import {
  formatPlaytimeRangeLabel,
  formatYearRangeLabel,
} from '@/features/games/utils/games-filter.utils.ts';

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
