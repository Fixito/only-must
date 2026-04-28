import { z } from 'zod';

const currentYear = new Date().getFullYear();
const earliestYear = 1991;

const arrayParam = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((val) => {
    if (!val) return undefined;
    return Array.isArray(val) ? val : [val];
  });

export const GamesQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().optional(),

    search: z.string().optional(),

    releaseYear: z.coerce.number().int().optional(),
    releaseYearMin: z.coerce.number().int().min(earliestYear).max(currentYear).optional(),
    releaseYearMax: z.coerce.number().int().min(earliestYear).max(currentYear).optional(),

    platforms: arrayParam,
    genres: arrayParam,
  })
  .refine(
    (data) =>
      data.releaseYearMin === undefined ||
      data.releaseYearMax === undefined ||
      data.releaseYearMin <= data.releaseYearMax,
    {
      message: 'Invalid year range',
      path: ['releaseYearMin'],
    },
  );

export type GamesQuery = z.infer<typeof GamesQuerySchema>;
