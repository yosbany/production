import React, { useRef } from 'react';
import { formatDisplayDate, formatInputDate, formatFullDate, parseInputDate } from '../utils/dateUtils';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  label?: string;
}

export default function DateSelector({ 
  selectedDate, 
  onDateChange,
  label = 'Fecha'
}: DateSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.click();
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = parseInputDate(e.target.value);
    if (isNaN(newDate.getTime())) return;
    onDateChange(newDate);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="dateInput" className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-sm text-gray-500">
          {formatFullDate(selectedDate)}
        </span>
      </div>

      <div 
        className="relative group cursor-pointer"
        onClick={handleContainerClick}
      >
        {/* Date Input */}
        <input
          ref={inputRef}
          type="date"
          id="dateInput"
          value={formatInputDate(selectedDate)}
          onChange={handleDateChange}
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

        {/* Display Date Badge */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <div className="px-3 py-1.5 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
            <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
              {formatDisplayDate(selectedDate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}