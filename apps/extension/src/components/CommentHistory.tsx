import { useState, useRef } from "react";
import { Tooltip } from "@base-ui-components/react/tooltip";
import { STYLES } from "../lib/prompt";
import { SPAM_THRESHOLD_DAYS, type CommentHistoryResponse } from "../lib/api";

interface Props {
  history: CommentHistoryResponse;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

export function CommentHistory({ history }: Props) {
  const [open, setOpen] = useState(false);
  const portalRef = useRef<HTMLDivElement>(null);

  const isRecent =
    history.most_recent_days_ago !== null &&
    history.most_recent_days_ago < SPAM_THRESHOLD_DAYS;

  return (
    <Tooltip.Provider>
      <div
        className={`relative my-3 border rounded-lg ${
          isRecent
            ? "border-ig-warn bg-ig-warn-bg"
            : "border-ig-border"
        }`}
        ref={portalRef}
      >
        <button
          className={`flex items-center gap-2 w-full px-3 py-2.5 bg-transparent border-none text-[13px] font-semibold cursor-pointer text-left ${
            isRecent ? "text-ig-warn-text" : "text-ig-text"
          }`}
          onClick={() => setOpen(!open)}
          type="button"
        >
          <span
            className={`inline-block text-xs transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          >
            ▸
          </span>
          <span>
            📝 {history.total} commentaire{history.total !== 1 ? "s" : ""} sur @
            {history.username}
          </span>
        </button>

        {open && (
          <ul className="list-none px-3 pb-2.5 flex flex-col gap-2">
            {history.comments.map((c) => {
              const styleDef = STYLES[c.style as keyof typeof STYLES];
              const isTruncated = c.comment_text.length > 80;

              return (
                <li key={c.id} className="p-2 bg-black/[0.03] rounded-md">
                  <div className="flex items-center justify-between mb-1">
                    {styleDef && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 bg-[#f0f0f0] rounded-xl text-ig-subtle">
                        {styleDef.emoji} {styleDef.label}
                      </span>
                    )}
                    <span className="text-[11px] text-ig-muted">
                      {formatDate(c.commented_at)}
                    </span>
                  </div>
                  {isTruncated ? (
                    <Tooltip.Root>
                      <Tooltip.Trigger
                        render={<span />}
                        className="block text-xs text-ig-subtle leading-snug cursor-pointer underline decoration-dotted decoration-ig-muted underline-offset-2 bg-transparent border-none p-0 font-[inherit] text-left hover:text-ig-text"
                      >
                        {truncate(c.comment_text, 80)}
                      </Tooltip.Trigger>
                      <Tooltip.Portal container={portalRef.current}>
                        <Tooltip.Positioner sideOffset={6} side="top">
                          <Tooltip.Popup className="comment-history__tooltip">
                            {c.comment_text}
                          </Tooltip.Popup>
                        </Tooltip.Positioner>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  ) : (
                    <p className="text-xs text-ig-subtle leading-snug">
                      {c.comment_text}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Tooltip.Provider>
  );
}
