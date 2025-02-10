import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = parseInputDate(e.target.value);
    if (isNaN(newDate.getTime())) return;
    onDateChange(newDate);
    setIsOpen(false);
  };

  const handleToday = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onDateChange(new Date());
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Main date display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full px-4 py-3
          bg-white rounded-lg
          border-2 border-gray-200
          shadow-sm
          flex items-center justify-between
          group
          hover:border-indigo-300
          transition-colors duration-200
          cursor-pointer
        "
      >
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-gray-400 group-hover:text-indigo-500" />
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">
              {formatDisplayDate(selectedDate)}
            </p>
            <p className="text-xs text-gray-500 hidden sm:block">
              {formatFullDate(selectedDate)}
            </p>
          </div>
        </div>
        
        {/* Today button for small screens */}
        <div
          onClick={handleToday}
          className="
            sm:hidden
            px-2 py-1
            text-xs font-medium
            text-indigo-600
            bg-indigo-50
            rounded-md
            hover:bg-indigo-100
            transition-colors
            cursor-pointer
          "
        >
          Hoy
        </div>
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="
            absolute top-full left-0 right-0 mt-2
            bg-white rounded-lg shadow-lg
            border border-gray-200
            p-4 z-20
            animate-in fade-in slide-in-from-top-2
            duration-200
          ">
            <div className="space-y-4">
              {/* Native date input */}
              <input
                type="date"
                value={formatInputDate(selectedDate)}
                onChange={handleDateChange}
                className="
                  w-full px-3 py-2
                  border border-gray-300 rounded-md
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                "
              />
              
              {/* Quick actions */}
              <div className="flex items-center justify-between border-t pt-3">
                <div
                  onClick={handleToday}
                  className="
                    hidden sm:inline-flex
                    items-center px-3 py-1.5
                    text-sm font-medium
                    text-indigo-600 bg-indigo-50
                    rounded-md
                    hover:bg-indigo-100
                    transition-colors
                    cursor-pointer
                  "
                >
                  Hoy
                </div>
                <div
                  onClick={() => setIsOpen(false)}
                  className="
                    px-3 py-1.5
                    text-sm font-medium
                    text-gray-600 bg-gray-50
                    rounded-md
                    hover:bg-gray-100
                    transition-colors
                    cursor-pointer
                  "
                >
                  Cerrar
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}