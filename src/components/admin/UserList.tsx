import React from 'react';
import { User } from '../../types/user';
import { Pencil } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { useProductionList } from '../../hooks/useProductionList';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
}

export function UserList({ users, onEdit }: UserListProps) {
  const { productions } = useProductionList();

  // Calculate average labor cost percentage for each producer
  const averageLaborCosts = users.reduce((acc, user) => {
    const producerProductions = productions.filter(
      p => p.producerId === user.id && p.status === 'completed'
    );
    
    if (producerProductions.length === 0) {
      acc[user.id] = null;
      return acc;
    }

    const totalLaborCostPercentage = producerProductions.reduce(
      (sum, p) => sum + p.laborCostPercentage, 
      0
    );
    
    acc[user.id] = Math.round(totalLaborCostPercentage / producerProductions.length);
    return acc;
  }, {} as Record<string, number | null>);

  const getLaborCostColor = (percentage: number | null) => {
    if (percentage === null) return 'text-gray-400';
    if (percentage <= 20) return 'text-green-600';
    if (percentage <= 35) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rol
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Salario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Costo Laboral Promedio
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => {
            const avgLaborCost = averageLaborCosts[user.id];
            const laborCostColor = getLaborCostColor(avgLaborCost);
            
            return (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.role === 'admin' ? 'Administrador' : 'Productor'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.role === 'producer' && user.salaryCost 
                    ? formatCurrency(user.salaryCost)
                    : '-'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${laborCostColor}`}>
                    {avgLaborCost !== null 
                      ? `${avgLaborCost}%`
                      : 'Sin datos'
                    }
                  </div>
                  {avgLaborCost !== null && (
                    <div className="text-xs text-gray-500">
                      sobre ventas netas
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Editar usuario"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}