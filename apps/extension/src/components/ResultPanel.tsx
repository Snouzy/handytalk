import { useState } from "react";
import { GifKeywords } from "./GifKeywords";
import type { ParsedResult } from "@m6b9/shared";

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
    <div className="result-container">
      <label className="label">💬 Commentaire</label>
      <textarea className="comment-output" rows={3} readOnly value={result.comment} />
      <div className="btn-group">
        <button className="btn-secondary" onClick={handleCopy}>
          {copyLabel}
        </button>
        <button className="btn-secondary" onClick={onRegenerate}>
          🔄 Régénérer
        </button>
      </div>
      <GifKeywords gifs={result.gifs} />
    </div>
  );
}
