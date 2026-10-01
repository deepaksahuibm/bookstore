import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { Book, CartItem } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateShipping, calculateTax } from '../utils/formatters';

export interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book, quantity?: number) => boolean;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalItemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  getItemQuantity: (bookId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'novella_bookstore_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useLocalStorage<CartItem[]>(CART_STORAGE_KEY, []);

  // Filter out any corrupted entries that might have slipped into stored state
  const validatedItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter(
      (item) => item && item.book && typeof item.book.id === 'string' && typeof item.quantity === 'number' && item.quantity > 0
    );
  }, [items]);

  const addToCart = useCallback((book: Book, quantity: number = 1): boolean => {
    if (!book || book.stock <= 0 || quantity <= 0) return false;

    let wasAdded = false;

    setItems((prevItems) => {
      const safeItems = Array.isArray(prevItems) ? prevItems : [];
      const existingIndex = safeItems.findIndex((item) => item.book && item.book.id === book.id);

      if (existingIndex > -1) {
        const currentQty = safeItems[existingIndex].quantity;
        const availableToAdd = book.stock - currentQty;
        if (availableToAdd <= 0) {
          // Already at maximum stock in cart
          return safeItems;
        }
        const addedQty = Math.min(quantity, availableToAdd);
        const next = [...safeItems];
        next[existingIndex] = { ...next[existingIndex], quantity: currentQty + addedQty };
        wasAdded = true;
        return next;
      } else {
        const addedQty = Math.min(quantity, book.stock);
        wasAdded = true;
        return [...safeItems, { book, quantity: addedQty }];
      }
    });

    return wasAdded;
  }, [setItems]);

  const removeFromCart = useCallback((bookId: string) => {
    setItems((prevItems) => {
      const safeItems = Array.isArray(prevItems) ? prevItems : [];
      return safeItems.filter((item) => item.book && item.book.id !== bookId);
    });
  }, [setItems]);

  const updateQuantity = useCallback((bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setItems((prevItems) => {
      const safeItems = Array.isArray(prevItems) ? prevItems : [];
      return safeItems.map((item) => {
        if (item.book && item.book.id === bookId) {
          const clampedQty = Math.min(Math.max(1, quantity), item.book.stock || 1);
          return { ...item, quantity: clampedQty };
        }
        return item;
      });
    });
  }, [removeFromCart, setItems]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const getItemQuantity = useCallback((bookId: string): number => {
    const item = validatedItems.find((i) => i.book && i.book.id === bookId);
    return item ? item.quantity : 0;
  }, [validatedItems]);

  const totalItemCount = useMemo(() => {
    return validatedItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [validatedItems]);

  const subtotal = useMemo(() => {
    const sum = validatedItems.reduce((acc, item) => acc + (item.book.price || 0) * item.quantity, 0);
    return Number(sum.toFixed(2));
  }, [validatedItems]);

  const shipping = useMemo(() => {
    return calculateShipping(subtotal);
  }, [subtotal]);

  const tax = useMemo(() => {
    return calculateTax(subtotal);
  }, [subtotal]);

  const total = useMemo(() => {
    return Number((subtotal + shipping + tax).toFixed(2));
  }, [subtotal, shipping, tax]);

  const value: CartContextType = {
    items: validatedItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItemCount,
    subtotal,
    shipping,
    tax,
    total,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
