export type CommentStyleKey =
  | "chill"
  | "controversial"
  | "expert"
  | "drole"
  | "curieux"
  | "hype";

export interface CommentStyleDef {
  key: CommentStyleKey;
  label: string;
  emoji: string;
  prompt: string;
}
