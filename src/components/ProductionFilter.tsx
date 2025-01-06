import React from 'react';
import { Filter, CheckCircle } from 'lucide-react';

interface ProductionFilterProps {
  showSelected: boolean;
  onFilterChange: (checked: boolean) => void;
  selectedCount: number;
  completionPercentage: number;
}

export function ProductionFilter({ 
  showSelected, 
  onFilterChange,
  selectedCount,
  completionPercentage
}: ProductionFilterProps) {
  return (
    <div className="flex items-center space-x-3 py-2">
      <Filter className="h-4 w-4 text-gray-500" />
      
      <button
        role="switch"
        aria-checked={showSelected}
        onClick={() => onFilterChange(!showSelected)}
        className={`
          relative inline-flex h-6 items-center px-2.5
          rounded-md text-xs font-semibold uppercase tracking-wide
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          ${showSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}
        `}
      >
        <span className="whitespace-nowrap flex items-center">
          SELECCIONADOS {selectedCount > 0 && `(${selectedCount})`}
        </span>
      </button>

      <div className={`
        inline-flex items-center space-x-1.5 h-6 px-2.5
        rounded-md text-xs font-semibold uppercase tracking-wide
        ${completionPercentage >= 75 ? 'bg-green-600 text-white' : 
          completionPercentage >= 50 ? 'bg-yellow-600 text-white' : 
          'bg-gray-100 text-gray-600'}
      `}>
        <CheckCircle className="h-4 w-4" />
        <span>{completionPercentage}%</span>
      </div>
    </div>
  );
}