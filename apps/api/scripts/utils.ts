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

const TITLE_CLEANERS: Array<(title: string) => string> = [
  // Remove trailing parenthetical (year or qualifier): "(2005)", "(Remake)"
  (t) => t.replace(/\s*\([^)]+\)\s*$/, '').trim(),
  // Remove edition suffixes
  (t) =>
    t
      .replace(
        /\s*[-–]\s*(Definitive|Complete|Enhanced|Ultimate|Gold|Become as Gods)\s+Edition$/i,
        '',
      )
      .trim(),
  // Take first part of a bundle: "Bayonetta + Bayonetta 2" → "Bayonetta"
  (t) => t.split(/\s*\+\s*/)[0]?.trim() ?? t,
  // Take first part before " / ": "A Link to the Past / Four Swords" → "A Link to the Past"
  (t) => t.split(/\s*\/\s*/)[0]?.trim() ?? t,
  // Remove subtitle after ": ": "Shovel Knight: Treasure Trove" → "Shovel Knight"
  (t) => t.split(/:\s*/)[0]?.trim() ?? t,
];

export function cleanTitle(title: string): string[] {
  const variants = new Set<string>([title]);
  let current = title;

  for (const cleaner of TITLE_CLEANERS) {
    const cleaned = cleaner(current);
    if (cleaned !== current) {
      variants.add(cleaned);
      current = cleaned;
    }
  }

  return [...variants];
}
