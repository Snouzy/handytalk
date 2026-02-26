import { pgTable, uuid, varchar, text, timestamp, index } from "drizzle-orm/pg-core";

export const commentHistory = pgTable(
  "comment_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instagramUsername: varchar("instagram_username", { length: 64 }).notNull(),
    commentedAt: timestamp("commented_at", { mode: "date" }).notNull().defaultNow(),
    commentText: text("comment_text").notNull(),
    style: varchar("style", { length: 32 }).notNull(),
  },
  (table) => [
    index("idx_comment_history_username").on(table.instagramUsername),
  ]
);
