import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../lib/firebase';
import { ProductionStat } from '../types/stats';

export function useProductionStats(date: Date, selectedProducer: string | null) {
  const [stats, setStats] = useState<ProductionStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const dateString = date.toISOString().split('T')[0];
        const productionsRef = ref(database, `productions/${dateString}`);
        const productsRef = ref(database, 'products');
        
        const [productionsSnapshot, productsSnapshot] = await Promise.all([
          get(productionsRef),
          get(productsRef)
        ]);

        if (productsSnapshot.exists()) {
          const products = productsSnapshot.val();
          const productions = productionsSnapshot.exists() ? productionsSnapshot.val() : {};
          
          const statsData = Object.entries(products).map(([productId, product]: [string, any]) => {
            let totalQuantity = 0;
            let completedQuantity = 0;

            // If there are productions for the selected date
            if (productions) {
              Object.entries(productions).forEach(([userId, userProductions]: [string, any]) => {
                if (!selectedProducer || userId === selectedProducer) {
                  const production = userProductions?.[productId];
                  if (production) {
                    totalQuantity += production.quantity || 0;
                    if (production.completed) {
                      completedQuantity += production.quantity || 0;
                    }
                  }
                }
              });
            }

            return {
              productName: product.name,
              totalQuantity,
              completedQuantity
            };
          });

          setStats(statsData);
        } else {
          setStats([]);
        }
      } catch (error) {
        console.error('Error fetching production stats:', error);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [date, selectedProducer]);

  return { stats, loading };
}