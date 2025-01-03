import React, { forwardRef } from 'react';
import { formatInputDate, formatDisplayDate } from './dateUtils';

interface DateInputProps {
  selectedDate: Date;
  onClick: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  function DateInput({ selectedDate, onClick, onChange }, ref) {
    return (
      <div 
        className="relative group cursor-pointer"
        onClick={onClick}
      >
        <input
          ref={ref}
          type="date"
          id="dateInput"
          value={formatInputDate(selectedDate)}
          onChange={onChange}
          className="
            block w-full px-4 py-3
            border-2 border-gray-300 
            rounded-lg shadow-sm 
            bg-white
            text-gray-900
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            group-hover:border-indigo-400
            transition-all duration-200
            cursor-pointer
          "
        />
        <DateBadge date={selectedDate} />
      </div>
    );
  }
);

function DateBadge({ date }: { date: Date }) {
  return (
    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
      <div className="px-3 py-1.5 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
        <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
          {formatDisplayDate(date)}
        </span>
      </div>
    </div>
  );
}