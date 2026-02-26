import type { CommentStyleKey } from "@handytalk/shared";
import { STYLES, STYLE_KEYS } from "../lib/prompt";

interface Props {
  selected: CommentStyleKey;
  onSelect: (style: CommentStyleKey) => void;
}

export function StyleBadges({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-3.5">
      {STYLE_KEYS.map((key) => {
        const style = STYLES[key];
        const isActive = selected === key;
        return (
          <button
            key={key}
            className={`px-2.5 py-1.5 rounded-full text-xs font-bold cursor-pointer border-2 transition-all duration-200 ${
              isActive
                ? "bg-retro-purple text-white border-retro-purple"
                : "bg-white text-retro-brown border-retro-brown hover:bg-retro-mustard hover:-rotate-1"
            }`}
            onClick={() => onSelect(key)}
          >
            {style.emoji} {style.label}
          </button>
        );
      })}
    </div>
  );
}
