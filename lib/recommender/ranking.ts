import { passesHardFilters } from "@/lib/recommender/filters";
import { matchRecipe } from "@/lib/recommender/matching";
import { cheapestCompletion, type Completion } from "@/lib/recommender/pricing";
import type { Constraints, Fridge, Ingredient, Offer, Recipe, RecipeMatch, Store } from "@/lib/types";

export type SortKey = "recommended" | "price" | "time" | "fridge" | "fewest";

/** `short` is what the Sort button shows, so it fits next to Filters at 390 px. */
export const SORT_OPTIONS: readonly { id: SortKey; label: string; short: string; hint: string }[] = [
  { id: "recommended", label: "Best match", short: "Best match", hint: "Cheapest to finish, then the ones you have most of" },
  { id: "price", label: "Price", short: "Price", hint: "Cheapest to finish first" },
  { id: "time", label: "Cooking time", short: "Quickest", hint: "Quickest first" },
  { id: "fridge", label: "Uses most of your fridge", short: "Uses my fridge", hint: "Uses up more of what you already have" },
  { id: "fewest", label: "Fewest ingredients", short: "Fewest items", hint: "Simplest recipes first" },
];

/** Cost-to-finish filter in cents. `maxCents: null` means no upper limit. */
export interface PriceRange {
  minCents: number;
  maxCents: number | null;
}

export const ANY_PRICE: PriceRange = { minCents: 0, maxCents: null };

export interface Ranked {
  match: RecipeMatch;
  completion: Completion;
}

export interface RankInput {
  recipes: readonly Recipe[];
  fridge: Fridge;
  staples: ReadonlySet<string>;
  byId: ReadonlyMap<string, Ingredient>;
  constraints: Constraints;
  offers: readonly Offer[];
  stores: readonly Store[];
  today: string;
  sort: SortKey;
  range: PriceRange;
}

export interface RankResult {
  /** Recipes inside the price range, in the chosen order. Group by `match.status` to get the three lists. */
  ranked: Ranked[];
  /** Recipes that pass the hard filters but fall outside the price range: never hidden silently. */
  outside: Ranked[];
  /** Most expensive cost to finish among recipes that pass the hard filters: the slider's top end. */
  maxCents: number;
}

const share = (m: RecipeMatch) => (m.items.length ? m.haveCount / m.items.length : 1);

function comparator(sort: SortKey, fridgeEmpty: boolean): (a: Ranked, b: Ranked) => number {
  const cost = (a: Ranked, b: Ranked) => a.completion.cents - b.completion.cents;
  const time = (a: Ranked, b: Ranked) => a.match.recipe.minutes - b.match.recipe.minutes;
  switch (sort) {
    case "price":
      return (a, b) => cost(a, b) || time(a, b);
    case "time":
      return (a, b) => time(a, b) || cost(a, b);
    case "fridge":
      return (a, b) => b.match.haveCount - a.match.haveCount || cost(a, b);
    case "fewest":
      return (a, b) => a.match.items.length - b.match.items.length || time(a, b);
    case "recommended":
      // An empty fridge has no match to rank by, so fall back to the featured order.
      if (fridgeEmpty) return (a, b) => a.match.recipe.featuredRank - b.match.recipe.featuredRank;
      // CLAUDE.md 9.4: cost to complete, then share already owned, then cooking time.
      return (a, b) => cost(a, b) || share(b.match) - share(a.match) || time(a, b);
  }
}

export function inRange(cents: number, range: PriceRange): boolean {
  return cents >= range.minCents && (range.maxCents === null || cents <= range.maxCents);
}

/** Hard filters → matching → pricing → price range → sort. */
export function rank(input: RankInput): RankResult {
  const { recipes, fridge, staples, byId, constraints, offers, stores, today, sort, range } = input;
  const all: Ranked[] = recipes
    .filter((r) => passesHardFilters(r, byId, constraints))
    .map((recipe) => {
      const match = matchRecipe(recipe, fridge, staples, byId, constraints);
      const needs = match.items
        .filter((i) => i.state !== "covered")
        .map((i) => ({ ingredientId: i.id, amount: i.missingAmount }));
      return { match, completion: cheapestCompletion(needs, offers, stores, today) };
    });

  const sorted = [...all].sort(comparator(sort, Object.keys(fridge).length === 0));
  return {
    ranked: sorted.filter((r) => inRange(r.completion.cents, range)),
    outside: sorted.filter((r) => !inRange(r.completion.cents, range)),
    maxCents: all.reduce((m, r) => Math.max(m, r.completion.cents), 0),
  };
}
