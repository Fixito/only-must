/**
 * Delays execution for the given number of milliseconds.
 *
 * @param ms - The number of milliseconds to wait
 * @returns A promise that resolves after `ms` milliseconds
 */
export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Attempts an asynchronous operation up to a number of times, applying exponential backoff between attempts.
 *
 * Uses the provided `fn` as the operation to execute. If `fn` succeeds on any attempt its resolved value is returned; if all attempts fail the last error is rethrown.
 *
 * @param fn - The asynchronous operation to execute on each attempt.
 * @param retries - Maximum number of attempts (default: 3).
 * @param delay - Base delay in milliseconds used for exponential backoff; the wait before attempt N is `delay * 2^(N-1)` (default: 2000).
 * @returns The resolved value from a successful invocation of `fn`.
 * @throws The error thrown by the final failed attempt of `fn` when all retries are exhausted.
 */
export async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`⚠️  Retry ${i + 1}/${retries}...`);
      await sleep(delay * 2 ** i); // 2s, 4s, 8s
    }
  }

  throw new Error('unreachable');
}
