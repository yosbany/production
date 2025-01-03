import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProductionStat } from '../types/stats';
import { LoadingState } from './ui/LoadingState';
import { EmptyState } from './ui/EmptyState';

interface ProductionStatsProps {
  stats: ProductionStat[];
  loading: boolean;
}

export default function ProductionStats({ stats, loading }: ProductionStatsProps) {
  if (loading) {
    return <LoadingState message="Cargando estadísticas..." />;
  }

  if (!stats.length) {
    return <EmptyState message="No hay estadísticas disponibles" />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Resumen de Producción</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="productName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="totalQuantity" 
              name="Cantidad Total" 
              fill="#4F46E5" 
            />
            <Bar 
              dataKey="completedQuantity" 
              name="Cantidad Completada" 
              fill="#10B981" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}