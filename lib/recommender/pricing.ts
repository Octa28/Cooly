import type { Offer, Store } from "@/lib/types";

/** Show the cheaper mix of stores only if it beats the best single store by at least this much (CLAUDE.md 9.5). */
export const MIX_MIN_SAVING_CENTS = 100;

export interface Need {
  ingredientId: string;
  /** Amount still needed, in the ingredient's canonical unit. */
  amount: number;
}

export interface PricedNeed extends Need {
  storeId: string;
  productName: string;
  packs: number;
  packQuantity: number;
  costCents: number;
}

export interface Completion {
  /** Total for the priced items. A lower bound when `unpriced` isn't empty. */
  cents: number;
  /** The one store to go to, or null when the plan mixes stores (or nothing needs buying). */
  storeId: string | null;
  items: PricedNeed[];
  /** Ingredients no store has a price for: shown as "No price yet", never as €0. */
  unpriced: string[];
}

function isValid(offer: Offer, today: string): boolean {
  return (!offer.validFrom || offer.validFrom <= today) && (!offer.validTo || offer.validTo >= today);
}

/** Cheapest way to buy `need` at one store. You buy whole packs: packs = ceil(amount / pack size). */
function bestAt(storeId: string, need: Need, offers: readonly Offer[], today: string): PricedNeed | null {
  let best: PricedNeed | null = null;
  for (const o of offers) {
    if (o.storeId !== storeId || o.ingredientId !== need.ingredientId || !isValid(o, today)) continue;
    const packs = Math.ceil(need.amount / o.packQuantity);
    const costCents = packs * o.priceCents;
    if (!best || costCents < best.costCents) {
      best = { ...need, storeId, productName: o.productName, packs, packQuantity: o.packQuantity, costCents };
    }
  }
  return best;
}

const sum = (items: PricedNeed[]) => items.reduce((n, i) => n + i.costCents, 0);

/**
 * Cheapest way to buy everything in `needs`: the cheapest single store that has all of it, unless
 * mixing stores saves at least MIX_MIN_SAVING_CENTS (students rarely visit two shops).
 */
export function cheapestCompletion(
  needs: readonly Need[],
  offers: readonly Offer[],
  stores: readonly Store[],
  today: string,
): Completion {
  if (needs.length === 0) return { cents: 0, storeId: null, items: [], unpriced: [] };

  // Mix: the cheapest store per item.
  const mixItems: PricedNeed[] = [];
  const unpriced: string[] = [];
  for (const need of needs) {
    const options = stores.map((s) => bestAt(s.id, need, offers, today)).filter((x): x is PricedNeed => x !== null);
    if (options.length === 0) unpriced.push(need.ingredientId);
    else mixItems.push(options.reduce((a, b) => (b.costCents < a.costCents ? b : a)));
  }
  const mix: Completion = { cents: sum(mixItems), storeId: null, items: mixItems, unpriced };

  // Single store: only stores that have everything that's priced anywhere.
  let single: Completion | null = null;
  for (const store of stores) {
    const items = needs
      .filter((n) => !unpriced.includes(n.ingredientId))
      .map((n) => bestAt(store.id, n, offers, today));
    if (items.some((i) => i === null)) continue;
    const priced = items as PricedNeed[];
    const cents = sum(priced);
    if (!single || cents < single.cents) single = { cents, storeId: store.id, items: priced, unpriced };
  }

  if (!single) return mix;
  if (new Set(mixItems.map((i) => i.storeId)).size === 1) return single;
  return single.cents - mix.cents >= MIX_MIN_SAVING_CENTS ? mix : single;
}

/** Today's date as YYYY-MM-DD in the user's time zone, for checking offer validity. */
export function todayISO(now = new Date()): string {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}
