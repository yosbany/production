import { useState, useCallback, useMemo } from 'react';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useProductionHistory } from './useProductionHistory';

interface UseProductionListLogicProps {
  products: Product[];
  onSave: (productions: Record<string, { quantity: number; completed: boolean }>) => Promise<void>;
  loading: boolean;
  initialProductions: Record<string, { quantity: number; completed: boolean }>;
}

export function useProductionListLogic({
  products,
  onSave,
  loading,
  initialProductions
}: UseProductionListLogicProps) {
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const { user } = useAuth();

  const handleProductionChange = useCallback(async (
    productId: string, 
    quantity: number, 
    completed: boolean
  ) => {
    if (loading || !user) return;

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
  }, [loading, initialProductions, onSave, user]);

  // Use useMemo for production histories to maintain referential equality
  const productionHistories = useMemo(() => {
    if (!user) return {};
    return products.reduce((acc, product) => {
      const history = useProductionHistory(product.id, user.uid);
      if (history) {
        acc[product.id] = history;
      }
      return acc;
    }, {} as Record<string, ReturnType<typeof useProductionHistory>>);
  }, [products, user]);

  return {
    showSaveIndicator,
    productionHistories,
    handleProductionChange,
    user
  };
}