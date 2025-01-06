import { ref, push, set, get, update, remove } from 'firebase/database';
import { database } from '../../lib/firebase';
import { Cost, CostFormData, ProductCost } from '../../types/costs';

// Base costs management
export async function loadCosts(): Promise<Cost[]> {
  const costsRef = ref(database, 'costs');
  const snapshot = await get(costsRef);
  
  if (!snapshot.exists()) return [];
  
  return Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
    id,
    ...data
  }));
}

export async function saveCost(costData: CostFormData): Promise<string> {
  const costsRef = ref(database, 'costs');
  const newCostRef = push(costsRef);
  await set(newCostRef, costData);
  return newCostRef.key!;
}

export async function updateCost(costId: string, updates: Partial<Cost>): Promise<void> {
  const costRef = ref(database, `costs/${costId}`);
  await update(costRef, updates);
}

export async function deleteCost(costId: string): Promise<void> {
  const costRef = ref(database, `costs/${costId}`);
  await remove(costRef);
}

// Product costs management
export async function loadProductCosts(productId: string): Promise<ProductCost[]> {
  const productCostsRef = ref(database, `productCosts/${productId}`);
  const snapshot = await get(productCostsRef);
  
  if (!snapshot.exists()) return [];
  
  return Object.values(snapshot.val());
}

export async function saveProductCosts(
  productId: string, 
  costs: ProductCost[]
): Promise<void> {
  const productCostsRef = ref(database, `productCosts/${productId}`);
  await set(productCostsRef, costs);
}