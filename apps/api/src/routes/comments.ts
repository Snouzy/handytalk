import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { commentHistory } from "../db/schema";

export const commentsRouter: IRouter = Router();

commentsRouter.post("/", async (req, res) => {
  const { username, comment_text, style } = req.body;

  if (!username || !comment_text || !style) {
    res.status(400).json({ error: "username, comment_text, and style are required" });
    return;
  }

  const [row] = await db
    .insert(commentHistory)
    .values({
      instagramUsername: username,
      commentText: comment_text,
      style,
    })
    .returning();

  res.status(201).json(row);
});

commentsRouter.get("/:username/last", async (req, res) => {
  const { username } = req.params;

  const [row] = await db
    .select()
    .from(commentHistory)
    .where(eq(commentHistory.instagramUsername, username))
    .orderBy(desc(commentHistory.commentedAt))
    .limit(1);

  if (!row) {
    res.status(404).json({ error: "No comment found for this username" });
    return;
  }

  const now = new Date();
  const daysAgo = Math.max(
    0,
    Math.floor((now.getTime() - row.commentedAt.getTime()) / (1000 * 60 * 60 * 24))
  );

  res.json({
    username: row.instagramUsername,
    last_commented_at: row.commentedAt.toISOString(),
    days_ago: daysAgo,
  });
});
