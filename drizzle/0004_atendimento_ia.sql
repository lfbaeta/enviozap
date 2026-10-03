CREATE TABLE `ai_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`instance_id` text NOT NULL,
	`contact_id` text NOT NULL,
	`provider_message_id` text NOT NULL,
	`incoming` text NOT NULL,
	`reply` text,
	`status` text DEFAULT 'RECEIVED' NOT NULL,
	`error` text,
	`created_at` text NOT NULL,
	`sent_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ai_message_provider_unique` ON `ai_messages` (`instance_id`,`provider_message_id`);--> statement-breakpoint
CREATE INDEX `ai_message_contact_idx` ON `ai_messages` (`contact_id`,`created_at`);--> statement-breakpoint
ALTER TABLE `contacts` ADD `ai_paused` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `instances` ADD `webhook_token_cipher` text;--> statement-breakpoint
ALTER TABLE `instances` ADD `webhook_status` text DEFAULT 'PENDING' NOT NULL;