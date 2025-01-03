import React from 'react';
import { Check } from 'lucide-react';

interface SaveIndicatorProps {
  show: boolean;
}

export function SaveIndicator({ show }: SaveIndicatorProps) {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-50 text-green-700 px-4 py-2 rounded-lg shadow-sm border border-green-200 flex items-center space-x-2 animate-fade-in-out">
      <Check className="h-4 w-4" />
      <span className="text-sm font-medium">Guardado</span>
    </div>
  );
}