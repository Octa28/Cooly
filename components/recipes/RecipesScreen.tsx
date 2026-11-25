"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowsDownUp, List } from "@phosphor-icons/react";
import { FilterSheet } from "@/components/recipes/FilterSheet";
import { IngredientSearch } from "@/components/recipes/IngredientSearch";
import { PriceRange } from "@/components/recipes/PriceRange";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { SortSheet } from "@/components/recipes/SortSheet";
import { useFlip } from "@/components/recipes/useFlip";
import { StatusMark, STATUS_LABEL } from "@/components/ui/StatusMark";
import { type UndoOffer, UndoToast } from "@/components/ui/UndoToast";
import { DEFAULT_STAPLES, INGREDIENTS_BY_ID, OFFERS, PRICES_ARE_EXAMPLES, RECIPES, STORES } from "@/lib/data";
import { formatEUR, plural, spokenAmount } from "@/lib/format";
import { STATUS_ORDER } from "@/lib/recommender/matching";
import { ANY_PRICE, type PriceRange as Range, rank, type Ranked, SORT_OPTIONS, type SortKey } from "@/lib/recommender/ranking";
import type { Constraints, Fridge, Ingredient } from "@/lib/types";
import { useToday } from "@/lib/use-today";
import {
  activeFilterCount,
  addToFridge,
  constraintsStore,
  fridgeStore,
  NO_CONSTRAINTS,
  priceRangeStore,
  removeFromFridge,
  sortStore,
} from "@/lib/user-state";

/**
 * "You can cook 3 recipes right now." (section 11.9: numbers over adjectives).
 * With a price range set, it says so, because a free-to-cook recipe can sit below a "From" price.
 */
function summary(ranked: Ranked[], range: Range): string {
  const ready = ranked.filter((r) => r.match.status === "ready").length;
  const few = ranked.filter((r) => r.match.status === "few").length;
  const limited = range.minCents > 0 || range.maxCents !== null;
  const scope = limited ? " in this price range" : "";
  if (ready > 0) return `You can cook ${plural(ready, "recipe", "recipes")} right now${scope}.`;
  if (few > 0) return `Nothing${scope} is ready yet, but ${plural(few, "recipe is", "recipes are")} missing only a few things.`;
  return limited ? "Nothing in this price range is close yet." : "Nothing is close yet. Add a few more things you have.";
}

/** Rounds the slider's top end up to the next 50 cents, so it reads as a round number. */
const sliderLimit = (maxCents: number) => Math.max(50, Math.ceil(maxCents / 50) * 50);

