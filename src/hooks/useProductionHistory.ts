import { useState, useEffect } from 'react';
import { ref, get, query, orderByKey, limitToLast } from 'firebase/database';
import { database } from '../lib/firebase';

interface ProductionHistory {
  averageQuantity: number;
  lastQuantity: number | null;
}

export function useProductionHistory(productId: string, producerId: string): ProductionHistory | null {
  const [history, setHistory] = useState<ProductionHistory | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      if (!productId || !producerId) return;

      try {
        const productionsRef = ref(database, 'productions');
        const recentProductionsQuery = query(
          productionsRef,
          orderByKey(),
          limitToLast(30)
        );
        
        const snapshot = await get(recentProductionsQuery);
        if (!snapshot.exists()) return;

        const productions = snapshot.val();
        let totalQuantity = 0;
        let count = 0;
        let lastQuantity = null;

        Object.entries(productions)
          .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
          .some(([_, dateProductions]: [string, any]) => {
            const producerProduction = dateProductions[producerId];
            if (!producerProduction?.[productId]) return false;

            const production = producerProduction[productId];
            
            if (production.quantity > 0) {
              totalQuantity += production.quantity;
              count++;
            }

            if (production.completed && lastQuantity === null) {
              lastQuantity = production.quantity;
              return true;
            }

            return false;
          });

        if (count > 0) {
          setHistory({
            averageQuantity: Math.round(totalQuantity / count),
            lastQuantity
          });
        }
      } catch (error) {
        console.error('Error fetching production history:', error);
      }
    }

    fetchHistory();
  }, [productId, producerId]);

  return history;
}