import { useState, useEffect, useCallback } from 'react';
import { Cost, CostFormData } from '../types/costs';
import { ref, push, set, onValue, remove } from 'firebase/database';
import { database } from '../lib/firebase';
import { updateProductCostsOnPriceChange } from '../utils/costs/updateCosts';
import { canDeleteCost } from '../utils/costs/validation';

export function useCosts() {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const costsRef = ref(database, 'costs');
    const unsubscribe = onValue(costsRef, (snapshot) => {
      if (snapshot.exists()) {
        const costsData = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
          id,
          ...data
        }));
        setCosts(costsData);
      } else {
        setCosts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateCostPrice = useCallback(async (costId: string, pricePerUnit: number) => {
    setError(null);
    try {
      await updateProductCostsOnPriceChange(costId, pricePerUnit);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al actualizar el precio';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const addCost = useCallback(async (costData: CostFormData) => {
    setError(null);
    try {
      const costsRef = ref(database, 'costs');
      const newCostRef = push(costsRef);
      await set(newCostRef, costData);
      return newCostRef.key!;
    } catch (error) {
      const message = 'No se pudo agregar el costo';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const deleteCost = useCallback(async (costId: string) => {
    setError(null);
    try {
      // Check if cost can be deleted
      const canDelete = await canDeleteCost(costId);
      if (!canDelete) {
        throw new Error('No se puede eliminar este costo porque está siendo utilizado en uno o más productos');
      }

      // Delete the cost
      const costRef = ref(database, `costs/${costId}`);
      await remove(costRef);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al eliminar el costo';
      setError(message);
      throw new Error(message);
    }
  }, []);

  return {
    costs,
    loading,
    error,
    addCost,
    updateCostPrice,
    deleteCost
  };
}