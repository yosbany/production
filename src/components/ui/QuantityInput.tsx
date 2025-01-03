import React, { useState, useEffect, useCallback } from 'react';
import { useProductionAutoSave } from '../../hooks/useProductionAutoSave';
import { X } from 'lucide-react';

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
  productionStats?: ProductionStats;
}

export function QuantityInput({
  value,
  onChange,
  onSave,
  className = '',
  disabled = false,
  productionStats
}: QuantityInputProps) {
  const [localValue, setLocalValue] = useState(value.toString());
  const [previousValue, setPreviousValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [pendingValue, setPendingValue] = useState<number | null>(null);

  const handleSave = useCallback(() => {
    if (pendingValue !== null && pendingValue !== previousValue) {
      onSave(pendingValue);
      setPreviousValue(pendingValue);
      setPendingValue(null);
    }
  }, [pendingValue, previousValue, onSave]);

  const { setupAutoSave, clearAutoSaveTimeout } = useProductionAutoSave({
    onSave: handleSave
  });

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value.toString());
      setPreviousValue(value);
      setPendingValue(null);
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    if (disabled) return;
    setIsFocused(true);
    setLocalValue('');
    clearAutoSaveTimeout();
  };

  const handleBlur = () => {
    setIsFocused(false);
    clearAutoSaveTimeout();
    const numValue = Number(localValue);
    const finalValue = isNaN(numValue) ? previousValue : numValue;
    
    onChange(finalValue);
    
    if (finalValue !== previousValue) {
      onSave(finalValue);
      setPreviousValue(finalValue);
      setPendingValue(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    const numValue = Number(newValue);
    if (!isNaN(numValue)) {
      onChange(numValue);
      setPendingValue(numValue);
      setupAutoSave();
    }
  };

  const handleClear = () => {
    if (disabled) return;
    clearAutoSaveTimeout();
    const newValue = 0;
    setLocalValue(newValue.toString());
    onChange(newValue);
    onSave(newValue);
    setPreviousValue(newValue);
    setPendingValue(null);
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
          min="0"
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
        {Number(localValue) > 0 && !disabled && (
          <button
            onClick={handleClear}
            className="absolute top-1/2 -translate-y-1/2 right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            title="Poner en cero"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}