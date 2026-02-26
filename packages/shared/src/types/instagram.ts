export interface PostContent {
  raw: string;
}

export interface ExtractMessage {
  action: "getPostContent";
  includeComments: boolean;
}

export interface ExtractResponse {
  content: string | null;
}
