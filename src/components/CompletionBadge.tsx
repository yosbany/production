import React from 'react';
import { CheckCircle } from 'lucide-react';

interface CompletionBadgeProps {
  percentage: number;
}

export function CompletionBadge({ percentage }: CompletionBadgeProps) {
  const getColorClasses = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-100 text-green-800 border-green-200';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className={`
      inline-flex items-center space-x-1.5 px-2.5 py-1 
      rounded-full text-xs font-medium border
      ${getColorClasses(percentage)}
    `}>
      <CheckCircle className="h-3.5 w-3.5" />
      <span>{percentage}% completado</span>
    </div>
  );
}