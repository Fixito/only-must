import { z } from 'zod';

export const LATEST_RELEASE_YEAR = new Date().getFullYear();
export const EARLIEST_RELEASE_YEAR = 1995;

const arrayParam = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((val) => {
    if (!val) return undefined;
    const arr = Array.isArray(val) ? val : [val];
    const cleaned = arr.map((item) => item.trim()).filter((item) => item !== '');
    return cleaned.length ? cleaned : undefined;
  });

export const GamesQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),

    search: z
      .string()
      .optional()
      .transform((val) => (val?.trim() ? val.trim() : undefined)),

    releaseYear: z.coerce
      .number()
      .int()
      .min(EARLIEST_RELEASE_YEAR)
      .max(LATEST_RELEASE_YEAR)
      .optional(),
    releaseYearMin: z.coerce
      .number()
      .int()
      .min(EARLIEST_RELEASE_YEAR)
      .max(LATEST_RELEASE_YEAR)
      .optional(),
    releaseYearMax: z.coerce
      .number()
      .int()
      .min(EARLIEST_RELEASE_YEAR)
      .max(LATEST_RELEASE_YEAR)
      .optional(),

    platforms: arrayParam,
    genres: arrayParam,

    playtimeMin: z.coerce.number().int().min(0).optional(),
    playtimeMax: z.coerce.number().int().min(0).optional(),

    metaScoreMin: z.coerce.number().int().min(0).max(100).optional(),
    metaScoreMax: z.coerce.number().int().min(0).max(100).optional(),

    sort: z
      .enum([
        'metascore-desc',
        'release-asc',
        'release-desc',
        'shortest-duration-asc',
        'longest-duration-desc',
      ])
      .optional(),
  })
  .refine(
    (data) => {
      if (data.releaseYear !== undefined) return true;

      if (data.releaseYearMin && data.releaseYearMax) {
        return data.releaseYearMin <= data.releaseYearMax;
      }

      return true;
    },
    {
      message: 'Invalid year range',
      path: ['releaseYearMin'],
    },
  )
  .refine(
    (data) => {
      if (data.playtimeMin !== undefined && data.playtimeMax !== undefined) {
        return data.playtimeMin <= data.playtimeMax;
      }
      return true;
    },
    {
      message: 'Invalid playtime range',
      path: ['playtimeMin'],
    },
  )
  .refine(
    (data) => {
      if (data.metaScoreMin !== undefined && data.metaScoreMax !== undefined) {
        return data.metaScoreMin <= data.metaScoreMax;
      }
      return true;
    },
    {
      message: 'Invalid metascore range',
      path: ['metaScoreMin'],
    },
  )
  .transform((data) => ({
    ...data,
    platforms: data.platforms ?? [],
    genres: data.genres ?? [],
  }));

export type GamesQuery = z.infer<typeof GamesQuerySchema>;

export const PAGE_SIZE = 24;

const durationSortKeys = new Set<NonNullable<GamesQuery['sort']>>([
  'shortest-duration-asc',
  'longest-duration-desc',
]);

export function isDurationSort(sort: GamesQuery['sort']): boolean {
  return sort !== undefined && durationSortKeys.has(sort);
}
