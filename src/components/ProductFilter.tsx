import React from 'react';
import { Search } from 'lucide-react';

interface ProductFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ProductFilter({ searchTerm, onSearchChange }: ProductFilterProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar producto..."
        className="
          block w-full pl-10 pr-3 py-2
          border border-gray-300 rounded-lg
          bg-white text-gray-900
          placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          sm:text-sm
        "
      />
    </div>
  );
}