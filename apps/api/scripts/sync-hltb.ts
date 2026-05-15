import { sql } from 'drizzle-orm';
import { HowLongToBeatService, type HowLongToBeatEntry } from 'howlongtobeat-ts';
import pLimit from 'p-limit';

import { db } from '../db/client.js';
import { gameDurationsTable, gamesTable } from '../db/schemas/index.js';
import { cleanTitle } from './utils.js';

const hltbService = new HowLongToBeatService();
const searchLimit = pLimit(50);

async function fetchDuration(game: typeof gamesTable.$inferSelect) {
  const searchTitle = game.hltbSearchOverride ?? game.title;

  if (game.hltbIdOverride) {
    // searchById doesn't exist, so we search by title and find by ID in results
    // Risk: if no results match, override is ignored — set hltb_id_override only for games that return results
    const result = await searchLimit(() => hltbService.search(searchTitle));
    const hltb = result.data.find((d) => d.id === game.hltbIdOverride);

    if (hltb) {
      console.info(`Using override for: ${game.title}`);
      return buildDuration(game.id, hltb);
    }

    // Fallback: try cleaned title variants to find the overridden ID
    for (const variant of cleanTitle(searchTitle)) {
      const fallback = await searchLimit(() => hltbService.search(variant));
      const hltb = fallback.data.find((d) => d.id === game.hltbIdOverride);
      if (hltb) return buildDuration(game.id, hltb);
    }

    console.warn(`Override ID ${game.hltbIdOverride} not found for: ${game.title}`);
    return null;
  }

  const titleVariants = cleanTitle(searchTitle);
  const yearMatch = game.title.match(/\((\d{4})\)$/);
  const year = yearMatch?.[1] ? parseInt(yearMatch[1]) : null;

  for (const variant of titleVariants) {
    const result = await searchLimit(() => hltbService.search(variant));
    if (!result.success || result.data.length === 0) continue;

    const hltb = year
      ? (result.data.find((d) => d.releaseYear === year) ?? result.data[0])
      : result.data[0];

    if (hltb) {
      if (variant !== game.title) console.info(`Matched "${game.title}" → "${variant}"`);
      return buildDuration(game.id, hltb);
    }
  }

  console.warn(`No HLTB data found for: ${game.title}`);
  return null;
}

function buildDuration(gameId: string, hltb: HowLongToBeatEntry) {
  return {
    gameId,
    hltbId: hltb.id,
    mainStorySeconds: hltb.mainTime,
    mainExtraSeconds: hltb.mainExtraTime,
    completionistSeconds: hltb.completionistTime,
  };
}

async function main() {
  const games = await db.select().from(gamesTable);

  const settled = await Promise.allSettled(
    games.map((game) => searchLimit(() => fetchDuration(game))),
  );

  const results = settled.map((s, i) => {
    if (s.status === 'rejected') {
      console.error(`Failed to fetch duration for ${games[i]?.title}:`, s.reason);
      return null;
    }
    return s.value;
  });

  const durations = results.filter((r) => r !== null);

  if (durations.length === 0) {
    console.warn('Nothing to insert.');
    return;
  }

  await db
    .insert(gameDurationsTable)
    .values(durations)
    .onConflictDoUpdate({
      target: gameDurationsTable.gameId,
      set: {
        hltbId: sql`excluded.hltb_id`,
        mainStorySeconds: sql`excluded.main_story_seconds`,
        mainExtraSeconds: sql`excluded.main_extra_seconds`,
        completionistSeconds: sql`excluded.completionist_seconds`,
      },
    });

  console.log(`Synced ${durations.length}/${games.length} games.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
