"use client";

import { useId, useState } from "react";
import { formatEUR, parseEuroInput } from "@/lib/format";
import type { PriceRange as Range } from "@/lib/recommender/ranking";

const STEP = 10; // cents

interface Props {
  /** Top of the slider: the most expensive cost to finish, rounded up to a round number. */
  limitCents: number;
  /** The exact most expensive cost to finish, for the hint under the slider. */
  mostExpensiveCents: number;
  value: Range;
  onChange: (next: Range) => void;
  examplePrices: boolean;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const euros = (cents: number) => (cents / 100).toFixed(2);

/**
 * Two-handle price slider plus "From" and "To" fields (UD 2 Flexibility in use: drag or type).
 * Each handle is a native range input, so arrow keys, Page Up/Down and screen readers work as usual.
 * Dragging the top handle to the end means "no upper limit", so new pricier recipes aren't hidden silently.
 */
export function PriceRange({ limitCents, mostExpensiveCents, value, onChange, examplePrices }: Props) {
  const id = useId();
  const lo = clamp(value.minCents, 0, limitCents);
  const hi = value.maxCents === null ? limitCents : clamp(value.maxCents, lo, limitCents);

  const set = (minCents: number, maxCents: number) =>
    onChange({ minCents, maxCents: maxCents >= limitCents ? null : maxCents });

  const pos = (cents: number) => (limitCents ? cents / limitCents : 0);
  // Native thumbs are 44 px wide and stay inside the track, so the fill uses the same inset.
  const fillStyle = {
    left: `calc(22px + (100% - 44px) * ${pos(lo)})`,
    width: `calc((100% - 44px) * ${pos(hi) - pos(lo)})`,
  };

  return (
    <section aria-labelledby={`${id}-title`} className="mt-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={`${id}-title`} className="font-semibold">
          Cost to finish
        </h2>
        <p className="font-mono font-semibold">
          {formatEUR(lo)} – {formatEUR(hi)}
          {value.maxCents === null && <span className="sr-only"> (no upper limit)</span>}
        </p>
      </div>

      <div className="relative mt-1 h-11">
        <div aria-hidden="true" className="absolute inset-x-[22px] top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-border" />
        <div aria-hidden="true" className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-accent" style={fillStyle} />
        <input
          type="range"
          aria-label="Lowest price"
          aria-valuetext={formatEUR(lo)}
          min={0}
          max={limitCents}
          step={STEP}
          value={lo}
          onChange={(e) => set(Math.min(Number(e.target.value), hi), hi)}
          // When both handles meet near the top, the low one must stay on top to be draggable.
          style={{ zIndex: lo > limitCents / 2 ? 3 : 2 }}
          className="range-thumb absolute inset-0 w-full"
        />
        <input
          type="range"
          aria-label="Highest price"
          aria-valuetext={value.maxCents === null ? `${formatEUR(hi)}, no upper limit` : formatEUR(hi)}
          min={0}
          max={limitCents}
          step={STEP}
          value={hi}
          onChange={(e) => set(lo, Math.max(Number(e.target.value), lo))}
          className="range-thumb absolute inset-0 z-[2] w-full"
        />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-3">
        <EuroField
          label="From"
          cents={lo}
          onCommit={(c) => {
            const min = clamp(c, 0, limitCents);
            set(min, Math.max(hi, min));
          }}
        />
        <EuroField
          label="To"
          cents={hi}
          onCommit={(c) => {
            const max = clamp(c, 0, limitCents);
            set(Math.min(lo, max), max);
          }}
        />
      </div>
      <p className="mt-2 text-label text-ink-muted">
        The most expensive recipe needs {formatEUR(mostExpensiveCents)} more.
        {examplePrices && " Example prices, not checked in a store yet."}
      </p>
    </section>
  );
}

/** Text field for an amount in euros. Commits on Enter or when you leave it; keeps what you typed if it's not an amount. */
function EuroField({ label, cents, onCommit }: { label: string; cents: number; onCommit: (cents: number) => void }) {
  const id = useId();
  const [text, setText] = useState(euros(cents));
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const shown = editing ? text : euros(cents);

  function commit() {
    setEditing(false);
    const parsed = parseEuroInput(text);
    if (parsed === null) {
      setError(true);
      setEditing(true); // keep the typed text so it can be corrected
      return;
    }
    setError(false);
    onCommit(parsed);
  }

  return (
    <div>
      <label htmlFor={id} className="block text-secondary font-semibold">
        {label}
      </label>
      <div className="mt-1 flex min-h-12 items-center rounded-control border-2 border-border bg-surface px-3 focus-within:border-accent">
        <span aria-hidden="true" className="font-mono text-ink-muted">
          €
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={shown}
          aria-invalid={error}
          aria-describedby={error ? `${id}-error` : undefined}
          onFocus={(e) => {
            setText(euros(cents));
            setEditing(true);
            e.target.select();
          }}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
          }}
          className="min-w-0 flex-1 bg-transparent pl-1 font-mono outline-none"
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-label text-many">
          Type an amount like 2.50
        </p>
      )}
    </div>
  );
}
