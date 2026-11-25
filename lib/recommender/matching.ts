import { passesHardFilters, visibleIngredients } from "@/lib/recommender/filters";
import type { Constraints, Fridge, Ingredient, IngredientMatch, Recipe, RecipeMatch, Status } from "@/lib/types";

type Lookup = ReadonlyMap<string, Ingredient>;

/** Missing-ingredient counts where each list starts (CLAUDE.md 9.4). The one place to change them. */
export const STATUS_THRESHOLDS = { few: 1, many: 4 } as const;

export const STATUS_ORDER: readonly Status[] = ["ready", "few", "many"];

export function statusFor(missingCount: number): Status {
  if (missingCount >= STATUS_THRESHOLDS.many) return "many";
  if (missingCount >= STATUS_THRESHOLDS.few) return "few";
  return "ready";
}

/**
 * Compares one recipe with the fridge. Staples count as available in any amount and are left out
 * of the "You have 5 of 7" count, so salt and oil don't inflate it. Optional ingredients don't count either.
 */
export function matchRecipe(
  recipe: Recipe,
  fridge: Fridge,
  staples: ReadonlySet<string>,
  byId: Lookup,
  c: Constraints,
): RecipeMatch {
  const items: IngredientMatch[] = visibleIngredients(recipe, byId, c)
    .shown.filter((item) => !item.optional && !staples.has(item.id))
    .map((item) => {
      const have = fridge[item.id] ?? 0;
      const state = have >= item.quantity ? "covered" : have > 0 ? "partial" : "missing";
      return { id: item.id, needed: item.quantity, have, state, missingAmount: Math.max(0, item.quantity - have) };
    });

  const missingCount = items.filter((i) => i.state !== "covered").length;
  return { recipe, items, haveCount: items.length - missingCount, missingCount, status: statusFor(missingCount) };
}

export type GroupedResults = Record<Status, RecipeMatch[]>;

/**
 * Filters, matches and groups recipes into the three lists.
 * Within a list: larger share already in the fridge first, then quicker recipes.
 * TODO(team): put "cost to complete" first once data/offers.json exists (9.4, 9.5).
 */
export function recommend(
  recipes: readonly Recipe[],
  fridge: Fridge,
  staples: ReadonlySet<string>,
  byId: Lookup,
  c: Constraints,
): GroupedResults {
  const groups: GroupedResults = { ready: [], few: [], many: [] };
  for (const recipe of recipes) {
    if (!passesHardFilters(recipe, byId, c)) continue;
    const match = matchRecipe(recipe, fridge, staples, byId, c);
    groups[match.status].push(match);
  }
  const share = (m: RecipeMatch) => (m.items.length ? m.haveCount / m.items.length : 1);
  for (const status of STATUS_ORDER) {
    groups[status].sort((a, b) => share(b) - share(a) || a.recipe.minutes - b.recipe.minutes);
  }
  return groups;
}
