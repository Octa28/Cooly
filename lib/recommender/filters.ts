import type { Constraints, Ingredient, Recipe, RecipeIngredient } from "@/lib/types";

type Lookup = ReadonlyMap<string, Ingredient>;

function hasAllergen(item: RecipeIngredient, byId: Lookup, allergens: Constraints["allergens"]): boolean {
  const ingredient = byId.get(item.id);
  return Boolean(ingredient?.allergens.some((a) => allergens.includes(a)));
}

/**
 * Hard filters (CLAUDE.md 9.3), applied before anything else. A recipe is excluded when:
 * - a non-optional ingredient contains a selected allergen;
 * - the user has a diet and the recipe isn't tagged with it;
 * - it needs equipment the user doesn't have.
 */
export function passesHardFilters(recipe: Recipe, byId: Lookup, c: Constraints): boolean {
  if (recipe.ingredients.some((item) => !item.optional && hasAllergen(item, byId, c.allergens))) return false;
  if (c.diet && !recipe.dietTags.includes(c.diet)) return false;
  if (c.equipment && recipe.equipment.some((e) => !c.equipment!.includes(e))) return false;
  return true;
}

/** The recipe's ingredients minus optional ones that contain one of the user's allergens. */
export function visibleIngredients(recipe: Recipe, byId: Lookup, c: Constraints) {
  const shown = recipe.ingredients.filter((item) => !(item.optional && hasAllergen(item, byId, c.allergens)));
  return { shown, hiddenCount: recipe.ingredients.length - shown.length };
}
