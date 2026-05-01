import { ApiError } from '@only-must/shared';
import { StatusCodes } from 'http-status-codes';

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, StatusCodes.FORBIDDEN);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource') {
    const trimmed = message.trim() || 'Resource';
    const lowerMessage = trimmed.toLowerCase();
    const alreadyHasNotFound =
      lowerMessage.endsWith('not found') || lowerMessage.endsWith('not found.');
    const finalMessage = alreadyHasNotFound ? trimmed : `${trimmed} not found`;
    super(finalMessage, StatusCodes.NOT_FOUND);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
