export type ClaudeContentBlock =
  | { type: "text"; text: string }
  | { type: "image"; source: { type: "base64"; media_type: string; data: string } };

export interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: { role: "user" | "assistant"; content: string | ClaudeContentBlock[] }[];
}

export interface ClaudeResponse {
  content: { type: string; text: string }[];
}

export interface ParsedResult {
  comment: string;
  gifs: string[];
}
