import { useState, useEffect } from 'react';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { database } from '../lib/firebase';
import { Product, ProductInput } from '../types/product';
import { ACCESS_CONFIG } from '../constants/firebase';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const productsRef = ref(database, ACCESS_CONFIG.PATHS.PRODUCTS);
    
    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const productsData = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
          id,
          ...data
        }));
        setProducts(productsData);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createProduct = async (productData: ProductInput) => {
    setError(null);
    try {
      const productsRef = ref(database, ACCESS_CONFIG.PATHS.PRODUCTS);
      const newProductRef = push(productsRef);
      await update(newProductRef, productData);
      return newProductRef.key;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear el producto';
      setError(message);
      throw new Error(message);
    }
  };

  const updateProduct = async (productId: string, productData: ProductInput) => {
    setError(null);
    try {
      const productRef = ref(database, `${ACCESS_CONFIG.PATHS.PRODUCTS}/${productId}`);
      await update(productRef, productData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar el producto';
      setError(message);
      throw new Error(message);
    }
  };

  const deleteProduct = async (productId: string) => {
    setError(null);
    try {
      const productRef = ref(database, `${ACCESS_CONFIG.PATHS.PRODUCTS}/${productId}`);
      await remove(productRef);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar el producto';
      setError(message);
      throw new Error(message);
    }
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct
  };
}