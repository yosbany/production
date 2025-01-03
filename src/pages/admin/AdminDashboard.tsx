import React from 'react';
import ProductManagement from './ProductManagement';
import ProductionManagement from './ProductionManagement';
import { Tabs } from '../../components/ui/Tabs';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = React.useState('productions');

  const tabs = [
    { id: 'productions', label: 'Producciones' },
    { id: 'products', label: 'Gestión de Productos' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Panel de Administración
        </h1>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      
      <div className="mt-6">
        {activeTab === 'productions' ? (
          <ProductionManagement />
        ) : (
          <ProductManagement />
        )}
      </div>
    </div>
  );
}