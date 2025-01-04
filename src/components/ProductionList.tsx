import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { SaveIndicator } from './ui/SaveIndicator';
import { EmptyState } from './ui/EmptyState';
import { useProductionListLogic } from '../hooks/useProductionListLogic';

interface ProductionListProps {
  products: Product[];
  onSave: (productions: Record<string, { quantity: number; completed: boolean }>) => Promise<void>;
  loading: boolean;
  initialProductions: Record<string, { quantity: number; completed: boolean }>;
  selectedProducts: Set<string>;
  onToggleProductSelection: (productId: string) => void;
  isProductSelected: (productId: string) => boolean;
  showSelected: boolean;
}

export function ProductionList({ 
  products, 
  onSave, 
  loading,
  initialProductions,
  selectedProducts,
  onToggleProductSelection,
  isProductSelected,
  showSelected
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

  const displayProducts = showSelected 
    ? products.filter(p => selectedProducts.has(p.id))
    : products;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayProducts.map(product => (
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
            isSelected={isProductSelected(product.id)}
            onToggleSelect={() => onToggleProductSelection(product.id)}
          />
        ))}
      </div>
      {displayProducts.length === 0 && (
        <EmptyState 
          message={showSelected 
            ? "No hay productos seleccionados para elaborar" 
            : "No hay productos disponibles"
          } 
        />
      )}
      <SaveIndicator show={showSaveIndicator} />
    </>
  );
}