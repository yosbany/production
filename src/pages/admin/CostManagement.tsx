import React, { useState } from 'react';
import { useCosts } from '../../hooks/useCosts';
import { CostsList } from '../../components/costs/CostsList';
import { CostModal } from '../../components/costs/CostModal';
import { DeleteCostModal } from '../../components/costs/DeleteCostModal';
import { Plus } from 'lucide-react';
import { LoadingState } from '../../components/ui/LoadingState';
import { Cost } from '../../types/costs';

export default function CostManagement() {
  const { costs, loading, error, addCost, updateCostPrice, deleteCost } = useCosts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<Cost | null>(null);
  const [deletingCost, setDeletingCost] = useState<Cost | null>(null);

  const handleEdit = (cost: Cost) => {
    setEditingCost(cost);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCost(null);
    setIsModalOpen(true);
  };

  const handleDelete = (cost: Cost) => {
    setDeletingCost(cost);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data: { name: string; unit: string; pricePerUnit: number }) => {
    if (editingCost) {
      await updateCostPrice(editingCost.id, data.pricePerUnit);
    } else {
      await addCost(data);
    }
    setIsModalOpen(false);
    setEditingCost(null);
  };

  if (loading) {
    return <LoadingState message="Cargando costos..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-900">
          Lista de Costos Registrados
        </h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Costo
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <CostsList
          costs={costs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <CostModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCost(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingCost}
      />

      <DeleteCostModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingCost(null);
        }}
        onConfirm={() => deletingCost && deleteCost(deletingCost.id)}
        costName={deletingCost?.name || ''}
      />
    </div>
  );
}