import { z } from 'zod';

export const GameSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string().nullable(),
  metaScore: z.number().nullable(),
  releaseDate: z.string().nullable(),
  isMust: z.boolean(),
});

export type Game = z.infer<typeof GameSchema>;
