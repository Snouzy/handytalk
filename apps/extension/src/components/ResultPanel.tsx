import { useState } from "react";
import { GifKeywords } from "./GifKeywords";
import type { ParsedResult } from "@handytalk/shared";

interface Props {
  result: ParsedResult;
  onRegenerate: () => void;
}

export function ResultPanel({ result, onRegenerate }: Props) {
  const [copyLabel, setCopyLabel] = useState("📋 Copier");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.comment);
    setCopyLabel("✅ Copié !");
    setTimeout(() => setCopyLabel("📋 Copier"), 1500);
  };

  return (
    <div className="mt-4">
      <label className="block text-[13px] font-semibold text-ig-muted mb-1.5">💬 Commentaire</label>
      <textarea
        className="w-full p-3 border border-ig-border rounded-lg text-sm font-[inherit] text-ig-text resize-y outline-none leading-relaxed focus:border-ig-blue"
        rows={3}
        readOnly
        value={result.comment}
      />
      <div className="flex gap-2 mt-3">
        <button
          className="flex-1 py-2 px-4 bg-white text-ig-blue border border-ig-blue rounded-lg text-[13px] font-semibold cursor-pointer transition-colors duration-200 hover:bg-ig-blue hover:text-white"
          onClick={handleCopy}
        >
          {copyLabel}
        </button>
        <button
          className="flex-1 py-2 px-4 bg-white text-ig-blue border border-ig-blue rounded-lg text-[13px] font-semibold cursor-pointer transition-colors duration-200 hover:bg-ig-blue hover:text-white"
          onClick={onRegenerate}
        >
          🔄 Régénérer
        </button>
      </div>
      <GifKeywords gifs={result.gifs} />
    </div>
  );
}
