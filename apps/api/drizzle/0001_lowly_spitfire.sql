CREATE TABLE "game_durations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hltb_id" integer,
	"main_story_seconds" integer,
	"main_extra_seconds" integer,
	"completionist_seconds" integer,
	"game_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "game_durations_game_id_unique" UNIQUE("game_id")
);
--> statement-breakpoint
ALTER TABLE "game_durations" ADD CONSTRAINT "game_durations_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;