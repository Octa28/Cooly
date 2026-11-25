import type { Status } from "@/lib/types";

const LABEL: Record<Status, string> = {
  ready: "Ready to cook",
  few: "Missing a few",
  many: "Missing many",
};

const COLOUR: Record<Status, string> = {
  ready: "text-ok",
  few: "text-few",
  many: "text-many",
};

/**
 * Section 11.6: colour + shape + word. Filled circle = ready, half-filled = a few missing,
 * outlined = many missing, so the mark still reads in greyscale or for colour-blind users.
 */
export function StatusMark({ status, size = 16, decorative = false }: { status: Status; size?: number; decorative?: boolean }) {
  // `decorative` when the text next to it already names the status, so screen readers don't hear it twice.
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": LABEL[status] })}
      className={`shrink-0 ${COLOUR[status]}`}
    >
      <circle cx="8" cy="8" r="6.5" fill={status === "ready" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" />
      {status === "few" && <path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="currentColor" />}
    </svg>
  );
}

export const STATUS_LABEL = LABEL;
export const STATUS_TEXT_CLASS = COLOUR;
