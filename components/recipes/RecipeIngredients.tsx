"use client";

import { StatusMark, STATUS_TEXT_CLASS } from "@/components/ui/StatusMark";
import { DEFAULT_STAPLES, getIngredient, INGREDIENTS_BY_ID } from "@/lib/data";
import { formatAmount, spokenAmount } from "@/lib/format";
import { matchRecipe } from "@/lib/recommender/matching";
import type { Recipe } from "@/lib/types";
import { fridgeStore } from "@/lib/user-state";

const NO_CONSTRAINTS = { allergens: [], diet: null, equipment: null };

/** "You have" and "You need" lists for one recipe, from the fridge in this browser. */
export function RecipeIngredients({ recipe }: { recipe: Recipe }) {
  const fridge = fridgeStore.useValue();
  if (fridge === null) return <div aria-busy="true" className="mt-8 min-h-40" />;

  const match = matchRecipe(recipe, fridge, DEFAULT_STAPLES, INGREDIENTS_BY_ID, NO_CONSTRAINTS);
  const have = match.items.filter((i) => i.state === "covered");
  const need = match.items.filter((i) => i.state !== "covered");
  const optional = recipe.ingredients.filter((i) => i.optional);
  const basics = recipe.ingredients.filter((i) => !i.optional && DEFAULT_STAPLES.has(i.id));

  const row = (id: string, amount: number, note?: string) => {
    const ingredient = getIngredient(id);
    return (
      <li key={id} className="flex min-h-11 items-center justify-between gap-4 border-b border-line py-2">
        <span>
          {ingredient.name}
          {note && <span className="text-secondary text-ink-muted"> {note}</span>}
        </span>
        <span className="font-mono text-secondary" aria-label={spokenAmount(amount, ingredient)}>
          {ingredient.unit === "pcs" ? `×${amount}` : formatAmount(amount, ingredient)}
        </span>
      </li>
    );
  };

  return (
    <>
      <p className={`mt-6 flex items-center gap-2 font-semibold ${STATUS_TEXT_CLASS[match.status]}`}>
        <StatusMark status={match.status} />
        {match.missingCount === 0 ? "Ready to cook" : `Missing ${match.missingCount}`}
        <span className="font-normal text-ink-muted">
          · You have {match.haveCount} of {match.items.length}
        </span>
      </p>

      {need.length > 0 && (
        <section aria-labelledby="need-title" className="mt-6">
          <h2 id="need-title" className="text-lg font-bold">
            You need
          </h2>
          <p className="text-secondary text-ink-muted">Prices aren&apos;t collected yet.</p>
          <ul className="mt-2">
            {need.map((i) => row(i.id, i.missingAmount, i.state === "partial" ? `(you have ${formatAmount(i.have, getIngredient(i.id))})` : undefined))}
          </ul>
        </section>
      )}

      {have.length > 0 && (
        <section aria-labelledby="have-title" className="mt-6">
          <h2 id="have-title" className="text-lg font-bold">
            You have
          </h2>
          <ul className="mt-2">{have.map((i) => row(i.id, i.needed))}</ul>
        </section>
      )}

      {(basics.length > 0 || optional.length > 0) && (
        <section aria-labelledby="extra-title" className="mt-6">
          <h2 id="extra-title" className="text-lg font-bold">
            Also used
          </h2>
          <ul className="mt-2">
            {basics.map((i) => row(i.id, i.quantity, "(basic)"))}
            {optional.map((i) => row(i.id, i.quantity, "(optional)"))}
          </ul>
        </section>
      )}
    </>
  );
}
