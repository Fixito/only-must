import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const GamesQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().optional(),
    platform: z.string().optional(),
    search: z.string().optional(),
    pageSize: z.coerce.number().int().positive().max(100).optional(),
    releaseYear: z.coerce.number().int().optional(),
    releaseYearMin: z.coerce
      .number()
      .refine((n) => n <= new Date().getFullYear())
      .int()
      .min(0)
      .max(currentYear)
      .optional(),
    releaseYearMax: z.coerce
      .number()
      .refine((n) => n <= new Date().getFullYear())
      .int()
      .min(0)
      .max(currentYear)
      .optional(),
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
