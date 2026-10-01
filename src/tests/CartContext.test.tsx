import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { CartProvider, useCart } from '../context/CartContext';
import { Book } from '../types';

const mockBook1: Book = {
  id: 'b1',
  title: 'Test Book 1',
  author: 'Author 1',
  description: 'Desc 1',
  category: 'Tech',
  price: 25.0,
  rating: 4.5,
  coverImage: 'image1.jpg',
  stock: 10,
};

const mockBook2: Book = {
  id: 'b2',
  title: 'Test Book 2',
  author: 'Author 2',
  description: 'Desc 2',
  category: 'Fiction',
  price: 30.0,
  rating: 4.8,
  coverImage: 'image2.jpg',
  stock: 2,
};

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext & Resilience', () => {
  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it('should add item to cart and return true', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    let added = false;
    act(() => {
      added = result.current.addToCart(mockBook1, 1);
    });

    expect(added).toBe(true);
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].book.id).toBe('b1');
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.subtotal).toBe(25.0);
    expect(result.current.totalItemCount).toBe(1);
  });

  it('should not add out-of-stock item and return false', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const outOfStockBook: Book = { ...mockBook1, stock: 0 };

    let added = true;
    act(() => {
      added = result.current.addToCart(outOfStockBook, 1);
    });

    expect(added).toBe(false);
    expect(result.current.items.length).toBe(0);
  });

  it('should not exceed book stock limit and refuse further additions once capped', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockBook2, 2); // Cap at max stock = 2
    });

    expect(result.current.items[0].quantity).toBe(2);

    let secondAttempt = true;
    act(() => {
      secondAttempt = result.current.addToCart(mockBook2, 1);
    });

    expect(secondAttempt).toBe(false);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('should update quantity and remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockBook1, 2);
    });
    expect(result.current.items[0].quantity).toBe(2);

    act(() => {
      result.current.updateQuantity('b1', 1);
    });
    expect(result.current.items[0].quantity).toBe(1);

    act(() => {
      result.current.updateQuantity('b1', 0);
    });
    expect(result.current.items.length).toBe(0);
  });

  it('should calculate shipping and tax properly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockBook1, 1); // $25 subtotal (< $50)
    });

    expect(result.current.subtotal).toBe(25.0);
    expect(result.current.shipping).toBe(4.99); // standard shipping under $50
    expect(result.current.tax).toBe(2.0); // 8% of 25 = 2.0
    expect(result.current.total).toBe(31.99);

    // Now push subtotal over $50 for free shipping
    act(() => {
      result.current.addToCart(mockBook1, 2); // 3 * 25 = 75
    });

    expect(result.current.subtotal).toBe(75.0);
    expect(result.current.shipping).toBe(0); // free shipping
    expect(result.current.tax).toBe(6.0); // 8% of 75 = 6.0
    expect(result.current.total).toBe(81.0);
  });

  it('should handle corrupted localStorage data without crashing', () => {
    // Inject corrupt JSON into storage
    localStorage.setItem('novella_bookstore_cart_v1', '{"invalid": "corrupt_data}');

    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.subtotal).toBe(0);
  });

  it('should clear cart cleanly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockBook1, 2);
    });
    expect(result.current.items.length).toBe(1);

    act(() => {
      result.current.clearCart();
    });
    expect(result.current.items.length).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });
});
