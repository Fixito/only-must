CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"link" text NOT NULL,
	"image" text,
	"metaScore" smallint,
	"platform" text,
	"relase_date" date,
	"isMust" boolean DEFAULT false NOT NULL,
	"scraped_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "games_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "games_slug_platform_idx" ON "games" USING btree ("slug","platform");