import React from 'react';
import { DateInput } from './DateInput';
import { DateHeader } from './DateHeader';
import { useDateSelector } from './useDateSelector';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DateSelector({ 
  selectedDate, 
  onDateChange
}: DateSelectorProps) {
  const { 
    inputRef,
    handleContainerClick,
    handleDateChange 
  } = useDateSelector(onDateChange);

  return (
    <div className="w-full">
      <DateHeader selectedDate={selectedDate} />
      <DateInput
        ref={inputRef}
        selectedDate={selectedDate}
        onClick={handleContainerClick}
        onChange={handleDateChange}
      />
    </div>
  );
}