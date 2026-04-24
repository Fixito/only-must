-- Remove any rows that have no image (cannot satisfy NOT NULL)
DELETE FROM "games" WHERE "image" IS NULL;
ALTER TABLE "games" ALTER COLUMN "image" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "metaScore" SET NOT NULL;
