export interface PostContent {
  raw: string;
}

export interface ExtractMessage {
  action: "getPostContent" | "getAuthorUsername";
  includeComments?: boolean;
}

export interface ExtractResponse {
  content: string | null;
}

export interface AuthorUsernameResponse {
  username: string | null;
}
