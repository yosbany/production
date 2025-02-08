import { useState, useEffect, useCallback } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Production } from '../types/production';
import { saveProductionData } from '../utils/production/database';

export function useProduction(date: Date) {
  const [productions, setProductions] = useState<Record<string, Production>>({});
  const [loading, setLoading] = useState(true);
  const { producerId } = useAuth();

  useEffect(() => {
    if (!producerId) return;

    const dateString = date.toISOString().split('T')[0];
    const productionRef = ref(database, `productions/${dateString}/${producerId}`);
    
    const unsubscribe = onValue(productionRef, (snapshot) => {
      if (snapshot.exists()) {
        // Convertir los datos a nuestro formato de producción
        const productionData = snapshot.val();
        const formattedProductions: Record<string, Production> = {};
        
        // Procesar cada producto en la producción
        Object.entries(productionData).forEach(([productId, data]: [string, any]) => {
          formattedProductions[productId] = {
            quantity: data.quantity || 0,
            completed: data.completed || false,
            selected: data.selected || false
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
      await saveProductionData(date, producerId, newProductions);
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