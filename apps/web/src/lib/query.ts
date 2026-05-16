import { ApiError } from '@only-must/shared';
import { notFound } from '@tanstack/react-router';

/**
 * Runs `fetcher` and converts a 404 ApiError into TanStack Router's
 * `notFound()` throw, letting all other errors propagate.
 */
export async function ensureQueryDataOrNotFound<T>(fetcher: () => Promise<T>): Promise<T> {
  try {
    return await fetcher();
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) throw notFound();
    throw error;
  }
}
