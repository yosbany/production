import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Package, CheckCircle } from 'lucide-react';
import { QuantityInput } from './ui/QuantityInput';

interface ProductCardProps {
  product: Product;
  initialQuantity?: number;
  initialCompleted?: boolean;
  onChange: (quantity: number, completed: boolean) => void;
  disabled?: boolean;
  productionHistory?: {
    averageQuantity: number;
    lastQuantity: number | null;
  };
}

export function ProductCard({ 
  product, 
  initialQuantity = 0,
  initialCompleted = false,
  onChange,
  disabled = false,
  productionHistory
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [completed, setCompleted] = useState(initialCompleted);

  useEffect(() => {
    setQuantity(initialQuantity);
    if (initialQuantity === 0 && completed) {
      setCompleted(false);
      onChange(0, false);
    } else {
      setCompleted(initialCompleted);
    }
  }, [initialQuantity, initialCompleted, onChange]);

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
    if (value === 0 && completed) {
      setCompleted(false);
      onChange(value, false);
    } else {
      onChange(value, completed);
    }
  };

  const handleQuantitySave = (value: number) => {
    if (value === 0 && completed) {
      setCompleted(false);
      onChange(value, false);
    } else {
      onChange(value, completed);
    }
  };

  const handleCompletedChange = () => {
    if (disabled || quantity === 0) return;
    const newCompleted = !completed;
    setCompleted(newCompleted);
    onChange(quantity, newCompleted);
  };

  const isCompletionDisabled = disabled || quantity === 0;

  return (
    <div className={`
      rounded-lg shadow-md transition-all duration-200
      ${completed ? 'bg-green-50 border-2 border-green-200' : 'bg-white'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}>
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Package className={`h-5 w-5 ${completed ? 'text-green-500' : 'text-gray-400'}`} />
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        </div>

        <QuantityInput
          value={quantity}
          onChange={handleQuantityChange}
          onSave={handleQuantitySave}
          disabled={disabled}
          productionStats={productionHistory}
          className={`
            ${completed 
              ? 'border-green-200 bg-green-50 focus:ring-green-500 focus:border-green-500' 
              : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
            }
          `}
        />

        <button
          onClick={handleCompletedChange}
          disabled={isCompletionDisabled}
          className={`
            w-full mt-4 flex items-center justify-center space-x-2 
            px-4 py-3 rounded-lg
            text-sm font-medium
            transition-colors duration-200
            ${completed
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : quantity === 0
                ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <CheckCircle className={`h-5 w-5 ${completed ? 'text-green-500' : 'text-gray-400'}`} />
          <span className={quantity === 0 ? 'text-xs' : 'text-sm'}>
            {completed 
              ? 'Completado' 
              : quantity === 0 
                ? 'Cantidad debe ser mayor a 0'
                : 'Marcar como completado'
            }
          </span>
        </button>
      </div>
    </div>
  );
}