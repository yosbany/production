import React from 'react';
import { Plus } from 'lucide-react';

interface NewProductionButtonProps {
  onClick: () => void;
}

export function NewProductionButton({ onClick }: NewProductionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        inline-flex items-center px-6 py-3
        border border-transparent rounded-lg
        shadow-sm text-base font-medium
        text-white bg-indigo-600 
        hover:bg-indigo-700 
        focus:outline-none focus:ring-2 
        focus:ring-offset-2 focus:ring-indigo-500
        transition-colors duration-200
      "
    >
      <Plus className="h-5 w-5 mr-2" />
      Nueva Producción
    </button>
  );
}