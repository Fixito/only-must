import z from 'zod';

export const GetPlatformsResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
});

export type GetPlatformsResponse = z.infer<typeof GetPlatformsResponseSchema>;
