import React from 'react';
import { Product } from '../../types/product';
import { Producer } from '../../types/producer';
import { formatCurrency } from '../../utils/format';
import { Pencil, Trash2, History } from 'lucide-react';
import { useProductionHistory } from '../../hooks/useProductionHistory';

interface ProductListProps {
  products: Product[];
  producers: Producer[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export function ProductList({ 
  products, 
  producers,
  onEdit, 
  onDelete
}: ProductListProps) {
  const getProducerName = (producerId: string) => {
    return producers.find(p => p.id === producerId)?.name || 'Sin asignar';
  };

  const getProductHistory = (product: Product) => {
    const history = useProductionHistory(product.id, product.producerId);
    return history ? {
      average: history.averageQuantity,
      last: history.lastQuantity
    } : null;
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
              Precio Venta
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cantidad Deseada
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Histórico
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Productor
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => {
            const history = getProductHistory(product);
            return (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(product.salePrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.desiredQuantity || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <History className="h-4 w-4 text-gray-400" />
                    <div className="text-sm">
                      {history ? (
                        <div className="space-y-1">
                          <div className="text-gray-900">
                            Promedio: <span className="font-medium">{history.average}</span>
                          </div>
                          {history.last !== null && (
                            <div className="text-gray-500">
                              Última: <span className="font-medium">{history.last}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">Sin datos</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {getProducerName(product.producerId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
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