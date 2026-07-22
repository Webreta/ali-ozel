CREATE TABLE "analytics_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"visitor_id" integer NOT NULL,
	"type" text NOT NULL,
	"path" text NOT NULL,
	"key" text,
	"label" text,
	"value" integer,
	"referrer" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analytics_visitors" (
	"id" serial PRIMARY KEY NOT NULL,
	"hash" text NOT NULL,
	"ip_masked" text NOT NULL,
	"device" text DEFAULT 'desktop' NOT NULL,
	"browser" text,
	"os" text,
	"is_admin" boolean DEFAULT false NOT NULL,
	"event_count" integer DEFAULT 0 NOT NULL,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "analytics_visitors_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_visitor_id_analytics_visitors_id_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."analytics_visitors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytics_events_visitor_idx" ON "analytics_events" USING btree ("visitor_id","created_at");--> statement-breakpoint
CREATE INDEX "analytics_events_type_idx" ON "analytics_events" USING btree ("type","created_at");--> statement-breakpoint
CREATE INDEX "analytics_events_path_idx" ON "analytics_events" USING btree ("path");