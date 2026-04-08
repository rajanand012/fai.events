CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`icon_name` text,
	`display_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`destination` text NOT NULL,
	`province` text NOT NULL,
	`category` text NOT NULL,
	`summary_short` text NOT NULL,
	`summary_long` text NOT NULL,
	`why_special` text,
	`image_url` text,
	`source_url` text NOT NULL,
	`website_url` text,
	`booking_url` text,
	`social_link` text,
	`contact_link` text,
	`price_range` text,
	`price_note` text,
	`ai_score` real DEFAULT 0 NOT NULL,
	`ai_reasoning` text,
	`uniqueness_score` real DEFAULT 0,
	`luxury_score` real DEFAULT 0,
	`authenticity_score` real DEFAULT 0,
	`status` text DEFAULT 'pending' NOT NULL,
	`is_featured` integer DEFAULT 0,
	`tags` text,
	`best_time_to_visit` text,
	`duration` text,
	`discovered_at` text NOT NULL,
	`published_at` text,
	`updated_at` text NOT NULL,
	`pipeline_run_id` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `experiences_slug_unique` ON `experiences` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_experiences_status` ON `experiences` (`status`);--> statement-breakpoint
CREATE INDEX `idx_experiences_category` ON `experiences` (`category`);--> statement-breakpoint
CREATE INDEX `idx_experiences_province` ON `experiences` (`province`);--> statement-breakpoint
CREATE INDEX `idx_experiences_ai_score` ON `experiences` (`ai_score`);--> statement-breakpoint
CREATE INDEX `idx_experiences_slug` ON `experiences` (`slug`);--> statement-breakpoint
CREATE TABLE `pipeline_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`started_at` text NOT NULL,
	`completed_at` text,
	`status` text DEFAULT 'running',
	`sources_searched` integer DEFAULT 0,
	`candidates_found` integer DEFAULT 0,
	`evaluated` integer DEFAULT 0,
	`duplicates_skipped` integer DEFAULT 0,
	`published` integer DEFAULT 0,
	`errors` text,
	`trigger_type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `provinces` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`region` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `provinces_name_unique` ON `provinces` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `provinces_slug_unique` ON `provinces` (`slug`);--> statement-breakpoint
CREATE TABLE `seen_urls` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`first_seen_at` text NOT NULL,
	`experience_id` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `seen_urls_url_unique` ON `seen_urls` (`url`);--> statement-breakpoint
CREATE INDEX `idx_seen_urls_url` ON `seen_urls` (`url`);