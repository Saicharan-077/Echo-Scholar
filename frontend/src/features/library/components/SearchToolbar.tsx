import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export interface CategoryOption {
  label: string;
  value: string;
}

export interface SearchToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: CategoryOption[];
  selectedCategory: string;
  onSelectCategory: (catValue: string) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
}

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  sortBy = 'date',
  onSortChange,
}) => {
  return (
    <div className="p-3 bg-white border border-gray-200/80 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
      
      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 text-indigo-600 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search papers by title or tag..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-gray-900 outline-none focus:border-indigo-600 transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Category Filter Pills & Sort Controls */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onSelectCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-gray-200 shrink-0 hidden sm:block" />

        {/* Sort & Filter Options */}
        <div className="flex items-center gap-1.5 shrink-0">
          <select
            value={sortBy}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none cursor-pointer"
          >
            <option value="date">Sort: Recent</option>
            <option value="name">Sort: Name</option>
            <option value="chunks">Sort: Length</option>
          </select>
        </div>
      </div>

    </div>
  );
};
