import React, { useState } from 'react';
import DateSelector from '../components/DateSelector';
import { ProductionList } from '../components/ProductionList';
import { ProductionFilter } from '../components/ProductionFilter';
import { useProduction } from '../hooks/useProduction';
import { useProducerProducts } from '../hooks/useProducerProducts';
import { useProductSelection } from '../hooks/useProductSelection';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNonZero, setShowNonZero] = useState(false);
  const { productions, saveProduction, loading: productionsLoading } = useProduction(selectedDate);
  const { products: assignedProducts, loading: productsLoading } = useProducerProducts();
  const { selectedProducts, toggleProductSelection, isSelected } = useProductSelection();

  const loading = productionsLoading || productsLoading;

  const filteredProducts = assignedProducts.filter(product => {
    if (showNonZero) {
      const production = productions[product.id];
      return selectedProducts.has(product.id) && (!production || production.quantity > 0);
    }
    return selectedProducts.has(product.id);
  });

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
          showNonZero={showNonZero}
          onFilterChange={setShowNonZero}
        />
        
        <ProductionList
          products={assignedProducts}
          onSave={saveProduction}
          loading={productionsLoading}
          initialProductions={productions}
          selectedProducts={selectedProducts}
          onToggleProductSelection={toggleProductSelection}
          isProductSelected={isSelected}
          showSelected={showNonZero}
        />
      </div>
    </div>
  );
}