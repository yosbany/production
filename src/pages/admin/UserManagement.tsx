import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { User } from '../../types/user';
import { UserModal } from '../../components/modals/UserModal';
import { UserList } from '../../components/admin/UserList';

export default function UserManagement() {
  const { users, loading, error: apiError, createUser, updateUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: any) => {
    setError(null);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la operación');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-pulse text-gray-500">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Gestión de Productores
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Productor
        </button>
      </div>

      {(error || apiError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || apiError}
        </div>
      )}

      <UserList
        users={users}
        onEdit={(user) => {
          setEditingUser(user);
          setIsModalOpen(true);
        }}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          setError(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingUser}
      />
    </div>
  );
}