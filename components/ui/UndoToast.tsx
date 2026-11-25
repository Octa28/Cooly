"use client";

import { useEffect, useRef } from "react";

/** How long the undo offer stays (CLAUDE.md section 10). Paused while hovered or focused. */
export const UNDO_MS = 5000;

export interface UndoOffer {
  id: number;
  message: string;
  undo: () => void;
}

export function UndoToast({ offer, onDone }: { offer: UndoOffer | null; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!offer) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = (ms: number) => {
      timer = setTimeout(() => {
        // Don't pull the button away from someone who is about to press it.
        if (ref.current?.matches(":hover, :focus-within")) schedule(1500);
        else onDone();
      }, ms);
    };
    schedule(UNDO_MS);
    return () => clearTimeout(timer);
  }, [offer, onDone]);

  if (!offer) return null;

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-20 z-40 mx-auto flex w-fit max-w-[calc(100%-40px)] items-center gap-4 rounded-card bg-ink py-2 pr-2 pl-4 text-bg motion-safe:animate-[toast-in_180ms_ease-out]"
    >
      <p>{offer.message}</p>
      <button
        type="button"
        onClick={() => {
          offer.undo();
          onDone();
        }}
        className="min-h-11 rounded-control px-4 font-semibold underline underline-offset-4 focus-visible:outline-bg"
      >
        Undo
      </button>
    </div>
  );
}
