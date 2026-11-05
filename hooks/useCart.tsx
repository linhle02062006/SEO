"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, CartState } from "@/types";

const STORAGE_KEY = "techzone_cart_v1";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  hasItem: (id: number) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

/** Ngưỡng miễn phí vận chuyển */
export const FREE_SHIPPING_THRESHOLD = 300000;
export const STANDARD_SHIPPING_FEE = 30000;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate từ localStorage (chỉ client) -> tránh hydration mismatch
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        if (Array.isArray(parsed?.items)) setItems(parsed.items);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items } satisfies CartState),
      );
    } catch {
      // ignore quota errors
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  quantity: Math.min(i.quantity + qty, Math.max(1, i.stock)),
                }
              : i,
          );
        }
        return [
          ...prev,
          { ...item, quantity: Math.min(qty, Math.max(1, item.stock)) },
        ];
      });
      setIsOpen(true);
    },
    [],
  );

  const updateQuantity = useCallback((id: number, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.min(qty, Math.max(1, i.stock)) }
              : i,
          ),
    );
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, i) => {
        const unit =
          i.salePrice != null && i.salePrice < i.price ? i.salePrice : i.price;
        return sum + unit * i.quantity;
      }, 0),
    [items],
  );

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const shippingFee = useMemo(
    () =>
      subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : STANDARD_SHIPPING_FEE,
    [subtotal],
  );

  const discount = 0;

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      subtotal,
      discount,
      shippingFee,
      total: Math.max(0, subtotal + shippingFee - discount),
      isOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      hasItem: (id: number) => items.some((i) => i.id === id),
    }),
    [
      items,
      count,
      subtotal,
      discount,
      shippingFee,
      isOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải nằm trong <CartProvider>");
  return ctx;
}
