import { useState, useEffect } from 'react';
import { ProductionListItem } from '../types/production';
import { ref, onValue, get } from 'firebase/database';
import { database } from '../lib/firebase';
import { calculateProductionCosts } from '../utils/calculations';

export function useProductionList() {
  const [productions, setProductions] = useState<ProductionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const productionsRef = ref(database, 'productions');
    const productsRef = ref(database, 'products');

    const unsubscribe = onValue(productionsRef, async (productionsSnapshot) => {
      try {
        const productsSnapshot = await get(productsRef);
        
        if (!productsSnapshot.exists()) {
          setProductions([]);
          return;
        }

        const products = productsSnapshot.val();
        const allProductions = productionsSnapshot.val() || {};

        // Calculate costs for all productions
        const productionsList = await calculateProductionCosts(allProductions, products);
        
        // Sort by date (newest first) and status (in-progress first)
        const sortedProductions = productionsList.sort((a, b) => {
          if (a.status === b.status) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
          return a.status === 'in-progress' ? -1 : 1;
        });

        setProductions(sortedProductions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setProductions([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { productions, loading, error };
}