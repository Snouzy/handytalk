CREATE TABLE "comment_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"instagram_username" varchar(64) NOT NULL,
	"commented_at" timestamp DEFAULT now() NOT NULL,
	"comment_text" text NOT NULL,
	"style" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_comment_history_username" ON "comment_history" USING btree ("instagram_username");