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
      <label className="block text-[13px] font-bold text-retro-brown-mid mb-1.5 mt-4 uppercase tracking-wide">🎞️ Mots-clés GIF</label>
      <div className="flex flex-wrap gap-2 mt-1.5">
        {gifs.map((kw, i) => {
          const isCopied = copiedIndex === i;
          return (
            <span
              key={i}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-[13px] font-bold cursor-pointer border-2 transition-all duration-200 ${
                isCopied
                  ? "bg-retro-jade-bg border-retro-jade text-retro-jade"
                  : "bg-white border-retro-brown text-retro-brown hover:bg-retro-turquoise hover:text-white hover:border-retro-turquoise hover:-rotate-2"
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
