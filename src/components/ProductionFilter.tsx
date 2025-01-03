import React from 'react';
import { Filter } from 'lucide-react';

interface ProductionFilterProps {
  showNonZero: boolean;
  onFilterChange: (checked: boolean) => void;
}

export function ProductionFilter({ showNonZero, onFilterChange }: ProductionFilterProps) {
  return (
    <div className="flex items-center space-x-4 py-3">
      <Filter className="h-5 w-5 text-gray-500" />
      
      <label className="flex items-center space-x-3 cursor-pointer">
        <button
          role="switch"
          aria-checked={showNonZero}
          onClick={() => onFilterChange(!showNonZero)}
          className={`
            relative inline-flex h-7 w-12 items-center rounded-full
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            ${showNonZero ? 'bg-indigo-600' : 'bg-gray-200'}
          `}
        >
          <span
            className={`
              inline-block h-5 w-5 transform rounded-full
              bg-white shadow ring-0 transition duration-200 ease-in-out
              ${showNonZero ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>

        <span className="text-sm font-medium text-gray-700">
          Seleccionados
        </span>
      </label>
    </div>
  );
}