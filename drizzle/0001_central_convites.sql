CREATE TABLE IF NOT EXISTS contacts (
 id text PRIMARY KEY NOT NULL, company text NOT NULL, responsible text, phone text NOT NULL, city text NOT NULL, notes text,
 status text DEFAULT 'AGENDA' NOT NULL, interested integer DEFAULT 0 NOT NULL, created_at text NOT NULL, imported_at text,
 last_sent_at text, last_instance text
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS contacts_phone_unique ON contacts(phone);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS contacts_city_status_idx ON contacts(city,status);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS send_queue (
 id text PRIMARY KEY NOT NULL, contact_id text NOT NULL, status text DEFAULT 'QUEUED' NOT NULL, position integer NOT NULL,
 message text, instance_name text, created_at text NOT NULL, processing_at text, sent_at text, error text
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS send_queue_active_contact_unique ON send_queue(contact_id) WHERE status IN ('QUEUED','PROCESSING');
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS contact_events (
 id text PRIMARY KEY NOT NULL, contact_id text NOT NULL, event text NOT NULL, details text, created_at text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS contact_events_contact_idx ON contact_events(contact_id,created_at);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS send_rules (
 id integer PRIMARY KEY NOT NULL, min_seconds integer DEFAULT 60 NOT NULL, max_seconds integer DEFAULT 180 NOT NULL,
 messages_per_cycle integer DEFAULT 10 NOT NULL, rest_minutes integer DEFAULT 20 NOT NULL, switch_after integer DEFAULT 10 NOT NULL,
 queue_state text DEFAULT 'PAUSED' NOT NULL, updated_at text NOT NULL
);
--> statement-breakpoint
INSERT OR IGNORE INTO send_rules(id,min_seconds,max_seconds,messages_per_cycle,rest_minutes,switch_after,queue_state,updated_at)
VALUES(1,60,180,10,20,10,'PAUSED',datetime('now'));
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS instances (
 id text PRIMARY KEY NOT NULL, name text NOT NULL, status text DEFAULT 'DISCONNECTED' NOT NULL, api_url text, token_cipher text,
 last_checked_at text, rest_until text, sent_in_cycle integer DEFAULT 0 NOT NULL, created_at text NOT NULL, updated_at text NOT NULL
);

--> statement-breakpoint
ALTER TABLE instances ADD COLUMN provider text DEFAULT 'EVOLUTION_API';
--> statement-breakpoint
ALTER TABLE instances ADD COLUMN instance_token_cipher text;
