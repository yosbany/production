import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from './index';
import { Producer } from '../../types/producer';

export async function getProducers(): Promise<Producer[]> {
  const usersRef = ref(database, 'users');
  const producersQuery = query(
    usersRef, 
    orderByChild('role'), 
    equalTo('producer')
  );
  
  const snapshot = await get(producersQuery);
  
  if (!snapshot.exists()) {
    return [];
  }
  
  return Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
    id,
    name: data.name,
    role: data.role,
    salaryCost: data.salaryCost || 0
  }));
}

export async function getProducerById(id: string): Promise<Producer | undefined> {
  const userRef = ref(database, `users/${id}`);
  const snapshot = await get(userRef);
  
  if (!snapshot.exists() || snapshot.val().role !== 'producer') {
    return undefined;
  }
  
  const data = snapshot.val();
  return {
    id,
    name: data.name,
    role: data.role,
    salaryCost: data.salaryCost || 0
  };
}