import React from 'react';
import { Trash2 } from 'lucide-react';
import { Cost } from '../../types/costs';
import { formatCurrency } from '../../utils/format';
import { EditableCostRow } from './EditableCostRow';

interface ProductCostListProps {
  costs: Cost[];
  onRemove: (costId: string) => void;
  onUpdateQuantity: (costId: string, quantity: number) => void;
}

export function ProductCostList({ 
  costs, 
  onRemove, 
  onUpdateQuantity 
}: ProductCostListProps) {
  if (!costs.length) {
    return (
      <div className="text-center py-6 text-gray-500">
        No hay costos asignados a este producto
      </div>
    );
  }

  const calculateTotal = (cost: Cost): number => {
    if (!cost.pricePerUnit || !cost.quantity) return 0;
    return cost.pricePerUnit * cost.quantity;
  };

  const totalCost = costs.reduce((sum, cost) => sum + calculateTotal(cost), 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Costo
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Cantidad
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Precio/Unidad
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Total
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {costs.map((cost) => (
            <tr key={cost.id} className="hover:bg-gray-50">
              <td className="px-3 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900">{cost.name}</span>
                <span className="text-sm text-gray-500 ml-1">({cost.unit})</span>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => onUpdateQuantity(cost.id, cost.quantity || 0)}
                  className="text-sm text-gray-900 hover:text-indigo-600"
                >
                  {cost.quantity || 0}
                </button>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                {formatCurrency(cost.pricePerUnit)}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                {formatCurrency(calculateTotal(cost))}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => onRemove(cost.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Eliminar costo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan={3} className="px-3 py-4 text-sm font-medium text-gray-900 text-right">
              Total
            </td>
            <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
              {formatCurrency(totalCost)}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}