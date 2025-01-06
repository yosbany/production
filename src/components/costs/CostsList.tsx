import React from 'react';
import { Cost } from '../../types/costs';
import { formatCurrency } from '../../utils/format';
import { Pencil, Trash2 } from 'lucide-react';

interface CostsListProps {
  costs: Cost[];
  onEdit: (cost: Cost) => void;
  onDelete: (cost: Cost) => void;
}

export function CostsList({ 
  costs = [], 
  onEdit,
  onDelete
}: CostsListProps) {
  if (!costs.length) {
    return (
      <div className="text-center py-6 text-gray-500">
        No hay costos registrados
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Nombre
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Unidad
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Precio/Unidad
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {costs.map((cost) => (
            <tr key={cost.id} className="hover:bg-gray-50">
              <td className="px-3 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900">{cost.name}</span>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                {cost.unit}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-right">
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(cost.pricePerUnit)}
                </span>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(cost)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Editar costo"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(cost)}
                    className="text-red-600 hover:text-red-900"
                    title="Eliminar costo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}