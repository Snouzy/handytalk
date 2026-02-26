const API_BASE = "http://localhost:3001";
export const SPAM_THRESHOLD_DAYS = 3;

export interface CommentHistoryEntry {
  id: string;
  comment_text: string;
  style: string;
  commented_at: string;
  days_ago: number;
}

export interface CommentHistoryResponse {
  username: string;
  total: number;
  most_recent_days_ago: number | null;
  comments: CommentHistoryEntry[];
}

export async function fetchCommentHistory(username: string): Promise<CommentHistoryResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/comments/${encodeURIComponent(username)}/history`);
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
