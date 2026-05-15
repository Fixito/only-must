import { z } from 'zod';

const currentYear = new Date().getFullYear();
const earliestYear = 1995;

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

    releaseYear: z.coerce.number().int().min(earliestYear).max(currentYear).optional(),
    releaseYearMin: z.coerce.number().int().min(earliestYear).max(currentYear).optional(),
    releaseYearMax: z.coerce.number().int().min(earliestYear).max(currentYear).optional(),

    platforms: arrayParam,
    genres: arrayParam,

    playtimeMin: z.coerce.number().int().min(0).optional(),
    playtimeMax: z.coerce.number().int().min(0).optional(),

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
  .transform((data) => ({
    ...data,
    platforms: data.platforms ?? [],
    genres: data.genres ?? [],
  }));

export type GamesQuery = z.infer<typeof GamesQuerySchema>;
