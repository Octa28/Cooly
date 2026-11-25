import Link from "next/link";
import { StatusMark, STATUS_TEXT_CLASS } from "@/components/ui/StatusMark";
import { getIngredient, storeName } from "@/lib/data";
import { formatAmount, formatEUR } from "@/lib/format";
import type { Completion } from "@/lib/recommender/pricing";
import type { Recipe, RecipeMatch } from "@/lib/types";

const DIET_LABEL = { vegan: "Vegan", vegetarian: "Vegetarian" } as const;

/** What's still needed, in plain words: "garlic, eggs (2 more)". */
function missingText(match: RecipeMatch): string {
  return match.items
    .filter((i) => i.state !== "covered")
    .map((i) => {
      const ingredient = getIngredient(i.id);
      const name = ingredient.name.toLowerCase();
      return i.state === "partial" ? `${name} (${formatAmount(i.missingAmount, ingredient)} more)` : name;
    })
    .join(", ");
}

/** "€1.85 to finish at Jumbo" (section 11.9: numbers over adjectives). */
function costText(completion: Completion, everything: boolean): string {
  const shops = new Set(completion.items.map((i) => i.storeId)).size;
  const where = completion.storeId ? `at ${storeName(completion.storeId)}` : `across ${shops} shops`;
  const what = everything ? "to buy everything" : "to finish";
  const unpriced = completion.unpriced.length
    ? ` · No price yet for ${completion.unpriced.map((id) => getIngredient(id).name.toLowerCase()).join(", ")}`
    : "";
  return `${formatEUR(completion.cents)} ${what} ${where}${unpriced}`;
}

interface Props {
  recipe: Recipe;
  /** Null on the "Popular recipes" list, before anything is in the fridge. */
  match: RecipeMatch | null;
  completion: Completion;
}

/** Text-first recipe card (section 11.7: no photo is better than a fake one). */
export function RecipeCard({ recipe, match, completion }: Props) {
  const diet = recipe.dietTags.includes("vegan") ? DIET_LABEL.vegan : recipe.dietTags.includes("vegetarian") ? DIET_LABEL.vegetarian : null;
  const titleId = `recipe-${recipe.id}`;
  const needsShopping = !match || match.missingCount > 0;

  return (
    <article aria-labelledby={titleId} className="rounded-card border border-line bg-surface p-4">
      {match && (
        <p className={`mb-1 flex items-center gap-2 text-secondary font-semibold ${STATUS_TEXT_CLASS[match.status]}`}>
          <StatusMark status={match.status} />
          {match.missingCount === 0 ? "Ready to cook" : `Missing ${match.missingCount}`}
        </p>
      )}
      <h3 id={titleId} className="font-serif text-xl leading-snug">
        {recipe.title}
      </h3>
      <p className="mt-1 text-secondary text-ink-muted">
        {match ? `You have ${match.haveCount} of ${match.items.length}` : recipe.summary}
        {" · "}
        <span className="font-mono whitespace-nowrap">{recipe.minutes} min</span>
        {diet && ` · ${diet}`}
      </p>

      {match && (
        // Thin coverage bar: how much of the recipe is already in the fridge.
        <div aria-hidden="true" className="mt-3 h-1 overflow-hidden rounded-full bg-sunken">
          <div
            className={`h-full bg-current transition-[width] duration-200 ease-out ${STATUS_TEXT_CLASS[match.status]}`}
            style={{ width: `${(match.haveCount / Math.max(1, match.items.length)) * 100}%` }}
          />
        </div>
      )}
      {match && match.missingCount > 0 && <p className="mt-2 text-secondary">Need: {missingText(match)}</p>}
      {needsShopping && <p className="mt-1 font-mono text-secondary">{costText(completion, !match)}</p>}

      <Link
        href={`/recipes/${recipe.id}`}
        aria-describedby={titleId}
        className="mt-3 inline-flex min-h-11 items-center rounded-control border-2 border-accent px-4 font-semibold text-accent hover:bg-accent-soft"
      >
        Start prepping
      </Link>
    </article>
  );
}
