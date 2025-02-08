export interface Production {
  quantity: number;
  completed: boolean;
  selected?: boolean;
}

export interface ProductionListItem {
  id: string;
  date: string;
  producerId: string;
  producerName: string;
  totalSales: number;
  salaryCost: number;
  wastePercentage: number;
  wasteQuantity: number;
  effectiveQuantity: number;
  status: 'completed' | 'in-progress';
  completionPercentage: number;
  laborCostPercentage: number;
  productions: Record<string, Production>;
}