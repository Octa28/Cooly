"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Basket, Carrot, CookingPot, Gear } from "@phosphor-icons/react";

// Section 1.4: four global tabs, hidden during onboarding.
const TABS = [
  { href: "/fridge", label: "Fridge", Icon: Carrot },
  { href: "/recipes", label: "Recipes", Icon: CookingPot },
  { href: "/shopping-list", label: "Shopping list", Icon: Basket },
  { href: "/settings", label: "Settings", Icon: Gear },
] as const;

export function TabBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/onboarding")) return null;

  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface">
      <ul className="mx-auto flex max-w-xl pb-[env(safe-area-inset-bottom)]">
        {TABS.map(({ href, label, Icon }) => {
          const current = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={current ? "page" : undefined}
                className={`relative flex min-h-16 flex-col items-center justify-center gap-1 text-label ${
                  current ? "font-semibold text-accent" : "text-ink-muted"
                }`}
              >
                {/* A bar as well as colour, so the current tab never relies on colour alone. */}
                {current && <span aria-hidden="true" className="absolute inset-x-6 top-0 h-[3px] rounded-b bg-accent" />}
                <Icon size={24} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
