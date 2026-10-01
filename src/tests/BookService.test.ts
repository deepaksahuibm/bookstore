import { describe, it, expect } from 'vitest';
import { BookService } from '../services/bookService';
import { mockBooks } from '../data/mockBooks';

describe('BookService', () => {
  it('should retrieve all books with at least 20 items', async () => {
    const books = await BookService.getAllBooks();
    expect(books.length).toBeGreaterThanOrEqual(20);
    expect(books.length).toBe(mockBooks.length);
  });

  it('should retrieve book by ID', async () => {
    const book = await BookService.getBookById('book-1');
    expect(book).toBeDefined();
    expect(book?.title).toBe('Designing Data-Intensive Applications');
  });

  it('should return null for non-existent book ID', async () => {
    const book = await BookService.getBookById('non-existent-id');
    expect(book).toBeNull();
  });

  it('should filter books by category', async () => {
    const { books } = await BookService.queryBooks({ category: 'Sci-Fi' });
    expect(books.length).toBeGreaterThan(0);
    books.forEach((b) => expect(b.category).toBe('Sci-Fi'));
  });

  it('should search books by query term', async () => {
    const { books } = await BookService.queryBooks({ searchQuery: 'Clean Code' });
    expect(books.length).toBeGreaterThan(0);
    expect(books.some((b) => b.title.includes('Clean Code'))).toBe(true);
  });

  it('should filter books by maximum price', async () => {
    const maxPrice = 20;
    const { books } = await BookService.queryBooks({ maxPrice });
    books.forEach((b) => expect(b.price).toBeLessThanOrEqual(maxPrice));
  });

  it('should filter in-stock items only', async () => {
    const { books } = await BookService.queryBooks({ inStockOnly: true });
    books.forEach((b) => expect(b.stock).toBeGreaterThan(0));
  });

  it('should sort books by price ascending and descending', () => {
    const sample = [
      { id: '1', title: 'A', price: 30, rating: 4, stock: 5, author: 'X', description: '', category: '', coverImage: '' },
      { id: '2', title: 'B', price: 10, rating: 5, stock: 5, author: 'Y', description: '', category: '', coverImage: '' },
      { id: '3', title: 'C', price: 20, rating: 3, stock: 5, author: 'Z', description: '', category: '', coverImage: '' },
    ];

    const asc = BookService.sortBooks(sample, 'price-asc');
    expect(asc[0].price).toBe(10);
    expect(asc[2].price).toBe(30);

    const desc = BookService.sortBooks(sample, 'price-desc');
    expect(desc[0].price).toBe(30);
    expect(desc[2].price).toBe(10);
  });
});