export function RecipesScreen() {
  const storedFridge = fridgeStore.useValue();
  const constraints = constraintsStore.useValue() ?? NO_CONSTRAINTS;
  const sort = sortStore.useValue() ?? "recommended";
  const range = priceRangeStore.useValue() ?? ANY_PRICE;
  const [undo, setUndo] = useState<UndoOffer | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [showOutside, setShowOutside] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const today = useToday();
  const hydrated = storedFridge !== null && today !== null;
  const fridge = useMemo(() => storedFridge ?? {}, [storedFridge]);
  const hasItems = Object.keys(fridge).length > 0;

  const run = useCallback(
    (f: Fridge, c: Constraints, s: SortKey, r: Range) =>
      rank({
        recipes: RECIPES, fridge: f, staples: DEFAULT_STAPLES, byId: INGREDIENTS_BY_ID, constraints: c,
        // Before hydration there's no date; nothing is rendered from this result until there is.
        offers: OFFERS, stores: STORES, today: today ?? "", sort: s, range: r,
      }),
    [today],
  );
  const result = useMemo(() => run(fridge, constraints, sort, range), [run, fridge, constraints, sort, range]);
  const limitCents = sliderLimit(result.maxCents);
  const sortOption = SORT_OPTIONS.find((o) => o.id === sort)!;
  const filterCount = activeFilterCount(constraints);

  const order = [hasItems, ...result.ranked.map((r) => r.match.recipe.id)].join(",");
  useFlip(listRef, order);

  const offerUndo = useCallback((message: string, previous: Fridge) => {
    setUndo({ id: Date.now(), message, undo: () => fridgeStore.set(previous) });
  }, []);
  const clearUndo = useCallback(() => setUndo(null), []);

  function add(ingredient: Ingredient) {
    addToFridge(ingredient.id, ingredient.defaultQuantity);
    const next = run(fridgeStore.get(), constraints, sort, range);
    setAnnouncement(`Added ${spokenAmount(ingredient.defaultQuantity, ingredient)}. ${summary(next.ranked, range)}`);
  }

  function remove(ingredient: Ingredient) {
    const previous = fridgeStore.get();
    removeFromFridge(ingredient.id);
    const next = run(fridgeStore.get(), constraints, sort, range);
    setAnnouncement(`Removed ${ingredient.name.toLowerCase()}. ${summary(next.ranked, range)}`);
    offerUndo(`Removed ${ingredient.name.toLowerCase()}.`, previous);
  }

  function clear() {
    const previous = fridgeStore.get();
    const count = Object.keys(previous).length;
    fridgeStore.set({});
    setAnnouncement(`Removed all ${plural(count, "ingredient", "ingredients")}.`);
    offerUndo(`Removed ${plural(count, "ingredient", "ingredients")}.`, previous);
  }

  const card = (r: Ranked, withMatch: boolean) => (
    <li key={r.match.recipe.id} data-flip={r.match.recipe.id}>
      <RecipeCard recipe={r.match.recipe} match={withMatch ? r.match : null} completion={r.completion} />
    </li>
  );

  const toolbarButton =
    "flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-control border-2 border-border bg-surface px-2 font-semibold hover:border-ink";

  return (
    <>
      <div className="mt-6">
        <IngredientSearch fridge={fridge} onAdd={add} onRemove={remove} onClear={clear} />
      </div>

      <div className="mt-3 flex gap-2">
        <FilterSheet
          trigger={
            <button type="button" className={toolbarButton}>
              <List size={20} aria-hidden="true" className="shrink-0" />
              Filters
              {filterCount > 0 && <span className="font-mono text-accent">· {filterCount}</span>}
            </button>
          }
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          value={constraints}
          onApply={(next) => {
            constraintsStore.set(next);
            const shown = run(fridge, next, sort, range).ranked.length;
            setAnnouncement(`Filters applied. Showing ${plural(shown, "recipe", "recipes")}.`);
          }}
          countFor={(draft) => run(fridge, draft, sort, range).ranked.length}
        />
        <SortSheet
          trigger={
            <button type="button" className={toolbarButton}>
              <ArrowsDownUp size={20} aria-hidden="true" className="shrink-0" />
              <span className="truncate">
                <span className="sr-only">Sort: </span>
                {sortOption.short}
              </span>
            </button>
          }
          open={sortOpen}
          onOpenChange={setSortOpen}
          value={sort}
          onChange={(next) => {
            sortStore.set(next);
            setAnnouncement(`Sorted by ${SORT_OPTIONS.find((o) => o.id === next)!.label.toLowerCase()}.`);
          }}
        />
      </div>

      {hydrated && (
        <PriceRange
          limitCents={limitCents}
          mostExpensiveCents={result.maxCents}
          value={range}
          onChange={(next) => {
            priceRangeStore.set(next);
            setShowOutside(false);
          }}
          examplePrices={PRICES_ARE_EXAMPLES}
        />
      )}

      <div ref={listRef} aria-busy={!hydrated} className="mt-8">
        {!hydrated ? null : result.ranked.length === 0 && result.outside.length === 0 ? (
          <NoResults
            text="No recipe fits these filters."
            action="Reset filters"
            onAction={() => constraintsStore.set(NO_CONSTRAINTS)}
          />
        ) : !hasItems ? (
          <section aria-labelledby="popular-title">
            <h2 id="popular-title" className="font-serif text-2xl">
              {sort === "recommended" ? "Popular recipes" : "All recipes"}
            </h2>
            <p className="mt-1 text-secondary text-ink-muted">Add what you have, and these turn into recipes you can cook now.</p>
            <ul className="mt-4 flex flex-col gap-3">{result.ranked.map((r) => card(r, false))}</ul>
          </section>
        ) : (
          <>
            <p className="font-serif text-xl">{summary(result.ranked, range)}</p>
            {STATUS_ORDER.map((status) => {
              const list = result.ranked.filter((r) => r.match.status === status);
              return (
                <section key={status} aria-labelledby={`list-${status}`} className="mt-8">
                  <h2 id={`list-${status}`} className="flex items-center gap-2 text-lg font-bold">
                    <StatusMark status={status} size={18} decorative />
                    {STATUS_LABEL[status]} <span className="font-mono font-normal text-ink-muted">({list.length})</span>
                  </h2>
                  {list.length === 0 ? (
                    <p className="mt-2 text-secondary text-ink-muted">None right now.</p>
                  ) : (
                    <ul className="mt-3 flex flex-col gap-3">{list.map((r) => card(r, true))}</ul>
                  )}
                </section>
              );
            })}
          </>
        )}

        {hydrated && result.outside.length > 0 && (
          // Nothing is hidden silently (Nielsen #1, CLAUDE.md 9.5).
          <section aria-label="Outside your price range" className="mt-8 border-t border-line pt-4">
            <button
              type="button"
              aria-expanded={showOutside}
              onClick={() => setShowOutside(!showOutside)}
              className="min-h-11 rounded-control text-left font-semibold text-accent underline underline-offset-4"
            >
              {showOutside ? "Hide" : "Show"} {plural(result.outside.length, "recipe", "recipes")} outside{" "}
              {formatEUR(range.minCents)} – {formatEUR(range.maxCents ?? limitCents)}
            </button>
            {showOutside && <ul className="mt-3 flex flex-col gap-3">{result.outside.map((r) => card(r, hasItems))}</ul>}
          </section>
        )}

        <p className="mt-10 text-secondary text-ink-muted">
          Salt, pepper and oil count as basics you always have. Recipes, amounts and prices are example data for now.
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
      <UndoToast key={undo?.id} offer={undo} onDone={clearUndo} />
    </>
  );
}

function NoResults({ text, action, onAction }: { text: string; action: string; onAction: () => void }) {
  return (
    <div className="rounded-card border border-line p-4">
      <p>{text}</p>
      <button type="button" onClick={onAction} className="mt-3 min-h-11 rounded-control border-2 border-accent px-4 font-semibold text-accent">
        {action}
      </button>
    </div>
  );
}
