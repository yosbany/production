import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../lib/firebase';

interface ProductDetails {
  id: string;
  name: string;
  quantity: number;
  completed: boolean;
  cost: number;
  salePrice: number;
}

export function useProductionDetails(date: string, producerId: string) {
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductionDetails() {
      try {
        const [productionSnapshot, productsSnapshot] = await Promise.all([
          get(ref(database, `productions/${date}/${producerId}`)),
          get(ref(database, 'products'))
        ]);

        if (!productionSnapshot.exists() || !productsSnapshot.exists()) {
          setProducts([]);
          return;
        }

        const production = productionSnapshot.val();
        const allProducts = productsSnapshot.val();

        const productDetails = Object.entries(production)
          .map(([productId, data]: [string, any]) => {
            const product = allProducts[productId];
            if (!product) return null;

            return {
              id: productId,
              name: product.name,
              quantity: data.quantity,
              completed: data.completed,
              cost: product.fixedCost * data.quantity,
              salePrice: product.salePrice
            };
          })
          .filter((p): p is ProductDetails => p !== null);

        setProducts(productDetails);
      } catch (error) {
        console.error('Error fetching production details:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProductionDetails();
  }, [date, producerId]);

  return { products, loading };
}