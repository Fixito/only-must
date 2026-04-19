import { z } from 'zod';

export const GamesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  platform: z.string().optional(),
  search: z.string().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  releaseYear: z.coerce.number().int().optional(),
  releaseYearMin: z.coerce.number().int().optional(),
  releaseYearMax: z.coerce.number().int().optional(),
});

export type GamesQuery = z.infer<typeof GamesQuerySchema>;
export const __forceEmitQuery = 1;
