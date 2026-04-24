import { z } from 'zod';

export const GameSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  metaScore: z.number().nullable(),
  releaseDate: z.string().nullable(),
  isMust: z.boolean(),
});

export type Game = z.infer<typeof GameSchema>;
