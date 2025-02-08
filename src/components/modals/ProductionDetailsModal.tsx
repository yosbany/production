import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { X, Package, CheckCircle, XCircle, Printer } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { ThermalPrintLayout } from '../ThermalPrintLayout';

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
  salaryCost: number;
  laborCostPercentage: number;
  wastePercentage: number;
}

export function ProductionDetailsModal({
  isOpen,
  onClose,
  producerName,
  products,
  salaryCost,
  laborCostPercentage,
  wastePercentage
}: ProductionDetailsModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Prepare print data
    const printData = {
      producerName,
      date: new Date().toISOString(),
      products: products.map(p => ({
        name: p.name,
        quantity: p.quantity
      }))
    };

    // Write print layout to new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Producción - ${producerName}</title>
        </head>
        <body>
          <div id="print-root"></div>
          <script>
            // Render immediately and print
            window.onload = () => {
              window.print();
              // Close after printing (optional)
              window.onafterprint = () => window.close();
            }
          </script>
        </body>
      </html>
    `);

    // Render the print layout
    const root = printWindow.document.getElementById('print-root');
    if (root) {
      root.innerHTML = ReactDOMServer.renderToString(
        <ThermalPrintLayout {...printData} />
      );
    }
  };

  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const completedQuantity = products.reduce((sum, p) => sum + (p.completed ? p.quantity : 0), 0);
  const completionPercentage = totalQuantity > 0 
    ? Math.round((completedQuantity / totalQuantity) * 100) 
    : 0;

  const totalSales = products.reduce((sum, p) => {
    const effectiveProductQuantity = Math.floor(p.quantity * (1 - wastePercentage / 100));
    return sum + (effectiveProductQuantity * p.salePrice);
  }, 0);

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

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-700 mb-2">Ventas Netas</h4>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalSales)}</p>
            </div>

            <div className="bg-amber-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-amber-700 mb-2">Merma</h4>
              <p className="text-2xl font-bold text-amber-900">{wastePercentage}%</p>
            </div>

            <div className={`rounded-lg p-4 ${
              laborCostPercentage <= 20 ? 'bg-green-50' :
              laborCostPercentage <= 35 ? 'bg-yellow-50' :
              'bg-red-50'
            }`}>
              <h4 className={`text-sm font-medium mb-2 ${
                laborCostPercentage <= 20 ? 'text-green-700' :
                laborCostPercentage <= 35 ? 'text-yellow-700' :
                'text-red-700'
              }`}>Costo Laboral</h4>
              <p className={`text-2xl font-bold ${
                laborCostPercentage <= 20 ? 'text-green-900' :
                laborCostPercentage <= 35 ? 'text-yellow-900' :
                'text-red-900'
              }`}>{laborCostPercentage}%</p>
              <p className={`text-sm ${
                laborCostPercentage <= 20 ? 'text-green-600' :
                laborCostPercentage <= 35 ? 'text-yellow-600' :
                'text-red-600'
              }`}>sobre ventas netas</p>
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
                    Precio Unitario
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => {
                  const subtotal = product.quantity * product.salePrice;
                  
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
                        {formatCurrency(product.salePrice)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        {formatCurrency(subtotal)}
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
                  <td colSpan={3} className="px-3 py-3 text-sm font-medium text-right text-gray-900">
                    Total Bruto:
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(products.reduce((sum, p) => sum + (p.quantity * p.salePrice), 0))}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer */}
          <div className="flex justify-between px-4 py-3 bg-gray-50 rounded-b-lg">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </button>
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