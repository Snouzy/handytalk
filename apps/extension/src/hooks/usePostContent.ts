import { useState, useCallback } from "react";
import type { ScreenshotData } from "@handytalk/shared";

export function usePostContent() {
  const [screenshot, setScreenshot] = useState<ScreenshotData | null>(null);
  const [authorUsername, setAuthorUsername] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extract = useCallback(async () => {
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

      // Capture screenshot of the visible tab
      const dataUrl = await chrome.tabs.captureVisibleTab({
        format: "jpeg",
        quality: 80,
      });
      const [header, base64Data] = dataUrl.split(",");
      const mediaType = header.match(/data:(.*?);/)?.[1] || "image/jpeg";
      const screenshotData: ScreenshotData = { base64: base64Data, mediaType };

      // Extract author username via content script (for comment history)
      let username: string | null = null;
      try {
        const response = await chrome.tabs.sendMessage(tab.id!, {
          action: "getAuthorUsername",
        });
        username = response?.username;
      } catch {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          files: ["src/content.ts"],
        });
        const response = await chrome.tabs.sendMessage(tab.id!, {
          action: "getAuthorUsername",
        });
        username = response?.username;
      }

      setScreenshot(screenshotData);
      setAuthorUsername(username);
      return { screenshot: screenshotData, authorUsername: username };
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Une erreur est survenue.";
      setError(msg);
      return null;
    } finally {
      setExtracting(false);
    }
  }, []);

  return { screenshot, authorUsername, extracting, error, extract };
}
