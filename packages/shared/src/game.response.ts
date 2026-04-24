import { z } from 'zod';

import { GameSchema } from './game.schema.js';

export const GetGamesResponseSchema = z.object({
  data: z.array(GameSchema),
  meta: z.object({
    total: z.number(),
    totalPages: z.number(),
    page: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

export type GetGamesResponse = z.infer<typeof GetGamesResponseSchema>;
