import type { Metadata } from "next";
import { RecipesScreen } from "@/components/recipes/RecipesScreen";

export const metadata: Metadata = { title: "Recipes · Cooly" };

export default function RecipesPage() {
  return (
    <main id="main" className="px-5 pt-8">
      <h1 className="font-serif text-title">What can I cook?</h1>
      <p className="mt-1 text-ink-muted">Add what&apos;s in your fridge.</p>
      <RecipesScreen />
    </main>
  );
}
