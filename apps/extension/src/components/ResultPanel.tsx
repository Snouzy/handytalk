import { useState } from "react";
import { GifKeywords } from "./GifKeywords";
import type { ParsedResult, CommentStyleKey } from "@handytalk/shared";
import { recordComment } from "../lib/api";

interface Props {
  result: ParsedResult;
  onRegenerate: () => void;
  authorUsername: string | null;
  style: CommentStyleKey;
  postUrl?: string;
}

export function ResultPanel({ result, onRegenerate, authorUsername, style, postUrl }: Props) {
  const [copyLabel, setCopyLabel] = useState("📋 Copier");
  const [posted, setPosted] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.comment);
    setCopyLabel("✅ Copié !");
    setTimeout(() => setCopyLabel("📋 Copier"), 1500);
  };

  const handlePosted = () => {
    if (!authorUsername) return;
    recordComment(authorUsername, result.comment, style, postUrl);
    setPosted(true);
  };

  return (
    <div className="mt-4 animate-slide-up">
      <label className="block text-[13px] font-bold text-retro-brown-mid mb-1.5 uppercase tracking-wide">💬 Commentaire</label>
      <textarea
        className="retro-input w-full p-3 text-sm font-[inherit] text-retro-brown resize-y leading-relaxed"
        rows={3}
        readOnly
        value={result.comment}
      />
      <div className="flex gap-2 mt-3">
        <button
          className="retro-btn flex-1 py-2 px-4 bg-white text-retro-purple hover:bg-retro-purple-light"
          onClick={handleCopy}
        >
          {copyLabel}
        </button>
        <button
          className="retro-btn flex-1 py-2 px-4 bg-white text-retro-turquoise hover:bg-retro-cream"
          onClick={onRegenerate}
        >
          🔄 Régénérer
        </button>
        <button
          className={`retro-btn flex-1 py-2 px-4 ${posted ? "bg-retro-green/20 text-retro-green cursor-default" : "bg-retro-mustard text-retro-brown hover:bg-retro-mustard/80"}`}
          onClick={handlePosted}
          disabled={posted || !authorUsername}
        >
          {posted ? "✅ Enregistré" : "📌 J'ai posté"}
        </button>
      </div>
      <GifKeywords gifs={result.gifs} />
    </div>
  );
}
