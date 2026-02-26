import { useState, useCallback } from "react";
import type { CommentStyleKey } from "@handytalk/shared";
import { buildPrompt } from "../lib/prompt";
import { fetchCommentHistory, recordComment, type CommentHistoryResponse } from "../lib/api";
import { usePostContent } from "../hooks/usePostContent";
import { useClaude } from "../hooks/useClaude";
import { StyleBadges } from "./StyleBadges";
import { PromptEditor } from "./PromptEditor";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { ResultPanel } from "./ResultPanel";
import { CommentHistory } from "./CommentHistory";

type Phase = "idle" | "extracting" | "editing" | "sending" | "done";

interface Props {
  apiKey: string;
  onSettings: () => void;
}

export function MainScreen({ apiKey, onSettings }: Props) {
  const [style, setStyle] = useState<CommentStyleKey>("chill");
  const [includeComments, setIncludeComments] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [commentHistory, setCommentHistory] = useState<CommentHistoryResponse | null>(null);

  const { postContent, authorUsername, error: extractError, extract } = usePostContent();
  const { result, loading: claudeLoading, error: claudeError, send, reset } = useClaude(apiKey);

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

    setPrompt(buildPrompt(content, style));
    setPhase("editing");
  }, [extract, includeComments, style, reset]);

  const handleSend = useCallback(async () => {
    setPhase("sending");
    const parsed = await send(prompt);
    setPhase("done");

    if (authorUsername && parsed) {
      recordComment(authorUsername, parsed.comment, style);
    }
  }, [send, prompt, authorUsername, style]);

  const handleRegenerate = useCallback(() => {
    if (postContent) {
      setPrompt(buildPrompt(postContent, style));
      setPhase("editing");
      reset();
    } else {
      handleGenerate();
    }
  }, [postContent, style, reset, handleGenerate]);

  const globalError = extractError || claudeError;

  return (
    <>
      <label className="label">🎭 Style</label>
      <StyleBadges selected={style} onSelect={setStyle} />

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={includeComments}
          onChange={(e) => setIncludeComments(e.target.checked)}
        />
        <span>💬 Inclure les commentaires</span>
      </label>

      {(phase === "idle" || globalError) && (
        <button className="btn-primary" onClick={handleGenerate}>
          ✨ Générer un commentaire
        </button>
      )}

      {phase === "extracting" && <LoadingSpinner />}

      {commentHistory && <CommentHistory history={commentHistory} />}

      {phase === "editing" && (
        <PromptEditor prompt={prompt} onChange={setPrompt} onSend={handleSend} />
      )}

      {(phase === "sending" || claudeLoading) && phase !== "done" && (
        <LoadingSpinner />
      )}

      {phase === "done" && result && (
        <ResultPanel result={result} onRegenerate={handleRegenerate} />
      )}

      {globalError && <ErrorMessage message={globalError} />}

      <button className="settings-link" onClick={onSettings}>
        ⚙️ Paramètres
      </button>
    </>
  );
}
