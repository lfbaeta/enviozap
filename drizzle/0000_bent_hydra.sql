CREATE TABLE `sends` (
	`id` text PRIMARY KEY NOT NULL,
	`company` text NOT NULL,
	`phone` text NOT NULL,
	`message` text NOT NULL,
	`type` text NOT NULL,
	`opened_at` text NOT NULL,
	`status` text DEFAULT 'opened' NOT NULL,
	`confirmed_at` text
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`config_json` text NOT NULL,
	`key_cipher` text,
	`updated_at` text NOT NULL
);
