import { z } from 'zod';

export const gamesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  releaseYear: z.coerce.number().int().optional(),
  releaseYearMin: z.coerce.number().int().optional(),
  releaseYearMax: z.coerce.number().int().optional(),
  platform: z.string().optional(),
});
