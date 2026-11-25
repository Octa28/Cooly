import { describe, expect, it } from "vitest";
import { DEFAULT_STAPLES, INGREDIENTS, INGREDIENTS_BY_ID, RECIPES } from "@/lib/data";
import { passesHardFilters, visibleIngredients } from "@/lib/recommender/filters";
import { recommend, STATUS_ORDER } from "@/lib/recommender/matching";
import type { AllergenId, Constraints, Fridge } from "@/lib/types";

const NONE: Constraints = { allergens: [], diet: null, equipment: null };
const ALL_ALLERGENS = [...new Set(INGREDIENTS.flatMap((i) => i.allergens))] as AllergenId[];

// A fridge holding everything, so every recipe that passes the filters is "ready".
const FULL_FRIDGE: Fridge = Object.fromEntries(INGREDIENTS.map((i) => [i.id, 1e6]));

describe("allergen exclusion (safety-relevant)", () => {
  it.each(ALL_ALLERGENS)("no list ever shows a recipe that needs %s", (allergen) => {
    const c: Constraints = { ...NONE, allergens: [allergen] };
    for (const fridge of [{}, FULL_FRIDGE]) {
      const groups = recommend(RECIPES, fridge, DEFAULT_STAPLES, INGREDIENTS_BY_ID, c);
      for (const status of STATUS_ORDER) {
        for (const match of groups[status]) {
          const offending = match.recipe.ingredients.filter(
            (item) => !item.optional && INGREDIENTS_BY_ID.get(item.id)!.allergens.includes(allergen),
          );
          expect(offending, `${match.recipe.id} contains ${allergen}`).toEqual([]);
        }
      }
    }
  });

  it.each(ALL_ALLERGENS)("optional ingredients with %s are hidden from the recipe", (allergen) => {
    const c: Constraints = { ...NONE, allergens: [allergen] };
    for (const recipe of RECIPES.filter((r) => passesHardFilters(r, INGREDIENTS_BY_ID, c))) {
      const { shown } = visibleIngredients(recipe, INGREDIENTS_BY_ID, c);
      for (const item of shown) {
        expect(INGREDIENTS_BY_ID.get(item.id)!.allergens).not.toContain(allergen);
      }
    }
  });

  it("hides optional peanut butter but keeps overnight oats for a peanut allergy", () => {
    const oats = RECIPES.find((r) => r.id === "overnight-oats")!;
    const c: Constraints = { ...NONE, allergens: ["peanuts"] };
    expect(passesHardFilters(oats, INGREDIENTS_BY_ID, c)).toBe(true);
    const { shown, hiddenCount } = visibleIngredients(oats, INGREDIENTS_BY_ID, c);
    expect(shown.map((i) => i.id)).not.toContain("peanut-butter");
    expect(hiddenCount).toBe(1);
  });
});

describe("diet and equipment filters", () => {
  it("vegan keeps only recipes tagged vegan", () => {
    const groups = recommend(RECIPES, {}, DEFAULT_STAPLES, INGREDIENTS_BY_ID, { ...NONE, diet: "vegan" });
    const ids = STATUS_ORDER.flatMap((s) => groups[s].map((m) => m.recipe));
    expect(ids.length).toBeGreaterThan(0);
    for (const r of ids) expect(r.dietTags).toContain("vegan");
  });

  it("excludes recipes that need equipment the user doesn't have", () => {
    const groups = recommend(RECIPES, {}, DEFAULT_STAPLES, INGREDIENTS_BY_ID, { ...NONE, equipment: [] });
    const ids = STATUS_ORDER.flatMap((s) => groups[s].map((m) => m.recipe.id)).sort();
    expect(ids).toEqual(["greek-salad", "overnight-oats"]);
  });
});
