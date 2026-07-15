ALTER TABLE "team_members" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "detail_bio" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "expertise" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "highlights" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_slug_unique" UNIQUE("slug");