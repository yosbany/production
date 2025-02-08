import { ProductionListItem } from '../types/production';
import { getProducerById } from '../lib/firebase/producers';

const WASTE_PERCENTAGE = 10; // 10% de merma

export async function calculateProductionCosts(productions: any, products: any): Promise<ProductionListItem[]> {
  try {
    const productionsList: ProductionListItem[] = [];

    // Process each date's productions
    for (const [dateKey, dateProductions] of Object.entries(productions)) {
      // Process each producer's productions for this date
      for (const [producerId, userProductions] of Object.entries(dateProductions as object)) {
        let totalQuantity = 0;
        let totalSales = 0;
        let completedItems = 0;
        let totalItems = 0;

        // Calculate potential sales
        Object.entries(userProductions as object).forEach(([productId, production]: [string, any]) => {
          const product = products[productId];
          if (product && production.quantity) {
            totalQuantity += production.quantity;
            const effectiveQuantity = Math.floor(production.quantity * (1 - WASTE_PERCENTAGE / 100));
            const productSales = product.salePrice * effectiveQuantity;
            totalSales += productSales;
            totalItems++;
            if (production.completed) {
              completedItems++;
            }
          }
        });

        const producer = await getProducerById(producerId);
        const salaryCost = producer?.salaryCost || 0;
        
        const completionPercentage = totalItems > 0 
          ? Math.round((completedItems / totalItems) * 100) 
          : 0;

        // Calcular el porcentaje de costo laboral sobre las ventas netas
        const laborCostPercentage = totalSales > 0 
          ? Math.round((salaryCost / totalSales) * 100) 
          : 0;

        const wasteQuantity = Math.floor(totalQuantity * (WASTE_PERCENTAGE / 100));
        const effectiveQuantity = totalQuantity - wasteQuantity;

        productionsList.push({
          id: producerId,
          date: dateKey,
          producerId,
          producerName: producer?.name || 'Productor Desconocido',
          totalSales, // Este valor ya considera la merma
          salaryCost,
          wastePercentage: WASTE_PERCENTAGE,
          wasteQuantity,
          effectiveQuantity,
          status: completionPercentage === 100 ? 'completed' : 'in-progress',
          completionPercentage,
          laborCostPercentage,
          productions: userProductions as Record<string, { quantity: number; completed: boolean }>
        });
      }
    }

    return productionsList;
  } catch (error) {
    console.error('Error calculating production costs:', error);
    return [];
  }
}