import { z } from 'zod';

export const ProblemDetailsSchema = z.object({
  status: z.number().int(),
  title: z.string(),
  detail: z.string().optional(),
});

export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;

export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}
