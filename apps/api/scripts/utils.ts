export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

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
