import { useRef } from 'react';
import { parseInputDate } from './dateUtils';

export function useDateSelector(onDateChange: (date: Date) => void) {
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

  return {
    inputRef,
    handleContainerClick,
    handleDateChange
  };
}