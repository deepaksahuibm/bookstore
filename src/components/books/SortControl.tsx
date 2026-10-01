import React from 'react';
import { SortOption } from '../../types';
import { ArrowUpDown } from 'lucide-react';

export interface SortControlProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

export const SortControl: React.FC<SortControlProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-1.5 whitespace-nowrap">
        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
        <span className="hidden sm:inline">Sort by:</span>
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        aria-label="Sort books catalogue"
        className="text-xs sm:text-sm bg-white border border-gray-300 rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-800 font-medium cursor-pointer shadow-sm"
      >
        <option value="featured">Featured & Curated</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating-desc">Highest Customer Rating</option>
        <option value="title-asc">Title: A to Z</option>
        <option value="title-desc">Title: Z to A</option>
      </select>
    </div>
  );
};
