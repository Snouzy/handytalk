import { useState, useCallback } from "react";

export function usePostContent() {
  const [postContent, setPostContent] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extract = useCallback(async (includeComments: boolean) => {
    setExtracting(true);
    setError(null);

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.url?.includes("instagram.com")) {
        throw new Error(
          "Ouvrez un post Instagram avant de générer un commentaire."
        );
      }

      let content: string | null = null;

      try {
        const response = await chrome.tabs.sendMessage(tab.id!, {
          action: "getPostContent",
          includeComments,
        });
        content = response?.content;
      } catch {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          files: ["src/content.ts"],
        });
        const response = await chrome.tabs.sendMessage(tab.id!, {
          action: "getPostContent",
          includeComments,
        });
        content = response?.content;
      }

      if (!content) {
        throw new Error(
          "Impossible d'extraire le contenu du post. Assurez-vous d'être sur un post Instagram."
        );
      }

      setPostContent(content);
      return content;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Une erreur est survenue.";
      setError(msg);
      return null;
    } finally {
      setExtracting(false);
    }
  }, []);

  return { postContent, extracting, error, extract, setPostContent };
}
