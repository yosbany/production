import React, { useState } from 'react';
import DateSelector from '../components/DateSelector';
import { ProductionList } from '../components/ProductionList';
import { ProductionFilter } from '../components/ProductionFilter';
import { useProduction } from '../hooks/useProduction';
import { useProducerProducts } from '../hooks/useProducerProducts';
import { useProductionSelection } from '../hooks/useProductionSelection';
import { useCompletionPercentage } from '../hooks/useCompletionPercentage';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSelected, setShowSelected] = useState(false);
  const { productions, saveProduction, loading: productionsLoading } = useProduction(selectedDate);
  const { products: assignedProducts, loading: productsLoading } = useProducerProducts();
  const { selectedProducts, toggleProductSelection, isSelected } = useProductionSelection(selectedDate);
  const completionPercentage = useCompletionPercentage(productions);

  const loading = productionsLoading || productsLoading;

  const displayProducts = showSelected 
    ? assignedProducts.filter(product => selectedProducts.has(product.id))
    : assignedProducts;

  if (loading) {
    return <LoadingState message="Cargando datos..." />;
  }

  if (!assignedProducts.length) {
    return <EmptyState message="No tienes productos asignados para producción" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Registro de Producción</h1>
      
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