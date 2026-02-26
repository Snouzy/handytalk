export interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: { role: "user" | "assistant"; content: string }[];
}

export interface ClaudeResponse {
  content: { type: string; text: string }[];
}

export interface ParsedResult {
  comment: string;
  gifs: string[];
}
