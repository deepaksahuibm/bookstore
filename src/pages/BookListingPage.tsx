import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Book, BookFilters, SortOption } from '../types';
import { BookService } from '../services/bookService';
import { BookGrid } from '../components/books/BookGrid';
import { CategoryFilter } from '../components/books/CategoryFilter';
import { SortControl } from '../components/books/SortControl';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../components/common/Button';

export const BookListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<string[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Derive initial filter state from URL
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = (searchParams.get('sort') as SortOption) || 'featured';

  const [filters, setFilters] = useState<BookFilters>({
    searchQuery: initialSearch,
    category: initialCategory,
    minPrice: 0,
    maxPrice: 60,
    minRating: 0,
    inStockOnly: false,
    sortBy: initialSort,
  });

  // Sync state if URL query params change externally
  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'All';
    const urlSearch = searchParams.get('search') || '';
    const urlSort = (searchParams.get('sort') as SortOption) || 'featured';

    setFilters((prev) => ({
      ...prev,
      category: urlCategory,
      searchQuery: urlSearch,
      sortBy: urlSort,
    }));
  }, [searchParams]);

  // Load category list on mount
  useEffect(() => {
    async function loadCategories() {
      const cats = await BookService.getCategories();
      setCategories(cats);
    }
    loadCategories();
  }, []);

  // Fetch filtered books whenever filters change
  const fetchFilteredBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await BookService.queryBooks(filters);
      setBooks(result.books);
    } catch (err) {
      console.error('Failed to query books', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchFilteredBooks();
  }, [fetchFilteredBooks]);

  // Synchronize internal filter state changes to URL
  const updateFiltersAndUrl = (newFilters: BookFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.category && newFilters.category !== 'All') {
      params.set('category', newFilters.category);
    }
    if (newFilters.searchQuery.trim()) {
      params.set('search', newFilters.searchQuery.trim());
    }
    if (newFilters.sortBy !== 'featured') {
      params.set('sort', newFilters.sortBy);
    }
    setSearchParams(params, { replace: true });
  };

  const handleResetFilters = () => {
    const resetState: BookFilters = {
      searchQuery: '',
      category: 'All',
      minPrice: 0,
      maxPrice: 60,
      minRating: 0,
      inStockOnly: false,
      sortBy: 'featured',
    };
    updateFiltersAndUrl(resetState);
  };

  const activePillCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'All') count++;
    if (filters.maxPrice < 60) count++;
    if (filters.minRating > 0) count++;
    if (filters.inStockOnly) count++;
    if (filters.searchQuery) count++;
    return count;
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Banner & Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
            Book Catalogue
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Explore our curated collection of bestselling software architecture, speculative fiction, and essential literature.
          </p>
        </div>

        {/* Global In-Page Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <div className="flex-1 max-w-md">
            <SearchBar
              initialValue={filters.searchQuery}
              onSearch={(q) => updateFiltersAndUrl({ ...filters, searchQuery: q })}
              placeholder="Filter by title, author, or keyword..."
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Mobile Filter Trigger Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="lg:hidden flex items-center gap-2"
              onClick={() => setIsMobileFilterOpen(true)}
              aria-label="Open filter options dialog"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activePillCount > 0 && (
                <span className="bg-brand-600 text-white rounded-full px-1.5 py-0.2 text-[10px] font-bold">
                  {activePillCount}
                </span>
              )}
            </Button>

            {/* Sort Dropdown */}
            <SortControl
              value={filters.sortBy}
              onChange={(sort) => updateFiltersAndUrl({ ...filters, sortBy: sort })}
            />
          </div>
        </div>

        {/* Active Filter Chips */}
        {activePillCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-gray-500">Active filters:</span>
            {filters.category !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs px-2.5 py-1 rounded-full font-medium border border-brand-200">
                Category: {filters.category}
                <button
                  type="button"
                  onClick={() => updateFiltersAndUrl({ ...filters, category: 'All' })}
                  className="hover:text-brand-900 ml-1"
                  aria-label={`Remove category filter ${filters.category}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs px-2.5 py-1 rounded-full font-medium border border-brand-200">
                Keyword: "{filters.searchQuery}"
                <button
                  type="button"
                  onClick={() => updateFiltersAndUrl({ ...filters, searchQuery: '' })}
                  className="hover:text-brand-900 ml-1"
                  aria-label="Remove search keyword filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.maxPrice < 60 && (
              <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs px-2.5 py-1 rounded-full font-medium border border-brand-200">
                Max Price: ${filters.maxPrice}
                <button
                  type="button"
                  onClick={() => updateFiltersAndUrl({ ...filters, maxPrice: 60 })}
                  className="hover:text-brand-900 ml-1"
                  aria-label="Remove price filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.minRating > 0 && (
              <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs px-2.5 py-1 rounded-full font-medium border border-brand-200">
                Rating: {filters.minRating}★+
                <button
                  type="button"
                  onClick={() => updateFiltersAndUrl({ ...filters, minRating: 0 })}
                  className="hover:text-brand-900 ml-1"
                  aria-label="Remove rating filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.inStockOnly && (
              <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs px-2.5 py-1 rounded-full font-medium border border-brand-200">
                In Stock Only
                <button
                  type="button"
                  onClick={() => updateFiltersAndUrl({ ...filters, inStockOnly: false })}
                  className="hover:text-brand-900 ml-1"
                  aria-label="Remove in stock filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-brand-600 hover:text-brand-800 underline font-medium ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout (Desktop Sidebar + Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filter */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <CategoryFilter
            categories={categories}
            filters={filters}
            onChange={updateFiltersAndUrl}
            onReset={handleResetFilters}
            totalResults={books.length}
          />
        </div>

        {/* Books Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing <strong className="text-gray-900">{books.length}</strong> books
            </span>
          </div>

          <BookGrid
            books={books}
            isLoading={isLoading}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

      {/* Mobile Filters Modal Dialog */}
      <Modal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Filter & Refine Books"
      >
        <CategoryFilter
          categories={categories}
          filters={filters}
          onChange={(newFilters) => {
            updateFiltersAndUrl(newFilters);
          }}
          onReset={() => {
            handleResetFilters();
            setIsMobileFilterOpen(false);
          }}
          totalResults={books.length}
        />
        <div className="mt-6">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            Show {books.length} Results
          </Button>
        </div>
      </Modal>

    </div>
  );
};
