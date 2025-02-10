import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { Package, CheckCircle, Star } from 'lucide-react';
import { QuantityInput } from './ui/QuantityInput';
import { calculateOptimalQuantity } from '../utils/production/optimalQuantity';

interface ProductCardProps {
  product: Product;
  initialQuantity?: number;
  initialCompleted?: boolean;
  onChange: (quantity: number, completed: boolean) => void;
  disabled?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  producerId?: string;
  targetDate?: Date;
  isRainyDay?: boolean;
}

export function ProductCard({ 
  product, 
  initialQuantity = 0,
  initialCompleted = false,
  onChange,
  disabled = false,
  isSelected = false,
  onToggleSelect,
  producerId,
  targetDate = new Date(),
  isRainyDay = false
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [completed, setCompleted] = useState(initialCompleted);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    setQuantity(initialQuantity);
    setCompleted(initialCompleted);
  }, [initialQuantity, initialCompleted]);

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
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

  const calculateSuggested = useCallback(async () => {
    if (!producerId || isCalculating) return;
    
    setIsCalculating(true);
    try {
      const optimal = await calculateOptimalQuantity(
        product.id,
        producerId,
        targetDate,
        isRainyDay
      );

      if (optimal > 0) {
        setQuantity(optimal);
        onChange(optimal, completed);
      }
    } catch (error) {
      console.error('Error calculating optimal quantity:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [product.id, producerId, targetDate, isRainyDay, completed, onChange]);

  const handleToggleSelect = () => {
    if (!onToggleSelect || isCalculating) return;
    onToggleSelect();
    if (!isSelected && producerId) {
      calculateSuggested();
    }
  };

  return (
    <div className={`
      rounded-lg shadow-md transition-all duration-200
      ${completed ? 'bg-green-50 border-2 border-green-200' : 'bg-white'}
      ${isSelected ? 'ring-2 ring-indigo-500' : ''}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Package className={`h-5 w-5 ${completed ? 'text-green-500' : 'text-gray-400'}`} />
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          </div>
          <button
            onClick={handleToggleSelect}
            disabled={isCalculating}
            className={`p-2 rounded-full transition-colors ${
              isSelected 
                ? 'text-indigo-600 hover:bg-indigo-50' 
                : 'text-gray-400 hover:bg-gray-50'
            }`}
            title={isSelected ? 'Deseleccionar producto' : 'Seleccionar para elaborar'}
          >
            <Star className={`h-5 w-5 ${isSelected ? 'fill-current' : ''}`} />
          </button>
        </div>

        <QuantityInput
          value={quantity}
          onChange={handleQuantityChange}
          onSave={handleQuantitySave}
          disabled={disabled || isCalculating}
          className={`
            ${completed 
              ? 'border-green-200 bg-green-50 focus:ring-green-500 focus:border-green-500' 
              : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
            }
          `}
        />

        <button
          onClick={handleCompletedChange}
          disabled={disabled || quantity === 0}
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
                ? 'Cantidad debe ser mayor a cero'
                : 'Marcar como completado'
            }
          </span>
        </button>
      </div>
    </div>
  );
}