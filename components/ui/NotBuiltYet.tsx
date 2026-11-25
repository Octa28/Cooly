import Link from "next/link";

/** Honest placeholder for tabs that exist in the navigation but aren't built yet. */
export function NotBuiltYet({ title, plan }: { title: string; plan: string }) {
  return (
    <main id="main" className="px-5 pt-8">
      <h1 className="font-serif text-title">{title}</h1>
      <p className="mt-3">This screen isn&apos;t built yet. {plan}</p>
      <Link
        href="/recipes"
        className="mt-6 inline-flex min-h-12 items-center rounded-control bg-accent px-5 font-semibold text-on-accent"
      >
        Go to recipes
      </Link>
    </main>
  );
}
