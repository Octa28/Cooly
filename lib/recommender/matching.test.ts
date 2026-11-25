import { describe, expect, it } from "vitest";
import { DEFAULT_STAPLES, INGREDIENTS_BY_ID, RECIPES } from "@/lib/data";
import { matchRecipe, statusFor } from "@/lib/recommender/matching";
import type { Constraints } from "@/lib/types";

const NONE: Constraints = { allergens: [], diet: null, equipment: null };
const omelette = RECIPES.find((r) => r.id === "spanish-omelette")!; // 4 eggs, 400 g potatoes, 1 onion + staples

describe("statusFor", () => {
  it.each([
    [0, "ready"],
    [1, "few"],
    [3, "few"],
    [4, "many"],
    [9, "many"],
  ] as const)("%i missing → %s", (missing, status) => {
    expect(statusFor(missing)).toBe(status);
  });
});

describe("matchRecipe", () => {
  it("is ready when every non-staple is covered; staples don't need to be in the fridge", () => {
    const m = matchRecipe(omelette, { egg: 6, potato: 1000, onion: 3 }, DEFAULT_STAPLES, INGREDIENTS_BY_ID, NONE);
    expect(m.status).toBe("ready");
    expect(m.haveCount).toBe(3);
    expect(m.items.map((i) => i.id)).toEqual(["egg", "potato", "onion"]); // oil and salt are left out
  });

  it("counts a partial quantity as missing, with the amount still needed", () => {
    const m = matchRecipe(omelette, { egg: 2, potato: 1000, onion: 3 }, DEFAULT_STAPLES, INGREDIENTS_BY_ID, NONE);
    const egg = m.items.find((i) => i.id === "egg")!;
    expect(egg.state).toBe("partial");
    expect(egg.missingAmount).toBe(2);
    expect(m.missingCount).toBe(1);
    expect(m.status).toBe("few");
  });

  it("doesn't count optional ingredients", () => {
    const shakshuka = RECIPES.find((r) => r.id === "shakshuka")!;
    const m = matchRecipe(shakshuka, {}, DEFAULT_STAPLES, INGREDIENTS_BY_ID, NONE);
    expect(m.items.map((i) => i.id)).not.toContain("bread");
    expect(m.items.map((i) => i.id)).not.toContain("chili");
  });
});
