import React from 'react';
import { DateInput } from './DateInput';
import { DateHeader } from './DateHeader';
import { useDateSelector } from './useDateSelector';

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
  const { 
    inputRef,
    handleContainerClick,
    handleDateChange 
  } = useDateSelector(onDateChange);

  return (
    <div className="w-full">
      <DateHeader 
        label={label} 
        selectedDate={selectedDate} 
      />
      <DateInput
        ref={inputRef}
        selectedDate={selectedDate}
        onClick={handleContainerClick}
        onChange={handleDateChange}
      />
    </div>
  );
}