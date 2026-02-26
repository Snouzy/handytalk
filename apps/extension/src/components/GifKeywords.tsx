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
      <label className="block text-[13px] font-semibold text-org-earth-muted mb-2 mt-4">🎞️ Mots-clés GIF</label>
      <div className="flex flex-wrap gap-2 mt-1.5">
        {gifs.map((kw, i) => {
          const isCopied = copiedIndex === i;
          return (
            <span
              key={i}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-[13px] cursor-pointer transition-all duration-300 ease-out ${
                isCopied
                  ? "bg-org-moss-bg border border-org-moss text-org-moss"
                  : "bg-org-sage-light border border-org-sand-dark text-org-earth hover:border-org-sage hover:text-org-sage hover:scale-[1.02]"
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
