import type { ParsedResult } from "@m6b9/shared";

export async function callClaude(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    if (res.status === 401) {
      throw new Error("Clé API invalide. Vérifiez vos paramètres.");
    }
    throw new Error(
      body?.error?.message || `Erreur API (${res.status})`
    );
  }

  const data = await res.json();
  const text = data.content?.[0]?.text?.trim();

  if (!text) {
    throw new Error("Réponse vide de Claude.");
  }

  return text;
}

export function parseResponse(raw: string): ParsedResult {
  const commentMatch = raw.match(/COMMENT:\s*(.+?)(?:\nGIFS:|$)/s);
  const gifsMatch = raw.match(/GIFS:\s*(.+)/s);

  const comment = commentMatch ? commentMatch[1].trim() : raw.trim();
  const gifs = gifsMatch
    ? gifsMatch[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return { comment, gifs };
}
