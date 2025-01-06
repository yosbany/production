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
  totalCost: number;
  totalSales: number;
  salaryCost: number;
  netIncome: number;
  status: 'completed' | 'in-progress';
  completionPercentage: number;
  performance: number;
  productions: Record<string, Production>;
}