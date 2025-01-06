import React, { useState, useEffect } from 'react';
import { X, TrendingUp, DollarSign } from 'lucide-react';
import { Product } from '../../types/product';
import { Producer } from '../../types/producer';
import { FormInput } from '../ui/FormInput';
import { formatCurrency, formatPercentage } from '../../utils/format';
import { CostManagementModal } from '../costs/CostManagementModal';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id'>) => Promise<void>;
  initialData?: Product;
  loading?: boolean;
  producers: Producer[];
}

const defaultFormData: Omit<Product, 'id'> = {
  name: '',
  fixedCost: 0,
  salePrice: 0,
  producerId: '',
  procedure: ''
};

export function ProductModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  loading,
  producers
}: ProductModalProps) {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>(defaultFormData);
  const [showCostModal, setShowCostModal] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        fixedCost: initialData.fixedCost,
        salePrice: initialData.salePrice,
        producerId: initialData.producerId,
        procedure: initialData.procedure || ''
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData, isOpen]);

  const calculateGrossMargin = (): number => {
    if (formData.salePrice === 0) return 0;
    return ((formData.salePrice - formData.fixedCost) / formData.salePrice) * 100;
  };

  const handleCostsUpdated = (totalCost: number) => {
    setFormData(prev => ({ ...prev, fixedCost: totalCost }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">
              {initialData ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-4 space-y-4">
            <FormInput
              label="Nombre del Producto"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Procedimiento de Elaboración
              </label>
              <textarea
                value={formData.procedure}
                onChange={(e) => setFormData(prev => ({ ...prev, procedure: e.target.value }))}
                rows={4}
                className="
                  w-full px-3 py-2 
                  border-2 border-gray-300 
                  rounded-md shadow-sm 
                  bg-white
                  text-gray-900
                  placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  hover:border-gray-400
                  transition-colors
                "
                placeholder="Describa el procedimiento de elaboración del producto..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Costos
              </label>
              <button
                type="button"
                onClick={() => setShowCostModal(true)}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 border rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-900 font-medium">
                    {formatCurrency(formData.fixedCost)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  Gestionar costos
                </span>
              </button>
            </div>

            <FormInput
              label="Precio de Venta"
              type="number"
              value={formData.salePrice}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                salePrice: Number(e.target.value) 
              }))}
              min="0"
              step="0.01"
              required
            />

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Margen Bruto</span>
                </div>
                <span className={`text-sm font-bold ${calculateGrossMargin() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(calculateGrossMargin())}
                </span>
              </div>
            </div>

            <FormInput
              label="Productor Asignado"
              type="select"
              value={formData.producerId}
              onChange={(e) => setFormData(prev => ({ ...prev, producerId: e.target.value }))}
              required
              options={[
                { value: '', label: 'Seleccionar Productor' },
                ...producers.map(p => ({ 
                  value: p.id, 
                  label: p.name 
                }))
              ]}
            />

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border-2 border-gray-300 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>

          {showCostModal && (
            <CostManagementModal
              isOpen={true}
              onClose={() => setShowCostModal(false)}
              productId={initialData?.id || ''}
              productName={formData.name}
              salePrice={formData.salePrice}
              onCostsUpdated={handleCostsUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
}