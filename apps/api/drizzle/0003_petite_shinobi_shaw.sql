ALTER TABLE "games" ADD COLUMN "hltb_id_override" integer;--> statement-breakpoint
DO $$
BEGIN
  UPDATE "games"
  SET "hltb_id_override" = "game_durations"."hltb_id_override"
  FROM "game_durations"
  WHERE "games"."id" = "game_durations"."game_id"
    AND "game_durations"."hltb_id_override" IS NOT NULL;
END $$;--> statement-breakpoint
ALTER TABLE "game_durations" DROP COLUMN "hltb_id_override";