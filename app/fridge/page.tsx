import type { Metadata } from "next";
import { NotBuiltYet } from "@/components/ui/NotBuiltYet";

export const metadata: Metadata = { title: "My fridge · Cooly" };

export default function FridgePage() {
  return <NotBuiltYet title="My fridge" plan="For now, add what you have with the search on the Recipes screen." />;
}
