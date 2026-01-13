CREATE TABLE IF NOT EXISTS "builds" (
	"id" serial PRIMARY KEY NOT NULL,
	"build" text NOT NULL,
	"project" text NOT NULL,
	"date" text NOT NULL,
	"link" text NOT NULL,
	"number_of_failures" text NOT NULL,
	"subject" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"imap" text NOT NULL,
	"email" text NOT NULL,
	"apiKey" text NOT NULL,
	"projects" text NOT NULL,
	"bookmarks" text,
	"lastDeploy" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"build" text NOT NULL,
	"number" integer NOT NULL,
	"name" text NOT NULL,
	"content" text NOT NULL
);
