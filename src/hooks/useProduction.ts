import { useState, useEffect } from 'react';
import { ref, set, get } from 'firebase/database';
import { database } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface ProductionData {
  [productId: string]: {
    quantity: number;
    completed: boolean;
  };
}

export function useProduction(date: Date) {
  const [productions, setProductions] = useState<ProductionData>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadProduction = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const dateString = date.toISOString().split('T')[0];
        const productionRef = ref(database, `productions/${dateString}/${user.uid}`);
        const snapshot = await get(productionRef);

        if (snapshot.exists()) {
          setProductions(snapshot.val());
        } else {
          setProductions({});
        }
      } catch (error) {
        console.error('Error loading production:', error);
        setProductions({});
      } finally {
        setLoading(false);
      }
    };

    loadProduction();
  }, [user, date]);

  const saveProduction = async (newProductions: ProductionData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const dateString = date.toISOString().split('T')[0];
      const productionRef = ref(database, `productions/${dateString}/${user.uid}`);
      await set(productionRef, newProductions);
      setProductions(newProductions);
    } catch (error) {
      console.error('Error saving production:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { 
    productions,
    saveProduction,
    loading
  };
}