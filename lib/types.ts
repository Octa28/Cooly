// Shared domain types. Field names follow the data model in CLAUDE.md section 9.2,
// in camelCase because they live in TypeScript and JSON, not SQL.

export type Unit = "g" | "ml" | "pcs";

/** The 14 EU allergens. */
export type AllergenId =
  | "gluten"
  | "crustaceans"
  | "eggs"
  | "fish"
  | "peanuts"
  | "soybeans"
  | "milk"
  | "nuts"
  | "celery"
  | "mustard"
  | "sesame"
  | "sulphites"
  | "lupin"
  | "molluscs";

export type Diet = "vegan" | "vegetarian" | "pescatarian" | "halal";

export type Equipment = "stove" | "oven" | "microwave" | "air-fryer" | "blender" | "kettle";

/** What kind of animal product an ingredient is; drives the diet tags. */
export type AnimalSource = "meat" | "pork" | "fish" | "dairy" | "egg" | "honey";

export interface Ingredient {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  /** Canonical unit. Recipe and fridge quantities are always in this unit. */
  unit: Unit;
  gramsPerPiece: number | null;
  /** Amount added when someone picks the ingredient without typing a quantity (a typical pack). */
  defaultQuantity: number;
  allergens: AllergenId[];
  animal: AnimalSource | null;
}

export interface RecipeIngredient {
  id: string;
  quantity: number;
  optional: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  cuisine: string;
  summary: string;
  servings: number;
  minutes: number;
  equipment: Equipment[];
  ingredients: RecipeIngredient[];
  steps: string[];
  dietTags: Diet[];
  /** Placeholder order for "Popular recipes" until there is real usage data. */
  featuredRank: number;
  source: string;
}

export interface Store {
  id: string;
  name: string;
}

/** One product at one store (CLAUDE.md 9.2 `offers`). Money in integer cents. */
export interface Offer {
  storeId: string;
  ingredientId: string;
  productName: string;
  /** In the ingredient's canonical unit. */
  packQuantity: number;
  priceCents: number;
  isOffer: boolean;
  /** ISO dates; null = no limit. */
  validFrom: string | null;
  validTo: string | null;
  sourceUrl: string | null;
  collectedOn: string | null;
  /** True for invented prices that haven't been checked in a store. */
  example: boolean;
}

/** Ingredient id → quantity in that ingredient's canonical unit. */
export type Fridge = Record<string, number>;

/** Hard constraints from the user's profile. `null` means "not set", so nothing is filtered. */
export interface Constraints {
  allergens: AllergenId[];
  diet: Diet | null;
  equipment: Equipment[] | null;
}

export type Status = "ready" | "few" | "many";

export interface IngredientMatch {
  id: string;
  needed: number;
  have: number;
  state: "covered" | "partial" | "missing";
  /** How much more is needed; 0 when covered. */
  missingAmount: number;
}

export interface RecipeMatch {
  recipe: Recipe;
  /** Non-optional ingredients that aren't staples, in recipe order. */
  items: IngredientMatch[];
  haveCount: number;
  missingCount: number;
  status: Status;
}
