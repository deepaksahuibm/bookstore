import { mockBooks, mockCategories } from '../data/mockBooks';
import { Book, BookFilters, SortOption } from '../types';

export class BookService {
  /**
   * Simulates async data fetch with network latency (50-150ms)
   */
  private static async delay(ms: number = 80): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Retrieve all books
   */
  public static async getAllBooks(): Promise<Book[]> {
    await this.delay();
    return [...mockBooks];
  }

  /**
   * Retrieve a single book by ID
   */
  public static async getBookById(id: string): Promise<Book | null> {
    await this.delay();
    const book = mockBooks.find((b) => b.id === id);
    return book ? { ...book } : null;
  }

  /**
   * Retrieve featured books (for hero & featured showcase)
   */
  public static async getFeaturedBooks(): Promise<Book[]> {
    await this.delay();
    return mockBooks.filter((b) => b.featured);
  }

  /**
   * Retrieve bestsellers
   */
  public static async getBestsellers(): Promise<Book[]> {
    await this.delay();
    return mockBooks.filter((b) => b.bestseller);
  }

  /**
   * Retrieve related books (same category, excluding current book)
   */
  public static async getRelatedBooks(category: string, currentBookId: string, limit = 4): Promise<Book[]> {
    await this.delay();
    return mockBooks
      .filter((b) => b.category === category && b.id !== currentBookId)
      .slice(0, limit);
  }

  /**
   * Retrieve available categories
   */
  public static async getCategories(): Promise<string[]> {
    return [...mockCategories];
  }

  /**
   * Filter and sort books according to complex multi-criteria filters
   */
  public static async queryBooks(filters: Partial<BookFilters>): Promise<{ books: Book[]; total: number }> {
    await this.delay(100);
    let result = [...mockBooks];

    // Search query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          (b.isbn && b.isbn.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'All') {
      result = result.filter(
        (b) => b.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    // Min price
    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      result = result.filter((b) => b.price >= filters.minPrice!);
    }

    // Max price
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      result = result.filter((b) => b.price <= filters.maxPrice!);
    }

    // Min rating
    if (filters.minRating !== undefined && filters.minRating > 0) {
      result = result.filter((b) => b.rating >= filters.minRating!);
    }

    // In stock only
    if (filters.inStockOnly) {
      result = result.filter((b) => b.stock > 0);
    }

    // Sorting
    result = this.sortBooks(result, filters.sortBy || 'featured');

    return {
      books: result,
      total: result.length,
    };
  }

  /**
   * Sort helper
   */
  public static sortBooks(books: Book[], sortBy: SortOption): Book[] {
    const list = [...books];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return list.sort((a, b) => b.rating - a.rating);
      case 'title-asc':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return list.sort((a, b) => b.title.localeCompare(a.title));
      case 'featured':
      default:
        return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }
}
