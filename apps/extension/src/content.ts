import type { ExtractMessage, AuthorUsernameResponse } from "@handytalk/shared";

chrome.runtime.onMessage.addListener(
  (message: ExtractMessage, _sender, sendResponse: (r: AuthorUsernameResponse) => void) => {
    if (message.action === "getAuthorUsername") {
      sendResponse({ username: extractAuthorUsername() });
    }
    return true;
  }
);

function extractAuthorUsername(): string | null {
  // On a post page: extract from article header
  const article = document.querySelector("article");
  if (article) {
    const authorEl = article.querySelector("header a[href]");
    const authorHref = authorEl?.getAttribute("href");
    return authorHref?.replace(/\//g, "") || authorEl?.textContent?.trim() || null;
  }

  // On a profile page: extract username from URL (instagram.com/username/)
  const match = window.location.pathname.match(/^\/([^/]+)\/?$/);
  if (match && !["explore", "reels", "stories", "direct", "accounts"].includes(match[1])) {
    return match[1];
  }

  return null;
}
