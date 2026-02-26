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
    <div className="mt-4 animate-slide-up">
      <label className="block text-[13px] font-semibold text-org-earth-muted mb-2">💬 Commentaire</label>
      <textarea
        className="w-full p-3.5 border border-org-sand-dark rounded-2xl text-sm font-[inherit] text-org-earth resize-y outline-none leading-relaxed bg-white transition-all duration-300 ease-out focus:border-org-sage focus:ring-2 focus:ring-org-sage-light"
        rows={3}
        readOnly
        value={result.comment}
      />
      <div className="flex gap-2 mt-3">
        <button
          className="flex-1 py-2.5 px-4 bg-white text-org-sage border border-org-sage rounded-2xl text-[13px] font-semibold cursor-pointer transition-all duration-300 ease-out hover:bg-org-sage hover:text-white hover:scale-[1.02]"
          onClick={handleCopy}
        >
          {copyLabel}
        </button>
        <button
          className="flex-1 py-2.5 px-4 bg-white text-org-sage border border-org-sage rounded-2xl text-[13px] font-semibold cursor-pointer transition-all duration-300 ease-out hover:bg-org-sage hover:text-white hover:scale-[1.02]"
          onClick={onRegenerate}
        >
          🔄 Régénérer
        </button>
      </div>
      <GifKeywords gifs={result.gifs} />
    </div>
  );
}
