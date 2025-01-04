import { useState, useCallback } from 'react';

export function useProductSelection() {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const toggleProductSelection = useCallback((productId: string) => {
    setSelectedProducts(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }, []);

  return {
    selectedProducts,
    toggleProductSelection,
    isSelected: useCallback((productId: string) => selectedProducts.has(productId), [selectedProducts])
  };
}