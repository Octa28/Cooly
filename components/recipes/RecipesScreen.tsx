"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Check } from "@phosphor-icons/react";
import { IngredientSearch } from "@/components/recipes/IngredientSearch";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { useFlip } from "@/components/recipes/useFlip";
import { StatusMark, STATUS_LABEL } from "@/components/ui/StatusMark";
import { type UndoOffer, UndoToast } from "@/components/ui/UndoToast";
import { DEFAULT_STAPLES, INGREDIENTS_BY_ID, RECIPES } from "@/lib/data";
import { plural, spokenAmount } from "@/lib/format";
import { passesHardFilters } from "@/lib/recommender/filters";
import { type GroupedResults, recommend, STATUS_ORDER } from "@/lib/recommender/matching";
import type { Constraints, Diet, Fridge, Ingredient } from "@/lib/types";
import { addToFridge, dietStore, fridgeStore, removeFromFridge } from "@/lib/user-state";

const DIETS: { id: Diet; label: string }[] = [
  { id: "vegan", label: "Vegan" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "halal", label: "Halal" },
  { id: "pescatarian", label: "Pescatarian" },
];

function constraintsFor(diet: Diet | null): Constraints {
  // Allergies and equipment come from onboarding, which isn't built yet.
  return { allergens: [], diet, equipment: null };
}

function results(fridge: Fridge, diet: Diet | null): GroupedResults {
  return recommend(RECIPES, fridge, DEFAULT_STAPLES, INGREDIENTS_BY_ID, constraintsFor(diet));
}

/** "You can cook 3 recipes right now." (section 11.9: numbers over adjectives). */
function summary(groups: GroupedResults): string {
  const ready = groups.ready.length;
  if (ready > 0) return `You can cook ${plural(ready, "recipe", "recipes")} right now.`;
  if (groups.few.length > 0) return `Nothing is ready yet, but ${plural(groups.few.length, "recipe is", "recipes are")} missing only a few things.`;
  return "Nothing is close yet. Add a few more things you have.";
}

export function RecipesScreen() {
  const storedFridge = fridgeStore.useValue();
  const storedDiet = dietStore.useValue();
  const [undo, setUndo] = useState<UndoOffer | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const hydrated = storedFridge !== null;
  const fridge = useMemo(() => storedFridge ?? {}, [storedFridge]);
  const diet = storedDiet ?? null;
  const hasItems = Object.keys(fridge).length > 0;

  const groups = useMemo(() => results(fridge, diet), [fridge, diet]);
  const popular = useMemo(
    () =>
      RECIPES.filter((r) => passesHardFilters(r, INGREDIENTS_BY_ID, constraintsFor(diet))).sort(
        (a, b) => a.featuredRank - b.featuredRank,
      ),
    [diet],
  );

  const order = hasItems
    ? STATUS_ORDER.map((s) => groups[s].map((m) => m.recipe.id).join(",")).join("|")
    : popular.map((r) => r.id).join(",");
  useFlip(listRef, order);

  const offerUndo = useCallback((message: string, previous: Fridge) => {
    setUndo({ id: Date.now(), message, undo: () => fridgeStore.set(previous) });
  }, []);
  const clearUndo = useCallback(() => setUndo(null), []);

  function add(ingredient: Ingredient) {
    addToFridge(ingredient.id, ingredient.defaultQuantity);
    const next = fridgeStore.get();
    setAnnouncement(`Added ${spokenAmount(ingredient.defaultQuantity, ingredient)}. ${summary(results(next, diet))}`);
  }

  function remove(ingredient: Ingredient) {
    const previous = fridgeStore.get();
    removeFromFridge(ingredient.id);
    setAnnouncement(`Removed ${ingredient.name.toLowerCase()}. ${summary(results(fridgeStore.get(), diet))}`);
    offerUndo(`Removed ${ingredient.name.toLowerCase()}.`, previous);
  }

  function clear() {
    const previous = fridgeStore.get();
    const count = Object.keys(previous).length;
    fridgeStore.set({});
    setAnnouncement(`Removed all ${plural(count, "ingredient", "ingredients")}.`);
    offerUndo(`Removed ${plural(count, "ingredient", "ingredients")}.`, previous);
  }

  const total = STATUS_ORDER.reduce((n, s) => n + groups[s].length, 0);

  return (
    <>
      <div className="mt-6">
        <IngredientSearch fridge={fridge} onAdd={add} onRemove={remove} onClear={clear} />
      </div>

      <div role="group" aria-label="Diet" className="mt-4 flex flex-wrap gap-2">
        {DIETS.map((d) => {
          const on = diet === d.id;
          return (
            <button
              key={d.id}
              type="button"
              aria-pressed={on}
              onClick={() => dietStore.set(on ? null : d.id)}
              className={`flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border-2 px-4 font-semibold ${
                on ? "border-accent bg-accent-soft text-accent" : "border-border bg-surface text-ink"
              }`}
            >
              {on && <Check size={16} weight="bold" aria-hidden="true" />}
              {d.label}
            </button>
          );
        })}
      </div>

      <div ref={listRef} aria-busy={!hydrated} className="mt-8">
        {!hydrated ? null : !hasItems ? (
          <section aria-labelledby="popular-title">
            <h2 id="popular-title" className="font-serif text-2xl">
              Popular recipes
            </h2>
            <p className="mt-1 text-secondary text-ink-muted">Add what you have, and these turn into recipes you can cook now.</p>
            {popular.length === 0 ? (
              <EmptyDiet onReset={() => dietStore.set(null)} />
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {popular.map((r) => (
                  <li key={r.id} data-flip={r.id}>
                    <RecipeCard recipe={r} match={null} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : total === 0 ? (
          <EmptyDiet onReset={() => dietStore.set(null)} />
        ) : (
          <>
            <p className="font-serif text-xl">{summary(groups)}</p>
            {STATUS_ORDER.map((status) => (
              <section key={status} aria-labelledby={`list-${status}`} className="mt-8">
                <h2 id={`list-${status}`} className="flex items-center gap-2 text-lg font-bold">
                  <StatusMark status={status} size={18} decorative />
                  {STATUS_LABEL[status]} <span className="font-mono font-normal text-ink-muted">({groups[status].length})</span>
                </h2>
                {groups[status].length === 0 ? (
                  <p className="mt-2 text-secondary text-ink-muted">None right now.</p>
                ) : (
                  <ul className="mt-3 flex flex-col gap-3">
                    {groups[status].map((m) => (
                      <li key={m.recipe.id} data-flip={m.recipe.id}>
                        <RecipeCard recipe={m.recipe} match={m} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </>
        )}
        <p className="mt-10 text-secondary text-ink-muted">
          Salt, pepper and oil count as basics you always have. Recipes and amounts are example data for now.
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
      <UndoToast key={undo?.id} offer={undo} onDone={clearUndo} />
    </>
  );
}

function EmptyDiet({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-4 rounded-card border border-line p-4">
      <p>No recipes fit this diet yet.</p>
      <button type="button" onClick={onReset} className="mt-3 min-h-11 rounded-control border-2 border-accent px-4 font-semibold text-accent">
        Show all diets
      </button>
    </div>
  );
}
