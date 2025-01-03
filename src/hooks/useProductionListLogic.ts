import { useState, useCallback } from 'react';
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

  const productionHistories = products.reduce((acc, product) => {
    if (!user) return acc;
    const history = useProductionHistory(product.id, user.uid);
    acc[product.id] = history;
    return acc;
  }, {} as Record<string, ReturnType<typeof useProductionHistory>>);

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

  return {
    showSaveIndicator,
    productionHistories,
    handleProductionChange,
    user
  };
}