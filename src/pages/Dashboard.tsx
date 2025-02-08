import React, { useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import DateSelector from '../components/DateSelector';
import { ProductionList } from '../components/ProductionList';
import { ProductionFilter } from '../components/ProductionFilter';
import { useProduction } from '../hooks/useProduction';
import { useProducerProducts } from '../hooks/useProducerProducts';
import { useProductionSelection } from '../hooks/useProductionSelection';
import { useCompletionPercentage } from '../hooks/useCompletionPercentage';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { Printer } from 'lucide-react';
import { ThermalPrintLayout } from '../components/ThermalPrintLayout';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSelected, setShowSelected] = useState(false);
  const { productions, saveProduction, loading: productionsLoading } = useProduction(selectedDate);
  const { products: assignedProducts, loading: productsLoading } = useProducerProducts();
  const { selectedProducts, toggleProductSelection, isSelected } = useProductionSelection(selectedDate);
  const completionPercentage = useCompletionPercentage(productions);
  const { user } = useAuth();

  const loading = productionsLoading || productsLoading;

  const displayProducts = showSelected 
    ? assignedProducts.filter(product => selectedProducts.has(product.id))
    : assignedProducts;

  const handlePrint = () => {
    // Solo imprimir si hay productos seleccionados
    if (selectedProducts.size === 0) return;

    // Preparar datos para impresión
    const selectedProductsData = assignedProducts
      .filter(product => selectedProducts.has(product.id))
      .map(product => ({
        name: product.name,
        quantity: productions[product.id]?.quantity || 0
      }))
      .filter(product => product.quantity > 0); // Solo productos con cantidad > 0

    if (selectedProductsData.length === 0) {
      alert('No hay productos con cantidades especificadas para imprimir');
      return;
    }

    const printData = {
      producerName: user?.email || 'Productor',
      date: selectedDate.toISOString(),
      products: selectedProductsData
    };

    // Crear una nueva ventana para la impresión
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permita las ventanas emergentes para imprimir');
      return;
    }

    // Escribir el contenido HTML en la nueva ventana
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Producción - ${printData.producerName}</title>
          <meta charset="UTF-8">
        </head>
        <body>
          <div id="print-root">
            ${ReactDOMServer.renderToString(<ThermalPrintLayout {...printData} />)}
          </div>
          <script>
            // Imprimir automáticamente cuando la página esté cargada
            window.onload = () => {
              window.print();
              // Cerrar la ventana después de imprimir
              window.onafterprint = () => window.close();
            }
          </script>
        </body>
      </html>
    `);

    // Cerrar el documento
    printWindow.document.close();
  };

  if (loading) {
    return <LoadingState message="Cargando datos..." />;
  }

  if (!assignedProducts.length) {
    return <EmptyState message="No tienes productos asignados para producción" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Registro de Producción</h1>
        
        {selectedProducts.size > 0 && (
          <button
            onClick={handlePrint}
            className="
              inline-flex items-center px-4 py-2
              bg-indigo-600 hover:bg-indigo-700
              text-white font-medium text-sm
              rounded-lg shadow-sm
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed
              group
            "
            title="Imprimir productos seleccionados"
          >
            <Printer className="h-4 w-4 mr-2 group-hover:animate-pulse" />
            <span>
              Imprimir {selectedProducts.size} producto{selectedProducts.size !== 1 ? 's' : ''}
            </span>
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <DateSelector 
          selectedDate={selectedDate} 
          onDateChange={setSelectedDate}
        />
        
        <ProductionFilter
          showSelected={showSelected}
          onFilterChange={setShowSelected}
          selectedCount={selectedProducts.size}
          completionPercentage={completionPercentage}
        />
        
        <ProductionList
          products={displayProducts}
          onSave={saveProduction}
          loading={productionsLoading}
          initialProductions={productions}
          selectedProducts={selectedProducts}
          onToggleProductSelection={toggleProductSelection}
          isProductSelected={isSelected}
          showSelected={showSelected}
        />
      </div>
    </div>
  );
}