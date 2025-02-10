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
          limitToLast(30) // Últimos 30 días
        );
        
        const snapshot = await get(recentProductionsQuery);
        if (!snapshot.exists()) return;

        const productions = snapshot.val();
        let totalQuantity = 0;
        let count = 0;
        let lastQuantity = null;

        // Ordenar por fecha descendente para obtener la última producción primero
        Object.entries(productions)
          .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
          .forEach(([_, dateProductions]: [string, any]) => {
            const producerProduction = dateProductions[producerId];
            if (producerProduction?.[productId]) {
              const production = producerProduction[productId];
              
              // Sumar a los totales si hay cantidad
              if (production.quantity > 0) {
                totalQuantity += production.quantity;
                count++;

                // Guardar la última cantidad completada si aún no se ha encontrado
                if (lastQuantity === null && production.completed) {
                  lastQuantity = production.quantity;
                }
              }
            }
          });

        if (count > 0) {
          setHistory({
            averageQuantity: Math.round(totalQuantity / count),
            lastQuantity
          });
        } else {
          setHistory({
            averageQuantity: 0,
            lastQuantity: null
          });
        }
      } catch (error) {
        console.error('Error fetching production history:', error);
        setHistory({
          averageQuantity: 0,
          lastQuantity: null
        });
      }
    }

    fetchHistory();
  }, [productId, producerId]);

  return history;
}