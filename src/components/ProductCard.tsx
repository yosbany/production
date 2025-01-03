import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Package, CheckCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  initialQuantity?: number;
  initialCompleted?: boolean;
  onChange: (quantity: number, completed: boolean) => void;
}

export function ProductCard({ 
  product, 
  initialQuantity = 0,
  initialCompleted = false,
  onChange 
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [completed, setCompleted] = useState(initialCompleted);

  useEffect(() => {
    setQuantity(initialQuantity);
    setCompleted(initialCompleted);
  }, [initialQuantity, initialCompleted]);

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
    onChange(value, completed);
  };

  const handleCompletedChange = (value: boolean) => {
    setCompleted(value);
    onChange(quantity, value);
  };

  return (
    <div className={`
      rounded-lg shadow-md transition-all duration-200
      ${completed ? 'bg-green-50 border-2 border-green-200' : 'bg-white'}
    `}>
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Package className={`h-5 w-5 ${completed ? 'text-green-500' : 'text-gray-400'}`} />
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Cantidad
          </label>
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
            className={`
              block w-full px-4 py-3 
              border-2 rounded-lg
              text-lg font-medium text-center
              focus:ring-2 focus:ring-offset-2 
              transition-colors duration-200
              ${completed 
                ? 'border-green-200 bg-green-50 focus:ring-green-500 focus:border-green-500' 
                : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
              }
            `}
          />
        </div>

        <button
          onClick={() => handleCompletedChange(!completed)}
          className={`
            w-full mt-4 flex items-center justify-center space-x-2 
            px-4 py-3 rounded-lg
            text-sm font-medium
            transition-colors duration-200
            ${completed
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <CheckCircle className={`h-5 w-5 ${completed ? 'text-green-500' : 'text-gray-400'}`} />
          <span>{completed ? 'Completado' : 'Marcar como completado'}</span>
        </button>
      </div>
    </div>
  );
}