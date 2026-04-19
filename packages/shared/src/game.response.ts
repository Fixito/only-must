import { z } from 'zod';

import { GameSchema } from './game.schema.js';

export const GetGamesResponseSchema = z.object({
  data: z.array(GameSchema),
  total: z.number(),
});

export type GetGamesResponse = z.infer<typeof GetGamesResponseSchema>;
