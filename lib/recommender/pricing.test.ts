import { describe, expect, it } from "vitest";
import { cheapestCompletion, MIX_MIN_SAVING_CENTS } from "@/lib/recommender/pricing";
import type { Offer, Store } from "@/lib/types";

const STORES: Store[] = [
  { id: "ah", name: "Albert Heijn" },
  { id: "jumbo", name: "Jumbo" },
];
const TODAY = "2026-11-25";

function offer(storeId: string, ingredientId: string, packQuantity: number, priceCents: number, extra: Partial<Offer> = {}): Offer {
  return {
    storeId, ingredientId, productName: ingredientId, packQuantity, priceCents,
    isOffer: false, validFrom: null, validTo: null, sourceUrl: null, collectedOn: null, example: true, ...extra,
  };
}

describe("cheapestCompletion", () => {
  it("costs nothing when nothing is missing", () => {
    expect(cheapestCompletion([], [], STORES, TODAY)).toEqual({ cents: 0, storeId: null, items: [], unpriced: [] });
  });

  it("buys whole packs", () => {
    const c = cheapestCompletion([{ ingredientId: "egg", amount: 7 }], [offer("ah", "egg", 6, 200)], STORES, TODAY);
    expect(c.items[0].packs).toBe(2);
    expect(c.cents).toBe(400);
    expect(c.storeId).toBe("ah");
  });

  it("picks the pack size that is cheapest for the amount, not per unit", () => {
    const offers = [offer("ah", "rice", 1000, 219), offer("ah", "rice", 400, 99)];
    expect(cheapestCompletion([{ ingredientId: "rice", amount: 150 }], offers, STORES, TODAY).cents).toBe(99);
  });

  it("prefers one store unless mixing saves at least the threshold", () => {
    const needs = [{ ingredientId: "a", amount: 1 }, { ingredientId: "b", amount: 1 }];
    // AH: 100 + 300 = 400. Jumbo: 300 + 100 = 400. Mix: 100 + 100 = 200, saves 200.
    const offers = [offer("ah", "a", 1, 100), offer("ah", "b", 1, 300), offer("jumbo", "a", 1, 300), offer("jumbo", "b", 1, 100)];
    const mixed = cheapestCompletion(needs, offers, STORES, TODAY);
    expect(mixed.storeId).toBeNull();
    expect(mixed.cents).toBe(200);

    // Make the saving just under the threshold: one store wins.
    const close = [offer("ah", "a", 1, 100), offer("ah", "b", 1, 100 + MIX_MIN_SAVING_CENTS - 1), offer("jumbo", "a", 1, 500), offer("jumbo", "b", 1, 100)];
    expect(cheapestCompletion(needs, close, STORES, TODAY).storeId).toBe("ah");
  });

  it("reports ingredients nobody sells as unpriced instead of €0", () => {
    const c = cheapestCompletion([{ ingredientId: "saffron", amount: 1 }, { ingredientId: "a", amount: 1 }], [offer("ah", "a", 1, 100)], STORES, TODAY);
    expect(c.unpriced).toEqual(["saffron"]);
    expect(c.cents).toBe(100);
    expect(c.storeId).toBe("ah");
  });

  it("ignores offers that aren't valid today", () => {
    const offers = [offer("ah", "a", 1, 50, { validTo: "2026-11-01" }), offer("ah", "a", 1, 120)];
    expect(cheapestCompletion([{ ingredientId: "a", amount: 1 }], offers, STORES, TODAY).cents).toBe(120);
  });
});
