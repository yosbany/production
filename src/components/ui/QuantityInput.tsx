import React, { useState, useEffect } from 'react';
import { useAutoSave } from '../../hooks/useAutoSave';

interface ProductionStats {
  averageQuantity?: number;
  lastQuantity?: number | null;
}

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  onSave: (value: number) => void;
  className?: string;
  disabled?: boolean;
  min?: number;
  productionStats?: ProductionStats;
}

export function QuantityInput({
  value,
  onChange,
  onSave,
  className = '',
  disabled = false,
  min = 0,
  productionStats
}: QuantityInputProps) {
  const [localValue, setLocalValue] = useState(value.toString());
  const [previousValue, setPreviousValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const { setupAutoSave, clearAutoSaveTimeout } = useAutoSave({
    onSave: (value: number) => {
      if (!disabled && value !== previousValue) {
        onSave(value);
      }
    }
  });

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value.toString());
      setPreviousValue(value);
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    if (disabled) return;
    setIsFocused(true);
    setLocalValue('');
  };

  const handleBlur = () => {
    setIsFocused(false);
    clearAutoSaveTimeout();
    const numValue = Number(localValue) || value;
    onChange(numValue);
    if (numValue !== previousValue) {
      onSave(numValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    const numValue = Number(newValue) || value;
    onChange(numValue);
    
    if (isFocused) {
      setupAutoSave(numValue);
    }
  };

  return (
    <div className="space-y-1">
      {productionStats && (
        <div className="flex items-center justify-between text-xs font-medium text-gray-500">
          <div className="flex items-center space-x-1">
            <span>Promedio:</span>
            <span className="text-gray-900">
              {productionStats.averageQuantity?.toFixed(0) || '0'}
            </span>
          </div>
          {productionStats.lastQuantity !== null && (
            <div className="flex items-center space-x-1">
              <span>Última:</span>
              <span className="text-gray-900">
                {productionStats.lastQuantity}
              </span>
            </div>
          )}
        </div>
      )}
      <div className="relative">
        {isFocused && previousValue > 0 && (
          <div className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400">
            {previousValue}
          </div>
        )}
        <input
          type="number"
          min={min}
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`
            block w-full px-4 py-3 
            border-2 rounded-lg
            text-lg font-medium text-center
            focus:ring-2 focus:ring-offset-2 
            transition-colors duration-200
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
            ${isFocused && previousValue > 0 ? 'pl-12' : ''}
            ${className}
          `}
        />
      </div>
    </div>
  );
}