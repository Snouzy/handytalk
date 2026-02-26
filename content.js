chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "getPostContent") {
    const content = extractPostContent(message.includeComments);
    sendResponse({ content });
  }
  return true;
});

function extractPostContent(includeComments) {
  const parts = [];
  const article = document.querySelector("article");
  if (!article) return null;

  // 1. Author username from header
  const authorEl = article.querySelector("header a[href]");
  const authorHref = authorEl?.getAttribute("href");
  const authorName = authorHref?.replace(/\//g, "") || authorEl?.textContent?.trim();
  if (authorName) {
    parts.push("[Auteur: @" + authorName + "]");
  }

  // 2. Image alt texts
  const images = article.querySelectorAll('img[alt]:not([alt=""])');
  images.forEach((img) => {
    const alt = img.alt?.trim();
    if (
      alt &&
      alt.length > 10 &&
      !alt.includes("profile picture") &&
      !alt.includes("photo de profil") &&
      !alt.includes("Photo de profil")
    ) {
      parts.push("[Image: " + alt + "]");
    }
  });

  // 3. Caption: the author's li has the extra class _a9z5
  //    Caption text is in h1 inside that li
  const captionLi = article.querySelector("li._a9z5");
  if (captionLi) {
    const h1 = captionLi.querySelector("h1");
    if (h1) {
      parts.push("[Caption]\n" + h1.textContent.trim());
    }
  }

  // 4. Comments (only if checkbox is checked)
  //    Comments are inside ul._a9ym, each li has h3 > a (username) + span._ap3a (text)
  if (includeComments) {
    const commentsList = article.querySelector("ul._a9ym");
    if (commentsList) {
      const commentItems = commentsList.querySelectorAll("li");
      const commentTexts = [];
      commentItems.forEach((li) => {
        const userEl = li.querySelector("h3 a");
        const textEl = li.querySelector("span._ap3a");
        const userName = userEl?.textContent?.trim();
        const text = textEl?.textContent?.trim();
        if (userName && text) {
          commentTexts.push("@" + userName + ": " + text);
        }
      });
      if (commentTexts.length > 0) {
        parts.push("[Commentaires]\n" + commentTexts.join("\n"));
      }
    }
  }

  // 5. Fallback: meta og:description
  if (parts.length <= 1) {
    const meta = document.querySelector('meta[property="og:description"]');
    if (meta) {
      const text = meta.getAttribute("content")?.trim();
      if (text) parts.push(text);
    }
  }

  return parts.join("\n\n") || null;
}
