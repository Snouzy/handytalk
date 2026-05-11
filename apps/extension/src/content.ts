import type { ExtractMessage, AuthorUsernameResponse } from "@handytalk/shared";

const API_BASE = "http://localhost:3456";
const SPAM_THRESHOLD_DAYS = 3;
const BADGE_ID = "handytalk-badge";

// --- Popup communication ---
chrome.runtime.onMessage.addListener(
  (message: ExtractMessage, _sender, sendResponse: (r: AuthorUsernameResponse) => void) => {
    if (message.action === "getAuthorUsername") {
      sendResponse({ username: extractAuthorUsername() });
    }
    return true;
  }
);

// --- Username extraction ---
function extractAuthorUsername(): string | null {
  // Post page: extract from article header
  const article = document.querySelector("article");
  if (article) {
    const authorEl = article.querySelector("header a[href]");
    const authorHref = authorEl?.getAttribute("href");
    return authorHref?.replace(/\//g, "") || authorEl?.textContent?.trim() || null;
  }

  // Profile page: extract from URL (instagram.com/username/)
  const match = window.location.pathname.match(/^\/([^/]+)\/?$/);
  if (match && !["explore", "reels", "stories", "direct", "accounts"].includes(match[1])) {
    return match[1];
  }

  return null;
}

// --- Badge injection into Instagram page ---
function findBadgeAnchor(username: string): Element | null {
  // Profile page: h2 containing the username
  const h2 = document.querySelector("h2");
  if (h2 && h2.textContent?.trim() === username) {
    return h2.closest("a") || h2;
  }

  // Post page: text link to profile in article header (skip avatar links)
  const article = document.querySelector("article");
  if (article) {
    const links = article.querySelectorAll(`header a[href="/${username}/"]`);
    for (const link of links) {
      if (!link.querySelector("img, canvas")) return link;
    }
  }

  return null;
}

async function injectCommentBadge() {
  document.getElementById(BADGE_ID)?.remove();

  const username = extractAuthorUsername();
  if (!username) return;

  let data: { total: number; most_recent_days_ago: number | null };
  try {
    const res = await fetch(`${API_BASE}/api/comments/${encodeURIComponent(username)}/history`);
    if (!res.ok) return;
    data = await res.json();
  } catch {
    return;
  }
  if (data.total === 0) return;

  const anchor = findBadgeAnchor(username);
  if (!anchor) return;

  const isRecent =
    data.most_recent_days_ago !== null &&
    data.most_recent_days_ago < SPAM_THRESHOLD_DAYS;

  let timeLabel: string;
  if (data.most_recent_days_ago === 0) timeLabel = "aujourd'hui";
  else if (data.most_recent_days_ago === 1) timeLabel = "hier";
  else timeLabel = `il y a ${data.most_recent_days_ago}j`;

  const badge = document.createElement("span");
  badge.id = BADGE_ID;
  badge.textContent = isRecent
    ? `⚠️ ${data.total} comm. · ${timeLabel}`
    : `📝 ${data.total} comm.`;
  badge.style.cssText = [
    "display:inline-flex",
    "align-items:center",
    "margin-left:8px",
    "padding:2px 10px",
    "border-radius:12px",
    "font-size:12px",
    "font-weight:600",
    "line-height:20px",
    "vertical-align:middle",
    "white-space:nowrap",
    `background:${isRecent ? "rgba(234,88,12,0.1)" : "rgba(139,92,246,0.1)"}`,
    `color:${isRecent ? "#ea580c" : "#7c3aed"}`,
    `border:1px solid ${isRecent ? "rgba(234,88,12,0.3)" : "rgba(139,92,246,0.3)"}`,
  ].join(";");

  anchor.insertAdjacentElement("afterend", badge);
}

// --- SPA navigation observer (Instagram doesn't do full page reloads) ---
let lastUrl = location.href;
let debounceTimer: ReturnType<typeof setTimeout>;

const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const urlChanged = location.href !== lastUrl;
    if (urlChanged) lastUrl = location.href;
    // Re-inject if URL changed or badge was removed by Instagram re-render
    if (urlChanged || !document.getElementById(BADGE_ID)) {
      injectCommentBadge();
    }
  }, 500);
});

observer.observe(document.body, { subtree: true, childList: true });

// Initial injection (wait for Instagram to render)
setTimeout(injectCommentBadge, 800);
