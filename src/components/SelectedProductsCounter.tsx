import React from 'react';
import { Star } from 'lucide-react';

interface SelectedProductsCounterProps {
  count: number;
  total: number;
}

export function SelectedProductsCounter({ count, total }: SelectedProductsCounterProps) {
  if (total === 0) return null;

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <Star className={`h-4 w-4 ${count > 0 ? 'text-indigo-500 fill-current' : 'text-gray-400'}`} />
      <span>
        {count} de {total} productos seleccionados
      </span>
    </div>
  );
}