import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ProductList } from '../../components/admin/ProductList';
import { ProductModal } from '../../components/modals/ProductModal';
import { DeleteConfirmationModal } from '../../components/modals/DeleteConfirmationModal';
import { useProducts } from '../../hooks/useProducts';
import { useProducers } from '../../hooks/useProducers';
import { Product, ProductInput } from '../../types/product';
import { Tabs } from '../../components/ui/Tabs';

export default function ProductManagement() {
  const { products, loading: productsLoading, createProduct, updateProduct, deleteProduct } = useProducts();
  const { producers, loading: producersLoading } = useProducers();
  const [activeTab, setActiveTab] = useState('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProduct = async (productData: ProductInput) => {
    setLoading(true);
    setError(null);
    try {
      await createProduct(productData);
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (productData: ProductInput) => {
    if (!editingProduct) return;
    
    setLoading(true);
    setError(null);
    try {
      await updateProduct(editingProduct.id, productData);
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el producto');
    } finally {
      setLoading(false);
      setEditingProduct(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    
    setLoading(true);
    setError(null);
    try {
      await deleteProduct(deletingProduct.id);
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el producto');
    } finally {
      setLoading(false);
      setDeletingProduct(null);
    }
  };

  const tabs = [
    { id: 'list', label: 'Lista de Productos' },
    { id: 'assignments', label: 'Asignaciones' }
  ];

  if (productsLoading || producersLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Gestión de Productos</h2>
        {activeTab === 'list' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </button>
        )}
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {activeTab === 'list' ? (
        <ProductList
          products={products}
          producers={producers}
          onEdit={(product) => {
            setEditingProduct(product);
            setIsModalOpen(true);
          }}
          onDelete={(productId) => {
            setDeletingProduct(products.find(p => p.id === productId) || null);
            setIsDeleteModalOpen(true);
          }}
        />
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productos Asignados
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {producers.map((producer) => {
                const assignedProducts = products.filter(p => p.producerId === producer.id);
                return (
                  <tr key={producer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {producer.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        {assignedProducts.map(product => (
                          <li key={product.id}>{product.name}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
          setError(null);
        }}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        initialData={editingProduct}
        loading={loading}
        producers={producers}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingProduct(null);
          setError(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={loading}
        itemName={deletingProduct?.name || ''}
      />
    </div>
  );
}