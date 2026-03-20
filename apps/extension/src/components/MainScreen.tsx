import { useState, useCallback, useEffect } from "react";
import type { CommentStyleKey, CommentLanguage, AuthorUsernameResponse } from "@handytalk/shared";
import { buildPrompt, STYLE_KEYS } from "../lib/prompt";
import { callClaude, parseResponse } from "../lib/claude";
import { fetchCommentHistory, type CommentHistoryResponse } from "../lib/api";
import { usePostContent } from "../hooks/usePostContent";
import { useClaude } from "../hooks/useClaude";
import { StyleBadges } from "./StyleBadges";
import { PromptEditor } from "./PromptEditor";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { ResultPanel } from "./ResultPanel";
import { CommentHistory } from "./CommentHistory";
import { AllResultsPanel, type AllStyleResults } from "./AllResultsPanel";

type Phase = "idle" | "extracting" | "editing" | "sending" | "done" | "generating-all" | "done-all";

interface Props {
  apiKey: string;
  onSettings: () => void;
}

export function MainScreen({ apiKey, onSettings }: Props) {
  const [style, setStyle] = useState<CommentStyleKey>("chill");
  const [language, setLanguage] = useState<CommentLanguage>("fr");
  const [includeComments, setIncludeComments] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [commentHistory, setCommentHistory] = useState<CommentHistoryResponse | null>(null);
  const [allStyleResults, setAllStyleResults] = useState<AllStyleResults>({});

  const { postContent, authorUsername, error: extractError, extract } = usePostContent();
  const { result, loading: claudeLoading, error: claudeError, send, reset } = useClaude(apiKey);

  // Auto-fetch comment history when extension opens
  useEffect(() => {
    (async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.url?.includes("instagram.com") || !tab.id) return;

        let response: AuthorUsernameResponse | undefined;
        try {
          response = await chrome.tabs.sendMessage(tab.id, { action: "getAuthorUsername" });
        } catch {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["src/content.ts"],
          });
          response = await chrome.tabs.sendMessage(tab.id, { action: "getAuthorUsername" });
        }

        const username = response?.username;
        if (!username) return;

        const history = await fetchCommentHistory(username);
        if (history && history.total > 0) {
          setCommentHistory(history);
        }
      } catch {
        // silently ignore — history will still be fetched on generate
      }
    })();
  }, []);

  const handleGenerate = useCallback(async () => {
    setPhase("extracting");
    setCommentHistory(null);
    reset();
    const content = await extract(includeComments);
    if (!content) {
      setPhase("idle");
      return;
    }

    const usernameMatch = content.match(/\[Auteur: @(.+?)\]/);
    const username = usernameMatch?.[1];
    if (username) {
      const history = await fetchCommentHistory(username);
      if (history && history.total > 0) {
        setCommentHistory(history);
      }
    }

    setPrompt(buildPrompt(content, style, language));
    setPhase("editing");
  }, [extract, includeComments, style, language, reset]);

  const handleSend = useCallback(async () => {
    setPhase("sending");
    await send(prompt);
    setPhase("done");
  }, [send, prompt]);

  const handleRegenerate = useCallback(() => {
    if (postContent) {
      setPrompt(buildPrompt(postContent, style, language));
      setPhase("editing");
      reset();
    } else {
      handleGenerate();
    }
  }, [postContent, style, language, reset, handleGenerate]);

  const generateForStyle = useCallback(
    async (content: string, styleKey: CommentStyleKey) => {
      setAllStyleResults((prev) => ({
        ...prev,
        [styleKey]: { result: null, loading: true, error: null },
      }));
      try {
        const p = buildPrompt(content, styleKey, language);
        const raw = await callClaude(apiKey, p);
        const parsed = parseResponse(raw);
        setAllStyleResults((prev) => ({
          ...prev,
          [styleKey]: { result: parsed, loading: false, error: null },
        }));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erreur";
        setAllStyleResults((prev) => ({
          ...prev,
          [styleKey]: { result: null, loading: false, error: msg },
        }));
      }
    },
    [apiKey, language]
  );

  const handleGenerateAll = useCallback(async () => {
    setPhase("generating-all");
    setAllStyleResults({});
    setCommentHistory(null);
    reset();

    const content = await extract(includeComments);
    if (!content) {
      setPhase("idle");
      return;
    }

    const usernameMatch = content.match(/\[Auteur: @(.+?)\]/);
    const username = usernameMatch?.[1];
    if (username) {
      const history = await fetchCommentHistory(username);
      if (history && history.total > 0) setCommentHistory(history);
    }

    const initial: AllStyleResults = {};
    for (const key of STYLE_KEYS) {
      initial[key] = { result: null, loading: true, error: null };
    }
    setAllStyleResults(initial);

    await Promise.allSettled(
      STYLE_KEYS.map((key) => generateForStyle(content, key))
    );
    setPhase("done-all");
  }, [extract, includeComments, reset, generateForStyle]);

  const handleRegenerateSingle = useCallback(
    (styleKey: CommentStyleKey) => {
      if (postContent) {
        generateForStyle(postContent, styleKey);
      }
    },
    [postContent, generateForStyle]
  );

  const globalError = extractError || claudeError;

  return (
    <>
      {commentHistory && <CommentHistory history={commentHistory} />}

      <label className="block text-[13px] font-bold text-retro-brown-mid mb-1.5 uppercase tracking-wide">🎭 Style</label>
      <StyleBadges selected={style} onSelect={setStyle} />

      <label className="block text-[13px] font-bold text-retro-brown-mid mb-1.5 uppercase tracking-wide">🌍 Langue</label>
      <div className="flex gap-2 mb-3">
        <button
          className={`retro-btn px-3 py-1.5 text-[13px] ${language === "fr" ? "bg-retro-mustard text-retro-brown" : "bg-retro-cream text-retro-brown-mid"}`}
          onClick={() => setLanguage("fr")}
        >
          🇫🇷 Français
        </button>
        <button
          className={`retro-btn px-3 py-1.5 text-[13px] ${language === "en" ? "bg-retro-mustard text-retro-brown" : "bg-retro-cream text-retro-brown-mid"}`}
          onClick={() => setLanguage("en")}
        >
          🇬🇧 English
        </button>
      </div>

      <label className="flex items-center gap-2 text-[13px] text-retro-brown cursor-pointer mb-3 font-semibold">
        <input
          type="checkbox"
          className="size-4 accent-retro-purple cursor-pointer"
          checked={includeComments}
          onChange={(e) => setIncludeComments(e.target.checked)}
        />
        <span>💬 Inclure les commentaires</span>
      </label>

      {(phase === "idle" || globalError) && (
        <div className="flex gap-2">
          <button
            className="retro-btn flex-1 py-2.5 px-4 bg-retro-mustard text-retro-brown"
            onClick={handleGenerate}
          >
            ✨ Générer
          </button>
          <button
            className="retro-btn flex-1 py-2.5 px-4 bg-retro-purple text-white"
            onClick={handleGenerateAll}
          >
            🎯 Tous les styles
          </button>
        </div>
      )}

      {phase === "extracting" && <LoadingSpinner />}

      {phase === "editing" && (
        <PromptEditor prompt={prompt} onChange={setPrompt} onSend={handleSend} />
      )}

      {(phase === "sending" || claudeLoading) && phase !== "done" && (
        <LoadingSpinner />
      )}

      {phase === "done" && result && (
        <ResultPanel result={result} onRegenerate={handleRegenerate} authorUsername={authorUsername} style={style} />
      )}

      {(phase === "generating-all" || phase === "done-all") && (
        <AllResultsPanel
          results={allStyleResults}
          onRegenerateSingle={handleRegenerateSingle}
          onRegenerateAll={handleGenerateAll}
          authorUsername={authorUsername}
        />
      )}

      {globalError && <ErrorMessage message={globalError} />}

      <button
        className="block text-center mt-4 text-[13px] text-retro-brown-mid bg-transparent border-none cursor-pointer font-bold uppercase tracking-wide transition-colors duration-200 hover:text-retro-purple mx-auto"
        onClick={onSettings}
      >
        ⚙️ Paramètres
      </button>
    </>
  );
}
