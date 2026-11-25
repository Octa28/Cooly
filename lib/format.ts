import type { Ingredient } from "@/lib/types";

/** "200 g", "1.5 L", "2". Pieces have no unit; the ingredient name says what they are. */
export function formatAmount(quantity: number, ingredient: Pick<Ingredient, "unit">): string {
  const q = round(quantity);
  switch (ingredient.unit) {
    case "g":
      return q >= 1000 ? `${round(q / 1000)} kg` : `${q} g`;
    case "ml":
      return q >= 1000 ? `${round(q / 1000)} L` : `${q} ml`;
    case "pcs":
      return `${q}`;
  }
}

/** Read in full for screen readers (CLAUDE.md 12.1): "100 grams spinach", "2 eggs". */
export function spokenAmount(quantity: number, ingredient: Pick<Ingredient, "unit" | "name">): string {
  const q = round(quantity);
  const name = ingredient.name.toLowerCase();
  switch (ingredient.unit) {
    case "g":
      return `${q} ${q === 1 ? "gram" : "grams"} ${name}`;
    case "ml":
      return `${q} ${q === 1 ? "millilitre" : "millilitres"} ${name}`;
    case "pcs":
      return `${q} ${name}`;
  }
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** Lower-case, no accents, trimmed: for matching what people type. */
export function normalise(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}
