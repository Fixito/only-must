import { z } from 'zod';

import { GenreSchema } from '../genre/genre.schema.js';
import { PlatformSchema } from '../platform/platform.schema.js';

export const GameSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  image: z.string(),
  heroImage: z.string(),
  metaScore: z.number(),
  releaseDate: z.string().nullable(),
});

// --- relations ---

export const GameDurationSchema = z.object({
  mainStorySeconds: z.number().nullable(),
  mainExtraSeconds: z.number().nullable(),
  completionistSeconds: z.number().nullable(),
});

export const DeveloperSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// --- full object ---

export const GameWithRelationsSchema = GameSchema.extend({
  platforms: z.array(PlatformSchema),
  genres: z.array(GenreSchema),
  developers: z.array(DeveloperSchema),
  durations: GameDurationSchema.nullable(),
});

export type Game = z.infer<typeof GameSchema>;
