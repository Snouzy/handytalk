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
      <label className="block text-[13px] font-semibold text-ig-muted mb-1.5 mt-4">🎞️ Mots-clés GIF</label>
      <div className="flex flex-wrap gap-2 mt-1.5">
        {gifs.map((kw, i) => {
          const isCopied = copiedIndex === i;
          return (
            <span
              key={i}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-[13px] cursor-pointer transition-colors duration-200 ${
                isCopied
                  ? "bg-ig-success-bg border border-ig-success text-ig-success"
                  : "bg-[#f0f0f0] border border-ig-border text-ig-text hover:bg-ig-bg-hover hover:border-ig-blue hover:text-ig-blue"
              }`}
              onClick={() => handleCopy(kw, i)}
            >
              {isCopied ? "copied!" : kw}
            </span>
          );
        })}
      </div>
    </>
  );
}
