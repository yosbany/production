import { ref, get, query, orderByChild } from 'firebase/database';
import { database } from './index';

export async function getProducts() {
  const productsRef = ref(database, 'products');
  const snapshot = await get(productsRef);
  return snapshot.exists() ? snapshot.val() : {};
}

export async function getProducers() {
  const usersRef = ref(database, 'users');
  const producersQuery = query(usersRef, orderByChild('role'), /* startAt('producer'), endAt('producer') */);
  const snapshot = await get(producersQuery);
  return snapshot.exists() ? snapshot.val() : {};
}