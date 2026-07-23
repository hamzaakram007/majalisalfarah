"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { buildCartLineKey } from "@/lib/products/types";
import type { CartItem } from "@/lib/cart/types";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "lineKey">, qty?: number) => void;
  buyNow: (item: Omit<CartItem, "quantity" | "lineKey">, qty?: number) => void;
  removeItem: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "maf_cart_v2";

function normalizeItem(item: CartItem): CartItem {
  const lineKey =
    item.lineKey ??
    buildCartLineKey({
      productId: item.productId,
      variantId: item.variantId,
      options: item.options,
    });
  return { ...item, lineKey };
}

function readStoredCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return parsed.map(normalizeItem);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setItems(readStoredCart());
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [hydrated, items]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity" | "lineKey">, qty = 1) => {
      const lineKey = buildCartLineKey({
        productId: item.productId,
        variantId: item.variantId,
        options: item.options,
      });
      setItems((prev) => {
        const existing = prev.find((i) => i.lineKey === lineKey);
        if (existing) {
          return prev.map((i) =>
            i.lineKey === lineKey
              ? { ...i, quantity: i.quantity + qty }
              : i,
          );
        }
        return [...prev, { ...item, lineKey, quantity: qty }];
      });
    },
    [],
  );

  const buyNow = useCallback(
    (item: Omit<CartItem, "quantity" | "lineKey">, qty = 1) => {
      const lineKey = buildCartLineKey({
        productId: item.productId,
        variantId: item.variantId,
        options: item.options,
      });
      setItems([{ ...item, lineKey, quantity: qty }]);
    },
    [],
  );

  const removeItem = useCallback((lineKey: string) => {
    setItems((prev) => prev.filter((i) => i.lineKey !== lineKey));
  }, []);

  const updateQuantity = useCallback((lineKey: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.lineKey !== lineKey));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.lineKey === lineKey ? { ...i, quantity } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.priceSar * i.quantity, 0),
    [items],
  );
  const count = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      buyNow,
      removeItem,
      updateQuantity,
      clear,
      subtotal,
      count,
    }),
    [items, addItem, buyNow, removeItem, updateQuantity, clear, subtotal, count],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
