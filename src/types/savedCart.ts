import type { CartLine } from "@/types/store";

export interface SavedCartRow {
  id: string;
  user_id: string;
  name: string;
  items: CartLine[];
  item_count: number;
  total: number;
  created_at: string;
}