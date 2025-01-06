import { useState, useEffect, useCallback } from 'react';
import { ref, get, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { updateProductCosts } from '../utils/costs/productCosts';
import { Cost } from '../types/costs';

export function useProductCosts(productId: string) {
  const [productCosts, setProductCosts] = useState<Cost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load product costs and their details
  useEffect(() => {
    if (!productId) {
      setProductCosts([]);
      setLoading(false);
      return;
    }

    const productCostsRef = ref(database, `productCosts/${productId}`);
    const costsRef = ref(database, 'costs');

    const unsubscribe = onValue(productCostsRef, async (snapshot) => {
      try {
        const costsSnapshot = await get(costsRef);
        if (!costsSnapshot.exists()) {
          setProductCosts([]);
          return;
        }

        const baseCosts = costsSnapshot.val();
        const productCostsData = snapshot.exists() ? snapshot.val() : [];

        // Combine base cost data with product quantities
        const costs = productCostsData.map((pc: any) => {
          const baseCost = baseCosts[pc.costId];
          if (!baseCost) return null;
          
          return {
            ...baseCost,
            id: pc.costId,
            quantity: pc.quantity
          };
        }).filter(Boolean);

        setProductCosts(costs);
        setError(null);
      } catch (error) {
        console.error('Error loading product costs:', error);
        setError('Error al cargar los costos del producto');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [productId]);

  // Update product costs
  const updateCosts = useCallback(async (costs: Cost[]) => {
    if (!productId) return;
    setError(null);
    
    try {
      await updateProductCosts(productId, costs.map(c => ({
        costId: c.id,
        quantity: c.quantity || 0
      })));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al actualizar los costos';
      setError(message);
      throw new Error(message);
    }
  }, [productId]);

  return {
    productCosts,
    loading,
    error,
    updateCosts
  };
}