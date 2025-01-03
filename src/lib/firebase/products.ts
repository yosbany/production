import { ref, push, set, remove, update, get } from 'firebase/database';
import { database } from './index';
import { Product } from '../../types/product';

export async function createProduct(product: Omit<Product, 'id'>): Promise<string> {
  const productsRef = ref(database, 'products');
  const newProductRef = push(productsRef);
  await set(newProductRef, product);
  return newProductRef.key!;
}

export async function updateProduct(productId: string, product: Omit<Product, 'id'>): Promise<void> {
  const productRef = ref(database, `products/${productId}`);
  await update(productRef, product);
}

export async function deleteProduct(productId: string): Promise<void> {
  const productRef = ref(database, `products/${productId}`);
  await remove(productRef);
}