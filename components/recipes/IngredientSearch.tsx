"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { INGREDIENTS, RECIPES } from "@/lib/data";
import { formatAmount, normalise, plural } from "@/lib/format";
import type { Fridge, Ingredient } from "@/lib/types";

// Shown when the field is focused but empty (Nielsen #6 Recognition rather than recall).
const COMMON = ["egg", "pasta", "rice", "onion", "garlic", "canned-tomatoes", "potato", "cheese"];

const USAGE = new Map<string, number>();
for (const r of RECIPES) for (const item of r.ingredients) USAGE.set(item.id, (USAGE.get(item.id) ?? 0) + 1);

type Option =
  | { kind: "ingredient"; ingredient: Ingredient; alias: string | null }
  | { kind: "recipe"; id: string; title: string; minutes: number };

function score(ingredient: Ingredient, q: string): { score: number; alias: string | null } {
  let best = { score: 0, alias: null as string | null };
  [ingredient.name, ...ingredient.aliases].forEach((raw, k) => {
    const n = normalise(raw);
    let s = n.startsWith(q) ? 4 : n.split(/\s+/).some((w) => w.startsWith(q)) ? 3 : n.includes(q) ? 1 : 0;
    if (k > 0 && s) s -= 0.5; // the real name wins over an alias
    if (s > best.score) best = { score: s, alias: k > 0 ? raw : null };
  });
  return best;
}

function buildOptions(query: string, fridge: Fridge): { label: string; options: Option[] } {
  const q = normalise(query);
  if (!q) {
    return {
      label: "Common ingredients",
      options: COMMON.filter((id) => !(id in fridge)).map((id) => ({
        kind: "ingredient" as const,
        ingredient: INGREDIENTS.find((i) => i.id === id)!,
        alias: null,
      })),
    };
  }
  const ingredients = INGREDIENTS.filter((i) => !(i.id in fridge))
    .map((ingredient) => ({ ingredient, ...score(ingredient, q) }))
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        (USAGE.get(b.ingredient.id) ?? 0) - (USAGE.get(a.ingredient.id) ?? 0) ||
        a.ingredient.name.localeCompare(b.ingredient.name),
    )
    .slice(0, 6)
    .map(({ ingredient, alias }) => ({ kind: "ingredient" as const, ingredient, alias }));
  const recipes = RECIPES.filter((r) => normalise(r.title).includes(q))
    .slice(0, 3)
    .map((r) => ({ kind: "recipe" as const, id: r.id, title: r.title, minutes: r.minutes }));
  return { label: "Ingredients", options: [...ingredients, ...recipes] };
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = normalise(query);
  const i = q ? normalise(text).indexOf(q) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <strong className="font-bold underline underline-offset-2">{text.slice(i, i + q.length)}</strong>
      {text.slice(i + q.length)}
    </>
  );
}

interface Props {
  fridge: Fridge;
  onAdd: (ingredient: Ingredient) => void;
  onRemove: (ingredient: Ingredient) => void;
  onClear: () => void;
}

