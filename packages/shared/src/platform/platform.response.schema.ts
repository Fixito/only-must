import z from 'zod';

import { PlatformSchema } from './platform.schema.js';

export const GetPlatformsResponseSchema = z.object({
  data: z.array(PlatformSchema),
});

export type GetPlatformsResponse = z.infer<typeof GetPlatformsResponseSchema>;
