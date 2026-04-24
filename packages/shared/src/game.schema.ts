import { z } from 'zod';

export const GameSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  metaScore: z.number(),
  releaseDate: z.string(),
  isMust: z.boolean(),
});

export type Game = z.infer<typeof GameSchema>;
