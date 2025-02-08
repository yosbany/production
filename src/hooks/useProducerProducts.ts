import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { Product } from '../types/product';
import { useAuth } from '../contexts/AuthContext';
import { ACCESS_CONFIG } from '../constants/firebase';

export function useProducerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { producerId } = useAuth();

  useEffect(() => {
    if (!producerId) return;

    const productsRef = ref(database, ACCESS_CONFIG.PATHS.PRODUCTS);
    
    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const allProducts = snapshot.val();
        
        // Filter products assigned to this producer
        const producerProducts = Object.entries(allProducts)
          .filter(([_, data]: [string, any]) => data.producerId === producerId)
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
  }, [producerId]);

  return { products, loading };
}