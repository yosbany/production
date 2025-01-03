import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserInfoProps {
  className?: string;
}

export function UserInfo({ className = '' }: UserInfoProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-gray-700">{user.email}</span>
      <button
        onClick={logout}
        className="p-2 rounded-full text-gray-400 hover:bg-gray-100"
        title="Cerrar Sesión"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  );
}