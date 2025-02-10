import { useState, useEffect, useCallback } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Production } from '../types/production';
import { saveProductionData } from '../utils/production/database';
import { getDateString } from '../utils/dateUtils';

export function useProduction(date: Date) {
  const [productions, setProductions] = useState<Record<string, Production>>({});
  const [loading, setLoading] = useState(true);
  const { producerId } = useAuth();

  useEffect(() => {
    if (!producerId) return;

    const dateString = getDateString(date);
    const productionRef = ref(database, `productions/${dateString}/${producerId}`);
    
    const unsubscribe = onValue(productionRef, (snapshot) => {
      if (snapshot.exists()) {
        const productionData = snapshot.val();
        const formattedProductions: Record<string, Production> = {};
        
        Object.entries(productionData).forEach(([productId, data]: [string, any]) => {
          formattedProductions[productId] = {
            quantity: Number(data.quantity) || 0,
            completed: Boolean(data.completed),
            selected: Boolean(data.selected)
          };
        });
        
        setProductions(formattedProductions);
      } else {
        setProductions({});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [producerId, date]);

  const saveProduction = useCallback(async (newProductions: Record<string, Production>) => {
    if (!producerId) return;
    
    setLoading(true);
    try {
      // Normalizar los datos antes de guardar
      const normalizedProductions = Object.entries(newProductions).reduce((acc, [id, prod]) => {
        // Solo incluir productos con cantidad o seleccionados
        if (prod.quantity > 0 || prod.selected) {
          acc[id] = {
            quantity: Number(prod.quantity) || 0,
            completed: Boolean(prod.completed),
            selected: Boolean(prod.selected)
          };
        }
        return acc;
      }, {} as Record<string, Production>);

      await saveProductionData(date, producerId, normalizedProductions);
    } catch (error) {
      console.error('Error saving production:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [producerId, date]);

  return { 
    productions,
    saveProduction,
    loading
  };
}