CREATE TABLE `contact_events` (
	`id` text PRIMARY KEY NOT NULL,
	`contact_id` text NOT NULL,
	`event` text NOT NULL,
	`details` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `contact_events_contact_idx` ON `contact_events` (`contact_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`company` text NOT NULL,
	`responsible` text,
	`phone` text NOT NULL,
	`city` text NOT NULL,
	`notes` text,
	`status` text DEFAULT 'AGENDA' NOT NULL,
	`interested` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`imported_at` text,
	`last_sent_at` text,
	`last_instance` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contacts_phone_unique` ON `contacts` (`phone`);--> statement-breakpoint
CREATE INDEX `contacts_city_status_idx` ON `contacts` (`city`,`status`);--> statement-breakpoint
CREATE TABLE `instances` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`status` text DEFAULT 'DISCONNECTED' NOT NULL,
	`provider` text DEFAULT 'EVOLUTION_API' NOT NULL,
	`api_url` text,
	`token_cipher` text,
	`instance_token_cipher` text,
	`last_checked_at` text,
	`rest_until` text,
	`sent_in_cycle` integer DEFAULT 0 NOT NULL,
	`min_seconds` integer DEFAULT 60 NOT NULL,
	`max_seconds` integer DEFAULT 180 NOT NULL,
	`messages_per_cycle` integer DEFAULT 10 NOT NULL,
	`rest_minutes` integer DEFAULT 20 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `send_queue` (
	`id` text PRIMARY KEY NOT NULL,
	`contact_id` text NOT NULL,
	`status` text DEFAULT 'QUEUED' NOT NULL,
	`position` integer NOT NULL,
	`message` text,
	`instance_name` text,
	`created_at` text NOT NULL,
	`processing_at` text,
	`sent_at` text,
	`error` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `send_queue_active_contact_unique` ON `send_queue` (`contact_id`) WHERE "send_queue"."status" IN ('QUEUED','PROCESSING');--> statement-breakpoint
CREATE TABLE `send_rules` (
	`id` integer PRIMARY KEY NOT NULL,
	`min_seconds` integer DEFAULT 60 NOT NULL,
	`max_seconds` integer DEFAULT 180 NOT NULL,
	`messages_per_cycle` integer DEFAULT 10 NOT NULL,
	`rest_minutes` integer DEFAULT 20 NOT NULL,
	`switch_after` integer DEFAULT 10 NOT NULL,
	`queue_state` text DEFAULT 'PAUSED' NOT NULL,
	`updated_at` text NOT NULL
);
