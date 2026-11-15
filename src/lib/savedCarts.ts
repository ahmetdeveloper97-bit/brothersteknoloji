import { supabase } from "@/lib/supabase";
import type { CartLine } from "@/types/store";
import type { SavedCartRow } from "@/types/savedCart";

const MAX_SAVED_CARTS = 10;

export const savedCartName = (date = new Date()): string =>
  `Sepet · ${date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}`;

interface SaveCartInput {
  userId: string;
  lines: CartLine[];
  itemCount: number;
  total: number;
}

/** Sepeti giriş yapmış müşterinin hesabına kaydeder. */
export async function saveCartToAccount({ userId, lines, itemCount, total }: SaveCartInput): Promise<void> {
  const { error } = await supabase.from("saved_carts").insert({
    user_id: userId,
    name: savedCartName(),
    items: lines,
    item_count: itemCount,
    total,
  });
  if (error) throw error;

  // Aynı hesapta biriken sepetleri sınırlı tut.
  const { data: existing } = await supabase
    .from("saved_carts")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (Array.isArray(existing) && existing.length > MAX_SAVED_CARTS) {
    const overflow = existing.slice(MAX_SAVED_CARTS).map((row) => row.id);
    if (overflow.length > 0) {
      await supabase.from("saved_carts").delete().in("id", overflow).eq("user_id", userId);
    }
  }
}

export async function listSavedCarts(userId: string): Promise<SavedCartRow[]> {
  const { data, error } = await supabase
    .from("saved_carts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as SavedCartRow[];
}

export async function deleteSavedCart(id: string, userId: string): Promise<void> {
  const { error } = await supabase.from("saved_carts").delete().eq("id", id).eq("user_id", userId);
  if (error) throw error;
}