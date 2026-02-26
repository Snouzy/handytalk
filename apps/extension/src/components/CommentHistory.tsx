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
        className={`relative my-4 border rounded-2xl transition-all duration-300 ease-out ${
          isRecent
            ? "border-org-terracotta bg-org-terracotta-bg"
            : "border-org-sand-dark bg-white"
        }`}
        ref={portalRef}
      >
        <button
          className={`flex items-center gap-2 w-full px-4 py-3 bg-transparent border-none text-[13px] font-semibold cursor-pointer text-left ${
            isRecent ? "text-org-terracotta" : "text-org-earth"
          }`}
          onClick={() => setOpen(!open)}
          type="button"
        >
          <span
            className={`inline-block text-xs transition-transform duration-300 ease-out ${open ? "rotate-90" : ""}`}
          >
            ▸
          </span>
          <span>
            📝 {history.total} commentaire{history.total !== 1 ? "s" : ""} sur @
            {history.username}
          </span>
        </button>

        {open && (
          <ul className="list-none px-4 pb-3 flex flex-col gap-2 animate-fade-in">
            {history.comments.map((c) => {
              const styleDef = STYLES[c.style as keyof typeof STYLES];
              const isTruncated = c.comment_text.length > 80;

              return (
                <li key={c.id} className="p-2.5 bg-org-sand/50 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    {styleDef && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 bg-org-sage-light rounded-full text-org-earth-light">
                        {styleDef.emoji} {styleDef.label}
                      </span>
                    )}
                    <span className="text-[11px] text-org-earth-muted">
                      {formatDate(c.commented_at)}
                    </span>
                  </div>
                  {isTruncated ? (
                    <Tooltip.Root>
                      <Tooltip.Trigger
                        render={<span />}
                        className="block text-xs text-org-earth-light leading-snug cursor-pointer underline decoration-dotted decoration-org-earth-muted underline-offset-2 bg-transparent border-none p-0 font-[inherit] text-left hover:text-org-earth"
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
                    <p className="text-xs text-org-earth-light leading-snug">
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
