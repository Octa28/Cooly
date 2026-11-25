"use client";

import { StatusMark, STATUS_TEXT_CLASS } from "@/components/ui/StatusMark";
import { DEFAULT_STAPLES, getIngredient, INGREDIENTS_BY_ID, OFFERS, PRICES_ARE_EXAMPLES, storeName, STORES } from "@/lib/data";
import { formatAmount, formatEUR, plural, spokenAmount } from "@/lib/format";
import { visibleIngredients } from "@/lib/recommender/filters";
import { matchRecipe } from "@/lib/recommender/matching";
import { cheapestCompletion } from "@/lib/recommender/pricing";
import type { Recipe } from "@/lib/types";
import { useToday } from "@/lib/use-today";
import { constraintsStore, fridgeStore, NO_CONSTRAINTS } from "@/lib/user-state";

/** "You need" (with prices) and "You have" lists for one recipe, from the fridge in this browser. */
export function RecipeIngredients({ recipe }: { recipe: Recipe }) {
  const fridge = fridgeStore.useValue();
  const constraints = constraintsStore.useValue() ?? NO_CONSTRAINTS;
  const today = useToday();
  if (fridge === null || today === null) return <div aria-busy="true" className="mt-8 min-h-40" />;

  const match = matchRecipe(recipe, fridge, DEFAULT_STAPLES, INGREDIENTS_BY_ID, constraints);
  const have = match.items.filter((i) => i.state === "covered");
  const need = match.items.filter((i) => i.state !== "covered");
  const completion = cheapestCompletion(
    need.map((i) => ({ ingredientId: i.id, amount: i.missingAmount })),
    OFFERS,
    STORES,
    today,
  );
  const { shown, hiddenCount } = visibleIngredients(recipe, INGREDIENTS_BY_ID, constraints);
  const optional = shown.filter((i) => i.optional);
  const basics = shown.filter((i) => !i.optional && DEFAULT_STAPLES.has(i.id));

  const row = (id: string, amount: number, note?: string, price?: string) => {
    const ingredient = getIngredient(id);
    return (
      <li key={id} className="flex min-h-11 items-center justify-between gap-4 border-b border-line py-2">
        <span>
          {ingredient.name}
          {note && <span className="text-secondary text-ink-muted"> {note}</span>}
        </span>
        <span className="text-right font-mono text-secondary">
          <span aria-label={spokenAmount(amount, ingredient)}>
            {ingredient.unit === "pcs" ? `×${amount}` : formatAmount(amount, ingredient)}
          </span>
          {price && <span className="block text-ink-muted">{price}</span>}
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
          <p className="font-mono">
            {formatEUR(completion.cents)} {completion.storeId ? `at ${storeName(completion.storeId)}` : "across shops"}
          </p>
          {PRICES_ARE_EXAMPLES && <p className="text-secondary text-ink-muted">Example prices, not checked in a store yet.</p>}
          <ul className="mt-2">
            {need.map((i) => {
              const priced = completion.items.find((p) => p.ingredientId === i.id);
              const price = priced
                ? `${formatEUR(priced.costCents)}${priced.packs > 1 ? ` (${priced.packs} packs)` : ""}${completion.storeId ? "" : ` · ${storeName(priced.storeId)}`}`
                : "No price yet";
              const note = i.state === "partial" ? `(you have ${formatAmount(i.have, getIngredient(i.id))})` : undefined;
              return row(i.id, i.missingAmount, note, price);
            })}
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
      {hiddenCount > 0 && (
        <p className="mt-2 text-secondary text-ink-muted">
          {plural(hiddenCount, "optional ingredient is", "optional ingredients are")} hidden because of your allergies.
        </p>
      )}
    </>
  );
}
