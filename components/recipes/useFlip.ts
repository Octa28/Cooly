"use client";

import { type RefObject, useLayoutEffect, useRef } from "react";

/**
 * When the list order changes, slide each `[data-flip="<id>"]` element from where it was to
 * where it is now (FLIP), so people can follow a recipe moving between lists. 200 ms ease-out
 * (CLAUDE.md 11.8); skipped with reduced motion. New elements fade in over the same time.
 */
export function useFlip(container: RefObject<HTMLElement | null>, orderKey: string) {
  const previous = useRef<Map<string, { x: number; y: number }> | null>(null);

  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = new Map<string, { x: number; y: number }>();

    for (const node of root.querySelectorAll<HTMLElement>("[data-flip]")) {
      const rect = node.getBoundingClientRect();
      // Page coordinates, so scrolling between renders doesn't count as movement.
      const pos = { x: rect.left + window.scrollX, y: rect.top + window.scrollY };
      next.set(node.dataset.flip!, pos);
      if (reduce || !previous.current) continue;

      const before = previous.current.get(node.dataset.flip!);
      const options = { duration: 200, easing: "ease-out" };
      if (!before) {
        node.animate([{ opacity: 0 }, { opacity: 1 }], options);
      } else if (Math.abs(before.x - pos.x) > 1 || Math.abs(before.y - pos.y) > 1) {
        node.animate([{ transform: `translate(${before.x - pos.x}px, ${before.y - pos.y}px)` }, { transform: "none" }], options);
      }
    }
    // Until the list first has content (before hydration it's empty) there's nothing to animate from,
    // so the first real render appears without motion.
    if (next.size > 0) previous.current = next;
  }, [container, orderKey]);
}
