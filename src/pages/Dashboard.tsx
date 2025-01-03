import React, { useState } from 'react';
import DateSelector from '../components/DateSelector';
import { ProductionList } from '../components/ProductionList';
import { useProduction } from '../hooks/useProduction';
import { useProducerProducts } from '../hooks/useProducerProducts';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { productions, saveProduction, loading: productionsLoading } = useProduction(selectedDate);
  const { products: assignedProducts, loading: productsLoading } = useProducerProducts();

  const loading = productionsLoading || productsLoading;

  if (loading) {
    return <LoadingState message="Cargando datos..." />;
  }

  if (!assignedProducts.length) {
    return <EmptyState message="No tienes productos asignados para producción" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Registro de Producción</h1>
      
      <div className="space-y-6">
        <DateSelector 
          selectedDate={selectedDate} 
          onDateChange={setSelectedDate}
        />
        
        <ProductionList
          products={assignedProducts}
          onSave={saveProduction}
          loading={productionsLoading}
          initialProductions={productions}
        />
      </div>
    </div>
  );
}