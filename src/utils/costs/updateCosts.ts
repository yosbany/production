import { ref, get, update } from 'firebase/database';
import { database } from '../../lib/firebase';
import { validateCostUpdate } from './validation';
import { getProductsUsingCost, recalculateProductCosts } from './calculations';

export async function updateProductCostsOnPriceChange(
  costId: string, 
  newPrice: number
): Promise<void> {
  // Validate new price
  const error = validateCostUpdate(newPrice);
  if (error) throw new Error(error);

  try {
    // Get products using this cost
    const affectedProductIds = await getProductsUsingCost(costId);
    if (affectedProductIds.length === 0) {
      // If no products use this cost, just update the cost price
      const costRef = ref(database, `costs/${costId}`);
      await update(costRef, { pricePerUnit: newPrice });
      return;
    }

    // Get current costs data
    const costsRef = ref(database, 'costs');
    const costsSnapshot = await get(costsRef);
    if (!costsSnapshot.exists()) {
      throw new Error('No se encontraron los costos base');
    }

    const costs = Object.entries(costsSnapshot.val())
      .map(([id, data]: [string, any]) => ({
        id,
        ...data,
        pricePerUnit: id === costId ? newPrice : data.pricePerUnit
      }));

    // Prepare batch updates
    const updates: Record<string, any> = {
      [`costs/${costId}/pricePerUnit`]: newPrice
    };

    // Recalculate costs for each affected product
    await Promise.all(
      affectedProductIds.map(async (productId) => {
        const newTotalCost = await recalculateProductCosts(productId, costs);
        updates[`products/${productId}/fixedCost`] = newTotalCost;
      })
    );

    // Execute batch update
    await update(ref(database), updates);
  } catch (error) {
    console.error('Error updating product costs:', error);
    throw new Error('No se pudieron actualizar los costos de los productos');
  }
}