import React, { useState } from 'react';
import { ProductList } from '../../components/admin/ProductList';
import { ProductModal } from '../../components/modals/ProductModal';
import { DeleteConfirmationModal } from '../../components/modals/DeleteConfirmationModal';
import { createProduct, updateProduct, deleteProduct } from '../../lib/firebase/products';
import { useProducts } from '../../hooks/useProducts';
import { useProducers } from '../../hooks/useProducers';
import { Product } from '../../types/product';
import { Plus } from 'lucide-react';

export default function ProductManagement() {
  const { products, loading: productsLoading } = useProducts();
  const { producers, loading: producersLoading } = useProducers();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const handleCreateProduct = async (productData: Omit<Product, 'id'>) => {
    setLoading(true);
    try {
      await createProduct(productData);
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleUpdateProduct = async (productData: Omit<Product, 'id'>) => {
    if (!editingProduct) return;
    
    setLoading(true);
    try {
      await updateProduct(editingProduct.id, productData);
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
      setEditingProduct(null);
      setIsModalOpen(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setDeletingProduct(products.find(p => p.id === productId) || null);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    
    setLoading(true);
    try {
      await deleteProduct(deletingProduct.id);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoading(false);
      setDeletingProduct(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  if (productsLoading || producersLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Gestión de Productos</h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </button>
      </div>

      <ProductList
        products={products}
        producers={producers}
        onEdit={handleEdit}
        onDelete={handleDeleteProduct}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        initialData={editingProduct || undefined}
        loading={loading}
        producers={producers}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        loading={loading}
        itemName={deletingProduct?.name || ''}
      />
    </div>
  );
}