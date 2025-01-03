import React, { useState, useCallback } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { SaveIndicator } from './ui/SaveIndicator';
import { useAuth } from '../contexts/AuthContext';
import { useProductionHistory } from '../hooks/useProductionHistory';

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
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const { user } = useAuth();

  const handleProductionChange = useCallback(async (
    productId: string, 
    quantity: number, 
    completed: boolean
  ) => {
    if (loading) return;

    const updatedProductions = {
      ...initialProductions,
      [productId]: { quantity, completed }
    };

    try {
      await onSave(updatedProductions);
      setShowSaveIndicator(true);
      setTimeout(() => setShowSaveIndicator(false), 2000);
    } catch (error) {
      console.error('Error saving production:', error);
    }
  }, [loading, initialProductions, onSave]);

  // Pre-fetch production history for all products
  const productionHistories = products.reduce((acc, product) => {
    if (user) {
      const history = useProductionHistory(product.id, user.uid);
      acc[product.id] = history;
    }
    return acc;
  }, {} as Record<string, ReturnType<typeof useProductionHistory>>);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            initialQuantity={initialProductions[product.id]?.quantity || 0}
            initialCompleted={initialProductions[product.id]?.completed || false}
            onChange={(quantity, completed) => 
              handleProductionChange(product.id, quantity, completed)
            }
            disabled={loading}
            productionHistory={productionHistories[product.id]}
          />
        ))}
      </div>
      <SaveIndicator show={showSaveIndicator} />
    </>
  );
}