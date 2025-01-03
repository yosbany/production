export interface ProductionListItem {
  id: string;
  date: string;
  producerId: string;
  producerName: string;
  totalCost: number;
  totalSales: number;
  salaryCost: number;
  netIncome: number;
  status: 'completed' | 'in-progress';
  completionPercentage: number;
  performance: number;
  productions: Record<string, {
    quantity: number;
    completed: boolean;
  }>;
}

export interface ProductionCost {
  id: string;
  date: string;
  producerId: string;
  producerName: string;
  totalCost: number;
  salaryCost: number;
  efficiency: number;
  products: {
    [productId: string]: {
      quantity: number;
      completed: boolean;
      cost: number;
    }
  }
}