import React from 'react';
import { Cost } from '../../types/costs';
import { formatCurrency } from '../../utils/format';
import { DollarSign, TrendingUp } from 'lucide-react';

interface ProductCostSummaryProps {
  costs: Cost[];
  salePrice: number;
}

export function ProductCostSummary({ costs, salePrice }: ProductCostSummaryProps) {
  const totalCost = costs.reduce((sum, cost) => 
    sum + (cost.pricePerUnit * (cost.quantity || 0)), 0
  );

  const grossProfit = salePrice - totalCost;
  const margin = salePrice > 0 ? (grossProfit / salePrice) * 100 : 0;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-1">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Costo Total</span>
        </div>
        <span className="text-xl font-semibold text-gray-900">
          {formatCurrency(totalCost)}
        </span>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-1">
          <TrendingUp className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Margen Bruto</span>
        </div>
        <span className={`text-xl font-semibold ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {margin.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}