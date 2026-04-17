import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, qty = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.product._id === product._id);
        if (existing) {
          set({ items: items.map((i) => i.product._id === product._id ? { ...i, qty: i.qty + qty } : i) });
        } else {
          set({ items: [...items, { product, qty }] });
        }
      },
      removeItem: (productId) => set({ items: get().items.filter((i) => i.product._id !== productId) }),
      updateQty: (productId, qty) => {
        if (qty < 1) return get().removeItem(productId);
        set({ items: get().items.map((i) => i.product._id === productId ? { ...i, qty } : i) });
      },
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.product.price * i.qty, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'cart-store' }
  )
);
