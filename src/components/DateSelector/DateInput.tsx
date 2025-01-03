import React, { forwardRef } from 'react';
import { formatInputDate } from './dateUtils';

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
      </div>
    );
  }
);