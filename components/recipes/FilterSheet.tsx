"use client";

import { type ReactElement, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { plural } from "@/lib/format";
import type { AllergenId, Constraints, Equipment } from "@/lib/types";
import { ALLERGENS, DIETS, EQUIPMENT, NO_CONSTRAINTS } from "@/lib/user-state";

interface Props {
  trigger: ReactElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: Constraints;
  onApply: (next: Constraints) => void;
  /** Live count for the apply button: how many recipes these filters would show. */
  countFor: (draft: Constraints) => number;
}

const toggle = <T,>(list: readonly T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

const row = "flex min-h-12 cursor-pointer items-center gap-3 rounded-control px-1 hover:bg-sunken";
const box = "size-6 shrink-0 accent-accent";
const legend = "mb-1 text-lg font-bold";

/** Screen 10: allergies, diet and equipment. Changes apply only when you press "Show N recipes". */
export function FilterSheet({ trigger, open, onOpenChange, value, onApply, countFor }: Props) {
  const [draft, setDraft] = useState<Constraints>(value);
  const [wasOpen, setWasOpen] = useState(open);
  // Start from what's applied each time the sheet opens (React's "adjust state while rendering" pattern).
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDraft(value);
  }
  const count = countFor(draft);

  return (
    <Sheet
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      title="Filters"
      footer={
        <>
          <button
            type="button"
            onClick={() => setDraft(NO_CONSTRAINTS)}
            className="min-h-12 rounded-control border-2 border-border px-4 font-semibold"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onOpenChange(false);
            }}
            className="min-h-12 flex-1 rounded-control bg-accent px-4 font-semibold text-on-accent"
          >
            {count === 0 ? "No recipes match" : `Show ${plural(count, "recipe", "recipes")}`}
          </button>
        </>
      }
    >
      <fieldset>
        <legend className={legend}>Diet</legend>
        {[{ id: null, label: "No preference" }, ...DIETS].map((d) => (
          <label key={d.id ?? "any"} className={row}>
            <input
              type="radio"
              name="diet"
              className={box}
              checked={draft.diet === d.id}
              onChange={() => setDraft({ ...draft, diet: d.id })}
            />
            {d.label}
          </label>
        ))}
      </fieldset>

      <fieldset className="mt-6">
        <legend className={legend}>Allergies and intolerances</legend>
        <p className="text-secondary text-ink-muted">Recipes with these are never shown.</p>
        <div className="mt-1 grid grid-cols-2 gap-x-3">
          {ALLERGENS.map((a) => (
            <label key={a.id} className={row}>
              <input
                type="checkbox"
                className={box}
                checked={draft.allergens.includes(a.id)}
                onChange={() => setDraft({ ...draft, allergens: toggle<AllergenId>(draft.allergens, a.id) })}
              />
              {a.label}
            </label>
          ))}
        </div>
        <p className="mt-2 text-secondary text-ink-muted">
          Cooly is a helper, not a safety tool. Always check food labels; recipe matches are not a medical guarantee for
          allergies.
        </p>
      </fieldset>

      <fieldset className="mt-6">
        <legend className={legend}>Kitchen equipment</legend>
        <p className="text-secondary text-ink-muted">Tick what you have. Leave all unticked to see recipes for any kitchen.</p>
        <div className="mt-1 grid grid-cols-2 gap-x-3">
          {EQUIPMENT.map((e) => {
            const have = draft.equipment ?? [];
            return (
              <label key={e.id} className={row}>
                <input
                  type="checkbox"
                  className={box}
                  checked={have.includes(e.id)}
                  onChange={() => {
                    const next = toggle<Equipment>(have, e.id);
                    setDraft({ ...draft, equipment: next.length ? next : null });
                  }}
                />
                {e.label}
              </label>
            );
          })}
        </div>
      </fieldset>
    </Sheet>
  );
}
