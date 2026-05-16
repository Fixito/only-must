import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { sendProblemDetails } from '@/lib/problem-details.js';

export function notFoundHandler(req: Request, res: Response) {
  sendProblemDetails(
    res,
    StatusCodes.NOT_FOUND,
    `Route ${req.method} ${req.originalUrl} not found`,
    {
      instance: req.originalUrl,
    },
  );
}
