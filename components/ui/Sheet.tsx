"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";
import type { ReactElement, ReactNode } from "react";

interface Props {
  /** The button that opens the sheet; focus goes back to it when the sheet closes. */
  trigger: ReactElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** Sticky actions at the bottom, e.g. Reset and "Show 12 recipes". */
  footer?: ReactNode;
}

/**
 * Bottom sheet (CLAUDE.md section 10, screen 10). Radix Dialog gives the dialog semantics:
 * focus is trapped while open and returns to the button that opened it; Esc and a tap outside close it.
 */
export function Sheet({ trigger, open, onOpenChange, title, description, children, footer }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 motion-safe:animate-[fade-in_180ms_ease-out]" />
        <Dialog.Content
          className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[85dvh] max-w-xl flex-col rounded-t-card bg-surface shadow-[0_-8px_32px_rgb(0_0_0/0.18)] motion-safe:animate-[sheet-in_180ms_ease-out]"
          // Without a description Radix warns; pass undefined explicitly when there is none.
          {...(description ? {} : { "aria-describedby": undefined })}
        >
          <div className="flex items-center justify-between gap-4 border-b border-line py-2 pr-2 pl-5">
            <Dialog.Title className="font-serif text-xl">{title}</Dialog.Title>
            <Dialog.Close className="grid size-11 place-items-center rounded-control text-ink-muted hover:bg-sunken hover:text-ink">
              <X size={22} aria-hidden="true" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>
          {description && <Dialog.Description className="px-5 pt-3 text-secondary text-ink-muted">{description}</Dialog.Description>}
          <div className="overflow-y-auto px-5 py-4">{children}</div>
          {footer && (
            <div className="flex gap-3 border-t border-line px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">{footer}</div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
