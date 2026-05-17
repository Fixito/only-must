import { ApiError } from '@only-must/shared';
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

import { env } from '@/config/env.js';
import { logger } from '@/config/logger.js';
import { sendProblemDetails } from '@/lib/problem-details.js';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const errors = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    logger.warn({ issues: errors, url: req.originalUrl }, 'Validation failed');

    return sendProblemDetails(res, StatusCodes.BAD_REQUEST, 'Validation failed', {
      instance: req.originalUrl,
      errors,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  const statusCode: StatusCodes =
    err instanceof ApiError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;

  const detail =
    statusCode === StatusCodes.INTERNAL_SERVER_ERROR && env.NODE_ENV !== 'development'
      ? 'An unexpected error occurred'
      : err.message;

  logger.error({ err, method: req.method, url: req.originalUrl, statusCode }, 'Request failed');

  return sendProblemDetails(res, statusCode, detail, {
    instance: req.originalUrl,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
