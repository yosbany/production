import React, { useState } from 'react';
import { ProductionList } from '../../components/admin/ProductionList';
import { useProductionList } from '../../hooks/useProductionList';
import { useProducers } from '../../hooks/useProducers';
import { useProducts } from '../../hooks/useProducts';
import { NewProductionModal } from '../../components/modals/NewProductionModal';
import { NewProductionButton } from '../../components/admin/NewProductionButton';
import { ref, set } from 'firebase/database';
import { database } from '../../lib/firebase';
import { ProductionListItem } from '../../types/production';
import { checkDuplicateProduction } from '../../utils/production/validation';

export default function ProductionManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { productions, loading: productionsLoading } = useProductionList();
  const { producers, loading: producersLoading } = useProducers();
  const { products, loading: productsLoading } = useProducts();

  const handleCreateProduction = async (data: {
    producerId: string;
    date: Date;
    productions: Record<string, { quantity: number; completed: boolean }>;
  }) => {
    setSaving(true);
    setError(null);
    
    try {
      const dateString = data.date.toISOString().split('T')[0];
      
      // Check for duplicate production
      const isDuplicate = await checkDuplicateProduction(dateString, data.producerId);
      if (isDuplicate) {
        throw new Error('Ya existe una producción para este productor en la fecha seleccionada');
      }

      const productionRef = ref(database, `productions/${dateString}/${data.producerId}`);
      await set(productionRef, data.productions);
      setIsModalOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al crear la producción');
      console.error('Error creating production:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditProduction = async (production: ProductionListItem) => {
    setSaving(true);
    setError(null);
    
    try {
      const productionRef = ref(
        database, 
        `productions/${production.date}/${production.producerId}`
      );
      await set(productionRef, production.productions);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar la producción');
      console.error('Error updating production:', error);
    } finally {
      setSaving(false);
    }
  };

  const loading = productionsLoading || producersLoading || productsLoading;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Gestión de Producción
        </h2>
        <NewProductionButton onClick={() => setIsModalOpen(true)} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <ProductionList 
        productions={productions}
        loading={loading}
        onEdit={handleEditProduction}
      />

      <NewProductionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProduction}
        producers={producers}
        products={products}
        loading={saving}
        error={error}
      />
    </div>
  );
}