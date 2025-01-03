import React from 'react';
import { formatFullDate } from './dateUtils';

interface DateHeaderProps {
  label: string;
  selectedDate: Date;
}

export function DateHeader({ label, selectedDate }: DateHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-2">
      <label htmlFor="dateInput" className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <span className="text-sm text-gray-500">
        {formatFullDate(selectedDate)}
      </span>
    </div>
  );
}