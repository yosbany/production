import { useState, useEffect, useCallback } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Production } from '../types/production';
import { saveProductionData } from '../utils/production/database';

export function useProduction(date: Date) {
  const [productions, setProductions] = useState<Record<string, Production>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const dateString = date.toISOString().split('T')[0];
    const productionRef = ref(database, `productions/${dateString}/${user.uid}`);
    
    const unsubscribe = onValue(productionRef, (snapshot) => {
      setProductions(snapshot.exists() ? snapshot.val() : {});
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, date]);

  const saveProduction = useCallback(async (newProductions: Record<string, Production>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await saveProductionData(date, user.uid, newProductions);
      // No need to manually update state as onValue listener will handle it
    } catch (error) {
      console.error('Error saving production:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, date]);

  return { 
    productions,
    saveProduction,
    loading
  };
}