import React, { useState } from 'react';
import { ProductionListItem } from '../../types/production';
import { formatDate, formatCurrency } from '../../utils/format';
import { ChevronRight, ShoppingCart, PiggyBank, Edit, AlertTriangle, TrendingUp, Trash2, Printer } from 'lucide-react';
import { ProductionDetailsModal } from '../modals/ProductionDetailsModal';
import { EditProductionModal } from '../modals/EditProductionModal';
import { DeleteConfirmationModal } from '../modals/DeleteConfirmationModal';
import { useProductionDetails } from '../../hooks/useProductionDetails';
import { handlePrintProduction } from '../../utils/print';

interface ProductionCardProps {
  production: ProductionListItem;
  onEdit: (production: ProductionListItem) => Promise<void>;
  onDelete: (production: ProductionListItem) => Promise<void>;
}

export function ProductionCard({ production, onEdit, onDelete }: ProductionCardProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { products, loading } = useProductionDetails(production.date, production.producerId);

  const handlePrint = () => {
    const printData = {
      producerName: production.producerName,
      date: production.date,
      products: Object.entries(production.productions)
        .filter(([_, data]) => data.quantity > 0)
        .map(([productId, data]) => ({
          name: products.find(p => p.id === productId)?.name || '',
          quantity: data.quantity
        }))
    };

    handlePrintProduction(printData);
  };

  const getLaborCostColor = (percentage: number) => {
    if (percentage <= 20) return 'text-green-500';
    if (percentage <= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getLaborCostTooltip = (percentage: number) => {
    if (percentage <= 20) {
      return 'Excelente: El costo laboral está por debajo del 20% de las ventas netas';
    }
    if (percentage <= 30) {
      return 'Aceptable: El costo laboral está entre 20% y 30% de las ventas netas';
    }
    return 'Alto: El costo laboral supera el 30% de las ventas netas - Requiere atención';
  };

  const getSalesRatioColor = (ratio: number) => {
    if (ratio >= 5) return 'text-green-500';
    if (ratio >= 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSalesRatioTooltip = (ratio: number) => {
    if (ratio >= 5) {
      return 'Excelente: Las ventas son 5 o más veces el salario';
    }
    if (ratio >= 3) {
      return 'Aceptable: Las ventas son entre 3 y 5 veces el salario';
    }
    return 'Bajo: Las ventas son menos de 3 veces el salario - Requiere atención';
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

  // Calcular ratio de ventas por salario
  const salesRatio = production.salaryCost > 0 
    ? Number((production.totalSales / production.salaryCost).toFixed(2))
    : 0;

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
        <div className="space-y-4">
          {/* Header */}
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
                onClick={handlePrint}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title="Imprimir producción"
              >
                <Printer className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Eliminar producción"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
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

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Venta Neta */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Venta Neta</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(production.totalSales)}
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

            {/* Costo Laboral */}
            <div className="group relative">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Costo Laboral</p>
                  <p className={`text-sm font-semibold ${getLaborCostColor(production.laborCostPercentage)}`}>
                    {production.laborCostPercentage}%
                  </p>
                </div>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="text-center">
                  {getLaborCostTooltip(production.laborCostPercentage)}
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
              </div>
            </div>

            {/* Ratio Ventas/Salario */}
            <div className="group relative">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ratio V/S</p>
                  <p className={`text-sm font-semibold ${getSalesRatioColor(salesRatio)}`}>
                    {salesRatio}x
                  </p>
                </div>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="text-center">
                  {getSalesRatioTooltip(salesRatio)}
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
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
        laborCostPercentage={production.laborCostPercentage}
        wastePercentage={production.wastePercentage}
        salesRatio={salesRatio}
      />

      <EditProductionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        production={production}
        products={products}
        onSave={onEdit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => onDelete(production)}
        itemName={`producción de ${production.producerName} del ${formatDate(production.date)}`}
      />
    </>
  );
}