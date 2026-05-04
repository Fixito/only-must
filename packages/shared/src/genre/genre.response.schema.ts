import z from 'zod';

import { GenreSchema } from './genre.schema.js';

export const GetGenresResponseSchema = z.object({
  data: z.array(GenreSchema),
});

export type GetGenresResponse = z.infer<typeof GetGenresResponseSchema>;
