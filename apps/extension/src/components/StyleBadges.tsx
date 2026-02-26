import type { CommentStyleKey } from "@handytalk/shared";
import { STYLES, STYLE_KEYS } from "../lib/prompt";

interface Props {
  selected: CommentStyleKey;
  onSelect: (style: CommentStyleKey) => void;
}

export function StyleBadges({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {STYLE_KEYS.map((key) => {
        const style = STYLES[key];
        const isActive = selected === key;
        return (
          <button
            key={key}
            className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-300 ease-out ${
              isActive
                ? "bg-org-sage text-white border-[1.5px] border-org-sage shadow-sm"
                : "bg-org-sage-light border-[1.5px] border-org-sand-dark text-org-earth-light hover:border-org-sage hover:text-org-sage hover:scale-[1.02]"
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
