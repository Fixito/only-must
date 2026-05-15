import { z } from 'zod';

export const PlatformSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Platform = z.infer<typeof PlatformSchema>;

export const GetPlatformsResponseSchema = z.object({
  data: z.array(PlatformSchema),
});

export type GetPlatformsResponse = z.infer<typeof GetPlatformsResponseSchema>;
