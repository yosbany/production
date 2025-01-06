import { ref, set, remove, get } from 'firebase/database';
import { database } from '../../lib/firebase';
import { Production } from '../../types/production';

export async function loadProductionData(date: Date, userId: string): Promise<Record<string, Production>> {
  const dateString = date.toISOString().split('T')[0];
  const productionRef = ref(database, `productions/${dateString}/${userId}`);
  const snapshot = await get(productionRef);
  return snapshot.exists() ? snapshot.val() : {};
}

export async function saveProductionData(
  date: Date, 
  userId: string, 
  productions: Record<string, Production>
): Promise<Record<string, Production>> {
  const dateString = date.toISOString().split('T')[0];
  const productionRef = ref(database, `productions/${dateString}/${userId}`);

  // Filter out products with no quantity and not selected
  const filteredProductions = Object.entries(productions).reduce((acc, [id, prod]) => {
    if (prod.quantity > 0 || prod.selected) {
      acc[id] = {
        quantity: prod.quantity || 0,
        completed: prod.completed || false,
        selected: prod.selected || false
      };
    }
    return acc;
  }, {} as Record<string, Production>);

  if (Object.keys(filteredProductions).length === 0) {
    // If no products remain, delete the entire production
    await remove(productionRef);
    return {};
  } else {
    // Save the filtered productions
    await set(productionRef, filteredProductions);
    return filteredProductions;
  }
}