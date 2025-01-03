import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { Product } from '../types/product';
import { useAuth } from '../contexts/AuthContext';

export function useProducerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const productsRef = ref(database, 'products');
    
    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const allProducts = snapshot.val();
        
        // Filter products where producerId matches the current user's ID
        const producerProducts = Object.entries(allProducts)
          .filter(([_, data]: [string, any]) => data.producerId === user.uid)
          .map(([id, data]: [string, any]) => ({
            id,
            ...data
          }));
        
        setProducts(producerProducts);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { products, loading };
}