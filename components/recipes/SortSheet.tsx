"use client";

import { type ReactElement, useRef } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { SORT_OPTIONS, type SortKey } from "@/lib/recommender/ranking";

interface Props {
  trigger: ReactElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: SortKey;
  onChange: (sort: SortKey) => void;
}

/**
 * Picking an option applies it at once. A tap or click also closes the sheet; arrow keys don't,
 * so keyboard users can move through the options and close with Esc or the Close button.
 */
export function SortSheet({ trigger, open, onOpenChange, value, onChange }: Props) {
  // Set by a key press on the radios, so the change that follows doesn't close the sheet.
  const byKeyboard = useRef(false);

  return (
    <Sheet trigger={trigger} open={open} onOpenChange={onOpenChange} title="Sort recipes">
      <fieldset>
        <legend className="sr-only">Sort by</legend>
        <p className="mb-2 text-secondary text-ink-muted">The three lists keep their order; this sorts the recipes inside each list.</p>
        {SORT_OPTIONS.map((o) => (
          <label key={o.id} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-control px-1 py-2 hover:bg-sunken">
            <input
              type="radio"
              name="sort"
              className="size-6 shrink-0 accent-accent"
              checked={value === o.id}
              onKeyDown={() => (byKeyboard.current = true)}
              onChange={() => {
                onChange(o.id);
                if (!byKeyboard.current) onOpenChange(false);
                byKeyboard.current = false;
              }}
            />
            <span className="font-semibold">
              {o.label}
              <span className="block text-secondary font-normal text-ink-muted">{o.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>
    </Sheet>
  );
}
