import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { SaveIndicator } from './ui/SaveIndicator';
import { useProductionListLogic } from '../hooks/useProductionListLogic';

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
  const {
    showSaveIndicator,
    productionHistories,
    handleProductionChange,
    user
  } = useProductionListLogic({
    products,
    onSave,
    loading,
    initialProductions
  });

  if (!user) {
    return null;
  }

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