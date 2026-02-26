import { useState } from "react";

interface Props {
  gifs: string[];
}

export function GifKeywords({ gifs }: Props) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (gifs.length === 0) return null;

  const handleCopy = async (kw: string, index: number) => {
    await navigator.clipboard.writeText(kw);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  return (
    <>
      <label className="label gif-label">🎞️ Mots-clés GIF</label>
      <div className="gif-keywords">
        {gifs.map((kw, i) => (
          <span
            key={i}
            className={`gif-chip ${copiedIndex === i ? "gif-chip-copied" : ""}`}
            onClick={() => handleCopy(kw, i)}
          >
            {copiedIndex === i ? "copied!" : kw}
          </span>
        ))}
      </div>
    </>
  );
}
