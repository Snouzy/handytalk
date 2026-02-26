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
            className={`px-2.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 ${
              isActive
                ? "bg-ig-blue text-white border-[1.5px] border-ig-blue"
                : "bg-ig-bg border-[1.5px] border-ig-border text-ig-subtle hover:border-ig-blue hover:text-ig-blue hover:bg-ig-bg-hover"
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
