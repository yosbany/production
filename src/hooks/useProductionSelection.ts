import { useState, useCallback, useEffect } from 'react';
import { useProduction } from './useProduction';
import { Production } from '../types/production';

export function useProductionSelection(date: Date) {
  const { productions, saveProduction } = useProduction(date);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  // Initialize selections from existing productions
  useEffect(() => {
    const initialSelections = new Set(
      Object.entries(productions)
        .filter(([_, data]) => data.selected)
        .map(([id]) => id)
    );
    setSelectedProducts(initialSelections);
  }, [productions]);

  const toggleProductSelection = useCallback(async (productId: string) => {
    const isCurrentlySelected = selectedProducts.has(productId);
    const currentProduction = productions[productId] || { 
      quantity: 0, 
      completed: false, 
      selected: false 
    };
    
    // Update local state
    setSelectedProducts(prev => {
      const next = new Set(prev);
      if (isCurrentlySelected) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });

    // Prepare updated productions
    const updatedProductions = { ...productions };
    
    if (isCurrentlySelected) {
      // If deselecting, reset quantity and completion status
      if (currentProduction.quantity > 0) {
        updatedProductions[productId] = {
          quantity: 0,
          completed: false,
          selected: false
        };
      } else {
        // If no quantity, remove the entry completely
        delete updatedProductions[productId];
      }
    } else {
      // If selecting, add or update the product
      updatedProductions[productId] = {
        ...currentProduction,
        selected: true
      };
    }

    await saveProduction(updatedProductions);
  }, [selectedProducts, productions, saveProduction]);

  return {
    selectedProducts,
    toggleProductSelection,
    isSelected: useCallback((productId: string) => selectedProducts.has(productId), [selectedProducts])
  };
}