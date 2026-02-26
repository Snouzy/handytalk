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
        className={`comment-history ${isRecent ? "comment-history--warn" : ""}`}
        ref={portalRef}
      >
        <button
          className="comment-history__header"
          onClick={() => setOpen(!open)}
          type="button"
        >
          <span className="comment-history__chevron" data-open={open}>
            ▸
          </span>
          <span>
            📝 {history.total} commentaire{history.total !== 1 ? "s" : ""} sur @
            {history.username}
          </span>
        </button>

        {open && (
          <ul className="comment-history__list">
            {history.comments.map((c) => {
              const styleDef = STYLES[c.style as keyof typeof STYLES];
              const isTruncated = c.comment_text.length > 80;

              return (
                <li key={c.id} className="comment-history__item">
                  <div className="comment-history__item-top">
                    {styleDef && (
                      <span className="comment-history__badge">
                        {styleDef.emoji} {styleDef.label}
                      </span>
                    )}
                    <span className="comment-history__date">
                      {formatDate(c.commented_at)}
                    </span>
                  </div>
                  {isTruncated ? (
                    <Tooltip.Root>
                      <Tooltip.Trigger
                        render={<span />}
                        className="comment-history__text comment-history__text--truncated"
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
                    <p className="comment-history__text">
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
