import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { BookCard } from '../components/books/BookCard';
import { CartProvider } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';
import { Book } from '../types';

const sampleBook: Book = {
  id: 'b-test',
  title: 'Clean Architecture in Practice',
  author: 'Robert Martin',
  description: 'A comprehensive study of software design and boundaries.',
  category: 'Technology',
  price: 34.99,
  rating: 4.8,
  coverImage: 'https://example.com/cover.jpg',
  stock: 5,
  bestseller: true,
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>{ui}</CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('BookCard Component', () => {
  it('renders book metadata correctly', () => {
    renderWithProviders(<BookCard book={sampleBook} />);

    expect(screen.getByText('Clean Architecture in Practice')).toBeInTheDocument();
    expect(screen.getByText(/Robert Martin/)).toBeInTheDocument();
    expect(screen.getByText('$34.99')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Bestseller')).toBeInTheDocument();
  });

  it('allows adding to cart via button click and triggers toast notification', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookCard book={sampleBook} />);

    const addButton = screen.getByRole('button', { name: /Add Clean Architecture in Practice to cart/i });
    expect(addButton).toBeInTheDocument();

    await user.click(addButton);

    // After click, button state should update to "In Cart (1)"
    expect(screen.getByText(/In Cart \(1\)/i)).toBeInTheDocument();
    // Toast notification should be visible in document
    expect(screen.getByText(/Added "Clean Architecture in Practice" to your cart./i)).toBeInTheDocument();
  });

  it('disables add button when book is out of stock', () => {
    const outOfStockBook: Book = {
      ...sampleBook,
      stock: 0,
    };

    renderWithProviders(<BookCard book={outOfStockBook} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /out of stock/i });
    expect(button).toBeDisabled();
  });
});
