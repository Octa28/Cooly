import { describe, expect, it } from "vitest";
import { DEFAULT_STAPLES, INGREDIENTS, INGREDIENTS_BY_ID, RECIPES } from "@/lib/data";
import type { Diet } from "@/lib/types";

// Guards hand edits to data/*.json.
describe("data files", () => {
  it("every recipe ingredient and staple exists", () => {
    for (const r of RECIPES) {
      for (const item of r.ingredients) expect(INGREDIENTS_BY_ID.has(item.id), `${r.id}: ${item.id}`).toBe(true);
    }
    for (const id of DEFAULT_STAPLES) expect(INGREDIENTS_BY_ID.has(id)).toBe(true);
  });

  it("ids are unique", () => {
    expect(new Set(INGREDIENTS.map((i) => i.id)).size).toBe(INGREDIENTS.length);
    expect(new Set(RECIPES.map((r) => r.id)).size).toBe(RECIPES.length);
  });

  it("diet tags match what's in the recipe (optional ingredients included, to stay on the safe side)", () => {
    for (const r of RECIPES) {
      const animals = new Set(r.ingredients.map((i) => INGREDIENTS_BY_ID.get(i.id)!.animal).filter(Boolean));
      const noMeat = !animals.has("meat") && !animals.has("pork");
      const expected: Diet[] = [];
      if (animals.size === 0) expected.push("vegan");
      if (noMeat && !animals.has("fish")) expected.push("vegetarian");
      if (noMeat) expected.push("pescatarian");
      // Conservative halal rule: no pork and no meat, because certification is unknown. See docs/decisions.md.
      if (noMeat) expected.push("halal");
      expect([...r.dietTags].sort(), r.id).toEqual(expected.sort());
    }
  });

  it("every recipe has steps and positive quantities", () => {
    for (const r of RECIPES) {
      expect(r.steps.length, r.id).toBeGreaterThan(0);
      for (const item of r.ingredients) expect(item.quantity, `${r.id}: ${item.id}`).toBeGreaterThan(0);
    }
  });
});

describe("money formatting", async () => {
  const { formatEUR, parseEuroInput } = await import("@/lib/format");
  it("formats cents as euros", () => {
    expect(formatEUR(240)).toBe("€2.40");
    expect(formatEUR(0)).toBe("€0.00");
  });
  it.each([
    ["2.5", 250],
    ["2,50", 250],
    ["€ 3", 300],
    ["0", 0],
    ["abc", null],
    ["-1", null],
    ["2.555", null],
    ["", null],
  ] as const)("parses %j", (text, cents) => {
    expect(parseEuroInput(text)).toBe(cents);
  });
});
