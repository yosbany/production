import { ref, get, update } from 'firebase/database';
import { database } from '../../lib/firebase';
import { validateProductCosts } from './validation';
import { calculateTotalCost } from './calculations';

export async function updateProductCosts(
  productId: string,
  costUpdates: { costId: string; quantity: number }[]
): Promise<void> {
  const error = validateProductCosts(costUpdates);
  if (error) throw new Error(error);

  try {
    // Get current costs for price calculation
    const costsRef = ref(database, 'costs');
    const costsSnapshot = await get(costsRef);
    
    if (!costsSnapshot.exists()) {
      throw new Error('No se encontraron los costos base');
    }
    
    const baseCosts = costsSnapshot.val();
    
    // Calculate new fixed cost
    const newFixedCost = costUpdates.reduce((total, update) => {
      const cost = baseCosts[update.costId];
      if (!cost) return total;
      return total + (cost.pricePerUnit * update.quantity);
    }, 0);
    
    // Prepare updates
    const updates: Record<string, any> = {};
    
    // Only include costs with quantity > 0
    const validCosts = costUpdates.filter(c => c.quantity > 0);
    
    if (validCosts.length > 0) {
      updates[`productCosts/${productId}`] = validCosts;
    } else {
      // If no valid costs, remove the product costs entry
      updates[`productCosts/${productId}`] = null;
    }
    
    updates[`products/${productId}/fixedCost`] = newFixedCost;
    
    // Execute batch update
    await update(ref(database), updates);
  } catch (error) {
    console.error('Error updating product costs:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Error al actualizar los costos del producto');
  }
}