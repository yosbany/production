import React from 'react';
import { formatFullDate } from './dateUtils';

interface DateHeaderProps {
  selectedDate: Date;
}

export function DateHeader({ selectedDate }: DateHeaderProps) {
  return (
    <div className="mb-2">
      <p className="text-sm text-gray-500">
        {formatFullDate(selectedDate)}
      </p>
    </div>
  );
}