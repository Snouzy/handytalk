import { useState } from "react";
import type { CommentStyleKey, ParsedResult } from "@handytalk/shared";
import { STYLES, STYLE_KEYS } from "../lib/prompt";
import { recordComment } from "../lib/api";
import { LoadingSpinner } from "./LoadingSpinner";
import { GifKeywords } from "./GifKeywords";

export interface StyleResult {
  result: ParsedResult | null;
  loading: boolean;
  error: string | null;
}

export type AllStyleResults = Partial<Record<CommentStyleKey, StyleResult>>;

interface Props {
  results: AllStyleResults;
  onRegenerateSingle: (styleKey: CommentStyleKey) => void;
  onRegenerateAll: () => void;
  authorUsername: string | null;
}

function SingleResult({
  styleKey,
  data,
  onRegenerate,
  authorUsername,
}: {
  styleKey: CommentStyleKey;
  data: StyleResult;
  onRegenerate: () => void;
  authorUsername: string | null;
}) {
  const [copyLabel, setCopyLabel] = useState("📋");
  const [posted, setPosted] = useState(false);
  const style = STYLES[styleKey];

  const handleCopy = async () => {
    if (!data.result) return;
    await navigator.clipboard.writeText(data.result.comment);
    setCopyLabel("✅");
    setTimeout(() => setCopyLabel("📋"), 1500);
  };

  const handlePosted = () => {
    if (!authorUsername || !data.result) return;
    recordComment(authorUsername, data.result.comment, styleKey);
    setPosted(true);
  };

  return (
    <div className="retro-input p-3 animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-retro-purple uppercase tracking-wide">
          {style.emoji} {style.label}
        </span>
        {data.loading && (
          <span className="text-xs text-retro-brown-mid animate-pulse">
            génération...
          </span>
        )}
      </div>

      {data.loading && <LoadingSpinner />}

      {data.error && (
        <div className="text-xs text-red-600 mb-2">{data.error}</div>
      )}

      {data.result && (
        <>
          <p className="text-sm text-retro-brown leading-relaxed mb-2">
            {data.result.comment}
          </p>
          <div className="flex gap-2">
            <button
              className="retro-btn px-2.5 py-1 text-xs bg-white text-retro-purple hover:bg-retro-purple-light"
              onClick={handleCopy}
            >
              {copyLabel} Copier
            </button>
            <button
              className="retro-btn px-2.5 py-1 text-xs bg-white text-retro-turquoise hover:bg-retro-cream"
              onClick={onRegenerate}
            >
              🔄
            </button>
            <button
              className={`retro-btn px-2.5 py-1 text-xs ${posted ? "bg-retro-green/20 text-retro-green cursor-default" : "bg-retro-mustard text-retro-brown hover:bg-retro-mustard/80"}`}
              onClick={handlePosted}
              disabled={posted || !authorUsername}
            >
              {posted ? "✅" : "📌 Posté"}
            </button>
          </div>
          <GifKeywords gifs={data.result.gifs} />
        </>
      )}
    </div>
  );
}

export function AllResultsPanel({
  results,
  onRegenerateSingle,
  onRegenerateAll,
  authorUsername,
}: Props) {
  return (
    <div className="mt-4 animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <label className="text-[13px] font-bold text-retro-brown-mid uppercase tracking-wide">
          💬 Tous les commentaires
        </label>
        <button
          className="retro-btn px-3 py-1 text-xs bg-white text-retro-turquoise hover:bg-retro-cream"
          onClick={onRegenerateAll}
        >
          🔄 Tout régénérer
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {STYLE_KEYS.map((key) => {
          const data = results[key];
          if (!data) return null;
          return (
            <SingleResult
              key={key}
              styleKey={key}
              data={data}
              onRegenerate={() => onRegenerateSingle(key)}
              authorUsername={authorUsername}
            />
          );
        })}
      </div>
    </div>
  );
}