/** Search field that adds ingredients as chips. ARIA 1.2 combobox with a listbox popup. */
export function IngredientSearch({ fridge, onAdd, onRemove, onClear }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const { label, options } = useMemo(() => buildOptions(query, fridge), [query, fridge]);
  const items = Object.keys(fridge).map((id) => INGREDIENTS.find((i) => i.id === id)!);
  const ingredientOptions = options.filter((o) => o.kind === "ingredient");
  const recipeOptions = options.filter((o) => o.kind === "recipe");
  const showList = open && (options.length > 0 || query.trim() !== "");

  function changeQuery(value: string) {
    setQuery(value);
    setOpen(true);
    // While typing, the best match is pre-selected so Enter adds it straight away.
    setActive(value.trim() ? 0 : -1);
  }

  function choose(index: number) {
    const option = options[index];
    if (!option) return;
    if (option.kind === "ingredient") {
      onAdd(option.ingredient);
      setQuery("");
      setActive(-1);
      inputRef.current?.focus();
    } else {
      setOpen(false);
      router.push(`/recipes/${option.id}`);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setOpen(true);
        if (options.length) setActive((a) => (a + 1) % options.length);
        break;
      case "ArrowUp":
        if (!showList || !options.length) break;
        e.preventDefault();
        setActive((a) => (a <= 0 ? options.length - 1 : a - 1));
        break;
      case "Enter":
        if (showList && active >= 0) {
          e.preventDefault();
          choose(active);
        } else setOpen(false);
        break;
      case ",":
        if (query.trim()) {
          e.preventDefault();
          if (options[active]?.kind === "ingredient") choose(active);
        }
        break;
      case "Escape":
        if (showList) setOpen(false);
        else changeQuery("");
        break;
      case "Backspace":
        if (!query && items.length) onRemove(items[items.length - 1]);
        break;
    }
  }

  const option = (o: Option, index: number) => (
    // Options are never focused: the keyboard stays in the combobox input (onKeyDown), as the ARIA pattern asks.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <li
      key={o.kind === "ingredient" ? o.ingredient.id : `r-${o.id}`}
      id={`${listId}-${index}`}
      role="option"
      aria-selected={index === active}
      // Keep focus in the field when picking with a mouse or finger.
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => choose(index)}
      onPointerMove={() => setActive(index)}
      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-control px-3 ${
        index === active ? "bg-sunken outline-2 -outline-offset-2 outline-ink" : ""
      }`}
    >
      {o.kind === "ingredient" ? (
        <>
          <span>
            <Highlight text={o.ingredient.name} query={query} />
            {o.alias && (
              <span className="text-ink-muted">
                {" "}
                (<Highlight text={o.alias} query={query} />)
              </span>
            )}
          </span>
          <span className="ml-auto text-secondary text-ink-muted">
            in {plural(USAGE.get(o.ingredient.id) ?? 0, "recipe", "recipes")}
          </span>
        </>
      ) : (
        <>
          <span>
            <Highlight text={o.title} query={query} />
          </span>
          <span className="ml-auto font-mono text-secondary text-ink-muted">{o.minutes} min</span>
        </>
      )}
    </li>
  );

  return (
    <div className="relative">
      {/* Mouse convenience only: tapping empty space in the bar focuses the field, which keyboard users reach directly. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="flex min-h-14 flex-wrap items-center gap-2 rounded-control border-2 border-border bg-surface py-1.5 pr-1.5 pl-3 focus-within:border-accent"
        onClick={(e) => {
          if (e.target === e.currentTarget) inputRef.current?.focus();
        }}
      >
        <MagnifyingGlass size={22} aria-hidden="true" className="shrink-0 text-ink-muted" />
        {items.length > 0 && (
          <ul aria-label="In your fridge" className="contents">
            {items.map((i) => (
              <li key={i.id} className="flex min-h-11 items-center rounded-full bg-sunken pl-3">
                <span>
                  {i.name}{" "}
                  <span className="font-mono text-secondary text-ink-muted">
                    {i.unit === "pcs" ? `×${fridge[i.id]}` : formatAmount(fridge[i.id], i)}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onRemove(i);
                    inputRef.current?.focus();
                  }}
                  aria-label={`Remove ${i.name.toLowerCase()}`}
                  className="grid size-11 place-items-center rounded-full hover:bg-line"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label="Add an ingredient you have"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="done"
          placeholder={items.length ? "Add more" : "Add an ingredient, e.g. eggs"}
          value={query}
          onChange={(e) => changeQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="min-h-11 min-w-0 flex-1 basis-40 bg-transparent outline-none placeholder:text-ink-muted"
        />
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => {
              onClear();
              inputRef.current?.focus();
            }}
            className="min-h-11 rounded-control px-3 text-secondary font-semibold text-ink-muted hover:text-ink"
          >
            Clear all
          </button>
        )}
      </div>

      <div
        id={listId}
        role="listbox"
        aria-label="Suggestions"
        hidden={!showList}
        className="absolute inset-x-0 top-full z-20 mt-2 max-h-[min(60vh,420px)] overflow-y-auto rounded-card border border-line bg-surface p-2 shadow-[0_8px_24px_rgb(0_0_0/0.12)]"
      >
        {ingredientOptions.length > 0 && (
          <ul role="group" aria-label={label}>
            <li role="presentation" className="px-3 pt-2 pb-1 text-label font-semibold tracking-wide text-ink-muted uppercase">
              {label}
            </li>
            {ingredientOptions.map((o) => option(o, options.indexOf(o)))}
          </ul>
        )}
        {recipeOptions.length > 0 && (
          <ul role="group" aria-label="Recipes">
            <li role="presentation" className="px-3 pt-3 pb-1 text-label font-semibold tracking-wide text-ink-muted uppercase">
              Recipes
            </li>
            {recipeOptions.map((o) => option(o, options.indexOf(o)))}
          </ul>
        )}
        {options.length === 0 && (
          <p className="px-3 py-3 text-ink-muted">No ingredient or recipe called “{query.trim()}”. Try another word.</p>
        )}
      </div>
    </div>
  );
}
