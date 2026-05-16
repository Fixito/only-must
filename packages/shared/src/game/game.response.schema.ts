import { z } from 'zod';

import { GameSchema, GameWithRelationsSchema } from './game.schema.js';

export const GamesDurationRangeSchema = z.object({
  // z.coerce handles the pg driver returning numeric strings; .int().nonnegative() enforces FLOOR/CEIL semantics
  minMainStoryHours: z.coerce.number().int().nonnegative(),
  maxMainStoryHours: z.coerce.number().int().nonnegative(),
});

export type GamesDurationRange = z.infer<typeof GamesDurationRangeSchema>;

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

export const GameWithRelationsResponseSchema = z.object({
  data: GameWithRelationsSchema,
});

export type GetGamesResponse = z.infer<typeof GetGamesResponseSchema>;
export type GameWithRelationsResponse = z.infer<typeof GameWithRelationsResponseSchema>;
