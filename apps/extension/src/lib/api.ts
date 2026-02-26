const API_BASE = "http://localhost:3001";
export const SPAM_THRESHOLD_DAYS = 3;

export interface LastCommentInfo {
  username: string;
  last_commented_at: string;
  days_ago: number;
}

export async function checkLastComment(username: string): Promise<LastCommentInfo | null> {
  try {
    const res = await fetch(`${API_BASE}/api/comments/${encodeURIComponent(username)}/last`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function recordComment(username: string, commentText: string, style: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, comment_text: commentText, style }),
    });
  } catch {
    // fail silently
  }
}
