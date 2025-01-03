import React from 'react';
import { Clock } from 'lucide-react';
import { formatTimestamp } from '../utils/dateUtils';

interface LastSavedIndicatorProps {
  lastSavedDate: Date | null;
}

export function LastSavedIndicator({ lastSavedDate }: LastSavedIndicatorProps) {
  if (!lastSavedDate) return null;

  return (
    <div className="flex items-center justify-center space-x-2 py-2 text-sm text-gray-500">
      <Clock className="h-4 w-4" />
      <span>Último guardado: {formatTimestamp(lastSavedDate)}</span>
    </div>
  );
}