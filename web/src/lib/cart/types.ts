import type { SelectedProductOptions } from "@/lib/products/types";

export type CartItem = {
  lineKey: string;
  productId: string;
  variantId?: string | null;
  options?: SelectedProductOptions;
  slug: string;
  name: string;
  priceSar: number;
  quantity: number;
  imageUrl?: string | null;
  optionSummary?: string;
};

export type CartState = {
  items: CartItem[];
};
