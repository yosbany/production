import React, { useState } from 'react';
import { ProductionListItem } from '../../types/production';
import { formatDate, formatCurrency } from '../../utils/format';
import { TrendingUp, DollarSign, Percent, ChevronRight, ShoppingCart, PiggyBank, Edit } from 'lucide-react';
import { ProductionDetailsModal } from '../modals/ProductionDetailsModal';
import { EditProductionModal } from '../modals/EditProductionModal';
import { useProductionDetails } from '../../hooks/useProductionDetails';

interface ProductionCardProps {
  production: ProductionListItem;
  onEdit: (production: ProductionListItem) => Promise<void>;
}

export function ProductionCard({ production, onEdit }: ProductionCardProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { products, loading } = useProductionDetails(production.date, production.producerId);

  const getPerformanceColor = (performance: number) => {
    if (performance >= 50) return 'text-green-500';
    if (performance >= 25) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {production.producerName}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDate(production.date)}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEditClick}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title="Editar producción"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsDetailsModalOpen(true)}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title="Ver detalles"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Progreso
              </span>
              <span className="text-sm font-medium text-gray-900">
                {production.completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(production.completionPercentage)}`}
                style={{ width: `${production.completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Costo */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Costo</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(production.totalCost)}
                </p>
              </div>
            </div>

            {/* Venta */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Venta</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(production.totalSales)}
                </p>
              </div>
            </div>

            {/* Margen */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Margen</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(production.netIncome)}
                </p>
              </div>
            </div>

            {/* Salario */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <PiggyBank className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Salario</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(production.salaryCost)}
                </p>
              </div>
            </div>

            {/* Rendimiento */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Percent className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rendimiento</p>
                <p className={`text-sm font-semibold ${getPerformanceColor(production.performance)}`}>
                  {production.performance}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        producerName={production.producerName}
        products={products}
        salaryCost={production.salaryCost}
        netIncome={production.netIncome}
        performance={production.performance}
      />

      <EditProductionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        production={production}
        products={products}
        onSave={onEdit}
      />
    </>
  );
}