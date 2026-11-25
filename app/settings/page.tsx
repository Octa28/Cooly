import type { Metadata } from "next";
import { NotBuiltYet } from "@/components/ui/NotBuiltYet";

export const metadata: Metadata = { title: "Settings · Cooly" };

export default function SettingsPage() {
  return <NotBuiltYet title="Settings" plan="Until then, Cooly follows your phone's light or dark setting." />;
}
