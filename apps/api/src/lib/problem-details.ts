import type { Response } from 'express';
import { getReasonPhrase, type StatusCodes } from 'http-status-codes';

/**
 * Sends an RFC 9457 Problem Details response.
 * Sets Content-Type to application/problem+json and serializes
 * { title, status, detail, ...extras }.
 */
export function sendProblemDetails(
  res: Response,
  status: StatusCodes,
  detail: string,
  extras?: Record<string, unknown>,
): void {
  res
    .setHeader('Content-Type', 'application/problem+json')
    .status(status)
    .json({
      title: getReasonPhrase(status),
      status,
      detail,
      ...extras,
    });
}
