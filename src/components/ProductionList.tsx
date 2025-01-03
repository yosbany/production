import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { LastSavedIndicator } from './LastSavedIndicator';

interface ProductionListProps {
  products: Product[];
  onSave: (productions: Record<string, { quantity: number; completed: boolean }>) => Promise<void>;
  loading: boolean;
  initialProductions: Record<string, { quantity: number; completed: boolean }>;
}

export function ProductionList({ 
  products, 
  onSave, 
  loading,
  initialProductions
}: ProductionListProps) {
  const [productions, setProductions] = useState<Record<string, { quantity: number; completed: boolean }>>(initialProductions);
  const [lastSavedDate, setLastSavedDate] = useState<Date | null>(null);

  useEffect(() => {
    setProductions(initialProductions);
  }, [initialProductions]);

  const handleProductionChange = (productId: string, quantity: number, completed: boolean) => {
    setProductions(prev => ({
      ...prev,
      [productId]: { quantity, completed }
    }));
  };

  const handleSave = async () => {
    try {
      await onSave(productions);
      setLastSavedDate(new Date());
    } catch (error) {
      console.error('Error saving production:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            initialQuantity={productions[product.id]?.quantity || 0}
            initialCompleted={productions[product.id]?.completed || false}
            onChange={(quantity, completed) => 
              handleProductionChange(product.id, quantity, completed)
            }
          />
        ))}
      </div>
      {products.length > 0 && (
        <div className="space-y-2">
          <LastSavedIndicator lastSavedDate={lastSavedDate} />
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Producción'}
          </button>
        </div>
      )}
    </div>
  );
}