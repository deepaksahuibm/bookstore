import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Book } from '../../types';
import { BookService } from '../../services/bookService';
import { formatCurrency } from '../../utils/formatters';

export interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
  autoNavigate?: boolean;
  showLivePreview?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search by title, author, or keyword...',
  initialValue = '',
  onSearch,
  className = '',
  autoNavigate = false,
  showLivePreview = false,
}) => {
  const [query, setQuery] = useState(initialValue);
  const [liveSuggestions, setLiveSuggestions] = useState<Book[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Keep internal state in sync with external initialValue if supplied
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Debounced live suggestion fetching if enabled
  useEffect(() => {
    if (!showLivePreview || query.trim().length < 2) {
      setLiveSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const result = await BookService.queryBooks({ searchQuery: query.trim() });
        setLiveSuggestions(result.books.slice(0, 4));
        setIsDropdownOpen(true);
      } catch (err) {
        console.error('Error fetching live search preview', err);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query, showLivePreview]);

  // Click outside listener to dismiss preview
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    setIsDropdownOpen(false);
    if (onSearch) {
      onSearch(trimmed);
    }
    if (autoNavigate) {
      navigate(trimmed ? `/books?search=${encodeURIComponent(trimmed)}` : '/books');
    }
  };

  const handleClear = () => {
    setQuery('');
    setLiveSuggestions([]);
    setIsDropdownOpen(false);
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center w-full" role="search">
        <label htmlFor="search-input" className="sr-only">
          Search bookstore catalogue
        </label>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            if (onSearch && !autoNavigate) {
              onSearch(val);
            }
          }}
          onFocus={() => {
            if (showLivePreview && liveSuggestions.length > 0) {
              setIsDropdownOpen(true);
            }
          }}
          placeholder={placeholder}
          aria-label="Search bookstore catalogue"
          autoComplete="off"
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 hover:bg-gray-100/90 focus:bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 focus:border-brand-500 rounded-full transition-all focus:ring-2 focus:ring-brand-500/20 focus:outline-none shadow-sm"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Live Search Quick Suggestion Popover */}
      {showLivePreview && isDropdownOpen && liveSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="p-2 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 flex justify-between items-center">
            <span>Instant Matches</span>
            <span>{liveSuggestions.length} items</span>
          </div>

          <div className="divide-y divide-gray-50">
            {liveSuggestions.map((book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 p-3 hover:bg-brand-50/60 transition-colors group"
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-9 h-12 object-cover rounded shadow-xs shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 group-hover:text-brand-600 truncate font-serif">
                    {book.title}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">by {book.author}</div>
                </div>
                <div className="text-xs font-bold text-gray-900 shrink-0">
                  {formatCurrency(book.price)}
                </div>
              </Link>
            ))}
          </div>

          <Link
            to={`/books?search=${encodeURIComponent(query.trim())}`}
            onClick={() => setIsDropdownOpen(false)}
            className="block p-2.5 text-center text-xs font-semibold text-brand-600 hover:bg-brand-50 border-t border-gray-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View all search results</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};
