import type { CommentStyleKey } from "@handytalk/shared";
import { STYLES, STYLE_KEYS } from "../lib/prompt";

interface Props {
  selected: CommentStyleKey;
  onSelect: (style: CommentStyleKey) => void;
}

export function StyleBadges({ selected, onSelect }: Props) {
  return (
    <div className="style-badges">
      {STYLE_KEYS.map((key) => {
        const style = STYLES[key];
        return (
          <button
            key={key}
            className={`style-badge ${selected === key ? "active" : ""}`}
            onClick={() => onSelect(key)}
          >
            {style.emoji} {style.label}
          </button>
        );
      })}
    </div>
  );
}
