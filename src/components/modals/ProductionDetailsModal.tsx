import React from 'react';
import { X, Package, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface ProductDetails {
  id: string;
  name: string;
  quantity: number;
  completed: boolean;
  cost: number;
  salePrice: number;
}

interface ProductionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  producerName: string;
  products: ProductDetails[];
}

export function ProductionDetailsModal({
  isOpen,
  onClose,
  producerName,
  products
}: ProductionDetailsModalProps) {
  if (!isOpen) return null;

  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const completedQuantity = products.reduce((sum, p) => sum + (p.completed ? p.quantity : 0), 0);
  const completionPercentage = totalQuantity > 0 
    ? Math.round((completedQuantity / totalQuantity) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Detalles de Producción
              </h3>
              <p className="text-sm text-gray-500">{producerName}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-4 py-3 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progreso Total
              </span>
              <span className="text-sm font-medium text-gray-900">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Products List */}
          <div className="p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo Total
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Venta Total
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos Netos
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => {
                  const totalCost = product.cost;
                  const totalSales = product.salePrice * product.quantity;
                  const netIncome = totalSales - totalCost;
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <Package className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                        {product.quantity}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(totalCost)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(totalSales)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-right text-sm">
                        <span className={netIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(netIncome)}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        {product.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500 inline" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300 inline" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={2} className="px-3 py-3 text-sm font-medium text-gray-900">
                    Totales
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(products.reduce((sum, p) => sum + p.cost, 0))}
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(products.reduce((sum, p) => sum + (p.salePrice * p.quantity), 0))}
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-medium">
                    {(() => {
                      const totalNet = products.reduce((sum, p) => 
                        sum + ((p.salePrice * p.quantity) - p.cost), 0);
                      return (
                        <span className={totalNet >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(totalNet)}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-3 py-3" />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer */}
          <div className="flex justify-end px-4 py-3 bg-gray-50 rounded-b-lg">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}