import { ProductionListItem } from '../types/production';
import { getProducerById } from '../lib/firebase/producers';

export async function calculateProductionCosts(productions: any, products: any): Promise<ProductionListItem[]> {
  try {
    const productionsList: ProductionListItem[] = [];

    // Process each date's productions
    for (const [dateKey, dateProductions] of Object.entries(productions)) {
      // Process each producer's productions for this date
      for (const [producerId, userProductions] of Object.entries(dateProductions as object)) {
        let totalCost = 0;
        let totalSales = 0;
        let completedItems = 0;
        let totalItems = 0;

        // Calculate production costs and potential sales
        Object.entries(userProductions as object).forEach(([productId, production]: [string, any]) => {
          const product = products[productId];
          if (product && production.quantity) {
            const productCost = product.fixedCost * production.quantity;
            const productSales = product.salePrice * production.quantity;
            totalCost += productCost;
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

        const netIncome = totalSales - totalCost;
        const performance = calculatePerformance(netIncome, salaryCost);

        productionsList.push({
          id: producerId,
          date: dateKey,
          producerId,
          producerName: producer?.name || 'Productor Desconocido',
          totalCost,
          totalSales,
          salaryCost,
          netIncome,
          status: completionPercentage === 100 ? 'completed' : 'in-progress',
          completionPercentage,
          performance,
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

function calculatePerformance(netIncome: number, salaryCost: number): number {
  if (salaryCost === 0) return 0;
  return Math.round(((netIncome - salaryCost) / salaryCost) * 100);
}