import type { Metadata } from "next";
import { NotBuiltYet } from "@/components/ui/NotBuiltYet";

export const metadata: Metadata = { title: "Shopping list · Cooly" };

export default function ShoppingListPage() {
  return <NotBuiltYet title="Shopping list" plan="It needs the supermarket prices the team is collecting." />;
}
