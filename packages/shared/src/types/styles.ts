export type CommentStyleKey =
  | "chill"
  | "controversial"
  | "expert"
  | "drole"
  | "curieux"
  | "hype";

export type CommentLanguage = "fr" | "en";

export interface CommentStyleDef {
  key: CommentStyleKey;
  label: string;
  emoji: string;
  prompt: string;
}
