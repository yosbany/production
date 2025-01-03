import { useState, useEffect } from 'react';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { Producer } from '../types/producer';

export function useProducers() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = ref(database, 'users');
    const producersQuery = query(
      usersRef, 
      orderByChild('role'), 
      equalTo('producer')
    );
    
    const unsubscribe = onValue(producersQuery, (snapshot) => {
      if (snapshot.exists()) {
        const producersData = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
          id,
          name: data.name,
          role: data.role
        }));
        setProducers(producersData);
      } else {
        setProducers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { producers, loading };
}