import React from 'react';
import { ProductionListItem } from '../../types/production';
import { LoadingState } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';
import { AlertCircle, ClipboardCheck, ClipboardList } from 'lucide-react';
import { ProductionCard } from './ProductionCard';

interface ProductionListProps {
  productions: ProductionListItem[];
  loading: boolean;
  error?: string | null;
  onEdit: (production: ProductionListItem) => Promise<void>;
}

export function ProductionList({ 
  productions, 
  loading, 
  error,
  onEdit 
}: ProductionListProps) {
  if (loading) {
    return <LoadingState message="Cargando producciones..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!productions.length) {
    return <EmptyState message="No hay producciones registradas" />;
  }

  const inProgressProductions = productions.filter(p => p.status === 'in-progress');
  const completedProductions = productions.filter(p => p.status === 'completed');

  const getProductionKey = (production: ProductionListItem) => 
    `${production.producerId}-${production.date}`;

  return (
    <div className="space-y-8">
      {/* Producciones en Curso */}
      <section>
        <div className="flex items-center space-x-2 mb-4">
          <ClipboardList className="h-5 w-5 text-indigo-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Producciones en Curso
          </h2>
        </div>
        <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
          {inProgressProductions.map((production) => (
            <ProductionCard 
              key={getProductionKey(production)}
              production={production} 
              onEdit={onEdit}
            />
          ))}
          {inProgressProductions.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No hay producciones en curso
            </div>
          )}
        </div>
      </section>

      {/* Producciones Completadas */}
      <section>
        <div className="flex items-center space-x-2 mb-4">
          <ClipboardCheck className="h-5 w-5 text-green-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Producciones Completadas
          </h2>
        </div>
        <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
          {completedProductions.map((production) => (
            <ProductionCard 
              key={getProductionKey(production)}
              production={production}
              onEdit={onEdit}
            />
          ))}
          {completedProductions.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No hay producciones completadas
            </div>
          )}
        </div>
      </section>
    </div>
  );
}