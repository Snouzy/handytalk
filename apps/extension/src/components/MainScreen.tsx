import { useState, useCallback } from "react";
import type { CommentStyleKey } from "@m6b9/shared";
import { buildPrompt } from "../lib/prompt";
import { usePostContent } from "../hooks/usePostContent";
import { useClaude } from "../hooks/useClaude";
import { StyleBadges } from "./StyleBadges";
import { PromptEditor } from "./PromptEditor";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { ResultPanel } from "./ResultPanel";

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

  const { postContent, error: extractError, extract } = usePostContent();
  const { result, loading: claudeLoading, error: claudeError, send, reset } = useClaude(apiKey);

  const handleGenerate = useCallback(async () => {
    setPhase("extracting");
    reset();
    const content = await extract(includeComments);
    if (content) {
      setPrompt(buildPrompt(content, style));
      setPhase("editing");
    } else {
      setPhase("idle");
    }
  }, [extract, includeComments, style, reset]);

  const handleSend = useCallback(async () => {
    setPhase("sending");
    await send(prompt);
    setPhase("done");
  }, [send, prompt]);

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
