export interface ExtractMessage {
  action: "getAuthorUsername";
}

export interface AuthorUsernameResponse {
  username: string | null;
}

export interface ScreenshotData {
  base64: string;
  mediaType: string;
}
