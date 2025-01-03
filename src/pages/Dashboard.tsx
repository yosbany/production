import React, { useState } from 'react';
import DateSelector from '../components/DateSelector';
import { ProductionList } from '../components/ProductionList';
import { ProductionFilter } from '../components/ProductionFilter';
import { useProduction } from '../hooks/useProduction';
import { useProducerProducts } from '../hooks/useProducerProducts';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNonZero, setShowNonZero] = useState(false);
  const { productions, saveProduction, loading: productionsLoading } = useProduction(selectedDate);
  const { products: assignedProducts, loading: productsLoading } = useProducerProducts();

  const loading = productionsLoading || productsLoading;

  const filteredProducts = showNonZero 
    ? assignedProducts.filter(product => {
        const production = productions[product.id];
        return production && production.quantity > 0;
      })
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
          showNonZero={showNonZero}
          onFilterChange={setShowNonZero}
        />
        
        {filteredProducts.length > 0 ? (
          <ProductionList
            products={filteredProducts}
            onSave={saveProduction}
            loading={productionsLoading}
            initialProductions={productions}
          />
        ) : (
          <EmptyState message={
            showNonZero 
              ? "No hay productos con cantidad mayor a cero" 
              : "No hay productos disponibles"
          } />
        )}
      </div>
    </div>
  );
}