import React from 'react';
import { BookFilters } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Filter, RotateCcw, Check, Star } from 'lucide-react';
import { Button } from '../common/Button';

export interface CategoryFilterProps {
  categories: string[];
  filters: BookFilters;
  onChange: (filters: BookFilters) => void;
  onReset: () => void;
  totalResults: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const handleCategorySelect = (cat: string) => {
    onChange({
      ...filters,
      category: cat,
    });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onChange({
      ...filters,
      maxPrice: val,
    });
  };

  const handleRatingChange = (rating: number) => {
    onChange({
      ...filters,
      minRating: filters.minRating === rating ? 0 : rating,
    });
  };

  const handleInStockToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...filters,
      inStockOnly: e.target.checked,
    });
  };

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.maxPrice < 60 ||
    filters.minRating > 0 ||
    filters.inStockOnly ||
    filters.searchQuery !== '';

  return (
    <aside className="space-y-6 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filters</span>
          <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {totalResults} results
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-brand-600 hover:text-brand-800 flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-brand-500 rounded"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all
          </button>
        )}
      </div>

      {/* Category List */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Categories
        </h4>
        <div className="space-y-1">
          {categories.map((category) => {
            const isSelected = filters.category.toLowerCase() === category.toLowerCase();
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategorySelect(category)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span>{category}</span>
                {isSelected && <Check className="w-4 h-4 text-brand-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Max Price
          </h4>
          <span className="text-sm font-bold text-gray-900">
            {formatCurrency(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="60"
          step="5"
          value={filters.maxPrice}
          onChange={handleMaxPriceChange}
          aria-label="Filter by maximum price"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600 focus:outline-none"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
          <span>$10</span>
          <span>$35</span>
          <span>$60</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
          Minimum Rating
        </h4>
        <div className="flex gap-1.5 flex-wrap">
          {[4.0, 4.5, 4.8].map((rating) => {
            const isActive = filters.minRating === rating;
            return (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingChange(rating)}
                className={`px-2.5 py-1.5 text-xs rounded-lg border flex items-center gap-1 transition-all ${
                  isActive
                    ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{rating}+</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="pt-4 border-t border-gray-100">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={handleInStockToggle}
            className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
          />
          <span className="text-sm font-medium text-gray-700">In Stock only</span>
        </label>
      </div>

      {/* Quick Action Button for Mobile Drawer */}
      <div className="pt-2 lg:hidden">
        <Button variant="primary" className="w-full" onClick={() => {}}>
          Apply Filters ({totalResults})
        </Button>
      </div>
    </aside>
  );
};
