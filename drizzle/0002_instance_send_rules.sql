ALTER TABLE instances ADD COLUMN min_seconds integer DEFAULT 60 NOT NULL;
--> statement-breakpoint
ALTER TABLE instances ADD COLUMN max_seconds integer DEFAULT 180 NOT NULL;
--> statement-breakpoint
ALTER TABLE instances ADD COLUMN messages_per_cycle integer DEFAULT 10 NOT NULL;
--> statement-breakpoint
ALTER TABLE instances ADD COLUMN rest_minutes integer DEFAULT 20 NOT NULL;
