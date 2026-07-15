CREATE TYPE "public"."gallery_layout" AS ENUM('grid', 'masonry');--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" integer NOT NULL,
	"src" text NOT NULL,
	"alt" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"layout" "gallery_layout" DEFAULT 'masonry' NOT NULL,
	"columns" integer DEFAULT 4 NOT NULL,
	"sort_order" integer NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "hero_images" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_section_id_gallery_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."gallery_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gallery_images_section_idx" ON "gallery_images" USING btree ("section_id");