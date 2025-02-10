import React, { useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import DateSelector from '../components/DateSelector';
import { ProductionList } from '../components/ProductionList';
import { ProductionFilter } from '../components/ProductionFilter';
import { ProductFilter } from '../components/ProductFilter';
import { useProduction } from '../hooks/useProduction';
import { useProducerProducts } from '../hooks/useProducerProducts';
import { useProductionSelection } from '../hooks/useProductionSelection';
import { useCompletionPercentage } from '../hooks/useCompletionPercentage';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { Printer, CloudRain } from 'lucide-react';
import { ThermalPrintLayout } from '../components/ThermalPrintLayout';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSelected, setShowSelected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRainyDay, setIsRainyDay] = useState(false);
  const { productions, saveProduction, loading: productionsLoading } = useProduction(selectedDate);
  const { products: assignedProducts, loading: productsLoading } = useProducerProducts();
  const { selectedProducts, toggleProductSelection, isSelected } = useProductionSelection(selectedDate);
  const completionPercentage = useCompletionPercentage(productions);
  const { user } = useAuth();

  const loading = productionsLoading || productsLoading;

  const filteredProducts = assignedProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSelection = !showSelected || selectedProducts.has(product.id);
    return matchesSearch && matchesSelection;
  });

  const handlePrint = () => {
    if (selectedProducts.size === 0) return;

    const selectedProductsData = assignedProducts
      .filter(product => selectedProducts.has(product.id))
      .map(product => ({
        name: product.name,
        quantity: productions[product.id]?.quantity || 0
      }))
      .filter(product => product.quantity > 0);

    if (selectedProductsData.length === 0) {
      alert('No hay productos con cantidades especificadas para imprimir');
      return;
    }

    const printData = {
      producerName: user?.email || 'Productor',
      date: selectedDate.toISOString(),
      products: selectedProductsData
    };

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permita las ventanas emergentes para imprimir');
      return;
    }

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
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            }
          </script>
        </body>
      </html>
    `);

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
            <span className="hidden sm:inline">
              Imprimir {selectedProducts.size} producto{selectedProducts.size !== 1 ? 's' : ''}
            </span>
            <span className="sm:hidden">
              {selectedProducts.size}
            </span>
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <DateSelector 
          selectedDate={selectedDate} 
          onDateChange={setSelectedDate}
        />
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <ProductFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
          <div className="w-full sm:w-1/2 flex items-center gap-2">
            <div className="flex-1">
              <ProductionFilter
                showSelected={showSelected}
                onFilterChange={setShowSelected}
                selectedCount={selectedProducts.size}
                completionPercentage={completionPercentage}
              />
            </div>
            <label className="
              flex items-center
              p-2 rounded-lg
              bg-gray-50
              cursor-pointer
              transition-colors duration-200
              group
              hover:bg-blue-50
            ">
              <input
                type="checkbox"
                checked={isRainyDay}
                onChange={(e) => setIsRainyDay(e.target.checked)}
                className="
                  w-4 h-4
                  text-blue-500
                  border-gray-300 rounded
                  focus:ring-blue-400
                  mr-2
                "
              />
              <CloudRain className={`
                h-4 w-4
                transition-colors duration-200
                ${isRainyDay ? 'text-blue-500' : 'text-gray-400'}
                group-hover:text-blue-500
              `} />
            </label>
          </div>
        </div>
        
        <ProductionList
          products={filteredProducts}
          onSave={saveProduction}
          loading={productionsLoading}
          initialProductions={productions}
          selectedProducts={selectedProducts}
          onToggleProductSelection={toggleProductSelection}
          isProductSelected={isSelected}
          showSelected={showSelected}
          isRainyDay={isRainyDay}
        />
      </div>
    </div>
  );
}