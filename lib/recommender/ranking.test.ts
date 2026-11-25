import { describe, expect, it } from "vitest";
import { DEFAULT_STAPLES, INGREDIENTS_BY_ID, OFFERS, RECIPES, STORES } from "@/lib/data";
import { ANY_PRICE, rank, type RankInput, type SortKey } from "@/lib/recommender/ranking";
import type { Fridge } from "@/lib/types";

const base: RankInput = {
  recipes: RECIPES,
  fridge: {},
  staples: DEFAULT_STAPLES,
  byId: INGREDIENTS_BY_ID,
  constraints: { allergens: [], diet: null, equipment: null },
  offers: OFFERS,
  stores: STORES,
  today: "2026-11-25",
  sort: "recommended",
  range: ANY_PRICE,
};
const FRIDGE: Fridge = { egg: 6, potato: 1000, onion: 3, "bell-pepper": 2 };

const isSorted = (xs: number[], dir: 1 | -1 = 1) => xs.every((x, i) => i === 0 || dir * (x - xs[i - 1]) >= 0);

describe("rank", () => {
  it("uses the featured order for an empty fridge with Best match", () => {
    const { ranked } = rank(base);
    expect(isSorted(ranked.map((r) => r.match.recipe.featuredRank))).toBe(true);
  });

  it.each([
    ["price", (r: ReturnType<typeof rank>["ranked"][number]) => r.completion.cents, 1],
    ["time", (r: ReturnType<typeof rank>["ranked"][number]) => r.match.recipe.minutes, 1],
    ["fridge", (r: ReturnType<typeof rank>["ranked"][number]) => r.match.haveCount, -1],
    ["fewest", (r: ReturnType<typeof rank>["ranked"][number]) => r.match.items.length, 1],
  ] as const)("sorts by %s", (sort, key, dir) => {
    const { ranked } = rank({ ...base, fridge: FRIDGE, sort: sort as SortKey });
    expect(isSorted(ranked.map(key), dir)).toBe(true);
  });

  it("a ready recipe costs nothing to finish", () => {
    const { ranked } = rank({ ...base, fridge: FRIDGE });
    const omelette = ranked.find((r) => r.match.recipe.id === "spanish-omelette")!;
    expect(omelette.match.status).toBe("ready");
    expect(omelette.completion.cents).toBe(0);
  });

  it("moves recipes outside the price range to `outside` instead of dropping them", () => {
    const all = rank({ ...base, fridge: FRIDGE });
    const limited = rank({ ...base, fridge: FRIDGE, range: { minCents: 0, maxCents: 300 } });
    expect(limited.ranked.length + limited.outside.length).toBe(all.ranked.length);
    for (const r of limited.ranked) expect(r.completion.cents).toBeLessThanOrEqual(300);
    for (const r of limited.outside) expect(r.completion.cents).toBeGreaterThan(300);
  });

  it("maxCents is the most expensive cost to finish, regardless of the range", () => {
    const all = rank({ ...base, fridge: FRIDGE });
    const limited = rank({ ...base, fridge: FRIDGE, range: { minCents: 0, maxCents: 100 } });
    expect(all.maxCents).toBe(Math.max(...all.ranked.map((r) => r.completion.cents)));
    expect(limited.maxCents).toBe(all.maxCents);
  });

  it("the example prices cover every non-staple ingredient", () => {
    for (const r of rank(base).ranked) expect(r.completion.unpriced, r.match.recipe.id).toEqual([]);
  });
});
