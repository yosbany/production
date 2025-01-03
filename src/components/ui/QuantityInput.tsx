import React, { useState, useEffect } from 'react';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  min?: number;
  placeholder?: string;
}

export function QuantityInput({
  value,
  onChange,
  className = '',
  min = 0,
  placeholder = 'Cantidad'
}: QuantityInputProps) {
  const [localValue, setLocalValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value.toString());
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    setLocalValue('');
  };

  const handleBlur = () => {
    setIsFocused(false);
    const numValue = Number(localValue) || value;
    onChange(numValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (newValue !== '') {
      const numValue = Number(newValue);
      if (!isNaN(numValue) && numValue >= min) {
        onChange(numValue);
      }
    }
  };

  return (
    <input
      type="number"
      min={min}
      value={localValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={`
        block w-full px-4 py-3 
        border-2 rounded-lg
        text-lg font-medium text-center
        focus:ring-2 focus:ring-offset-2 
        transition-colors duration-200
        ${className}
      `}
    />
  );
}