import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { RecipeIngredients } from "@/components/recipes/RecipeIngredients";
import { getRecipe, RECIPES } from "@/lib/data";

export function generateStaticParams() {
  return RECIPES.map((r) => ({ id: r.id }));
}

export async function generateMetadata(props: PageProps<"/recipes/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  return { title: `${getRecipe(id)?.title ?? "Recipe"} · Cooly` };
}

export default function RecipePage(props: PageProps<"/recipes/[id]">) {
  return (
    <main id="main" className="px-5 pt-4">
      <Link href="/recipes" className="-ml-2 inline-flex min-h-11 items-center gap-2 rounded-control px-2 font-semibold text-accent">
        <ArrowLeft size={20} aria-hidden="true" />
        Recipes
      </Link>
      {/* The back link shows at once; the recipe streams in behind this boundary (Next.js instant navigation). */}
      <Suspense fallback={<div aria-busy="true" className="min-h-screen" />}>
        <Recipe params={props.params} />
      </Suspense>
    </main>
  );
}

async function Recipe({ params }: { params: PageProps<"/recipes/[id]">["params"] }) {
  const { id } = await params;
  const recipe = getRecipe(id);
  if (!recipe) notFound();

  return (
    <>
      <h1 className="mt-2 font-serif text-recipe">{recipe.title}</h1>
      <p className="mt-2 text-ink-muted">
        <span className="font-mono">{recipe.minutes} min</span> · {recipe.servings} servings · {recipe.cuisine}
      </p>
      <p className="mt-3">{recipe.summary}</p>

      <RecipeIngredients recipe={recipe} />

      <section aria-labelledby="steps-title" className="mt-8">
        <h2 id="steps-title" className="text-lg font-bold">
          Steps
        </h2>
        <ol className="mt-3 flex flex-col gap-4">
          {recipe.steps.map((step, i) => (
            <li key={i} className="grid grid-cols-[2rem_1fr] gap-3">
              <span aria-hidden="true" className="font-mono font-semibold text-ink-muted">
                {i + 1}.
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-10 border-t border-line pt-4 text-secondary text-ink-muted">
        Cooly is a helper, not a safety tool. Always check food labels; recipe matches are not a medical guarantee for
        allergies.
      </p>
    </>
  );
}
