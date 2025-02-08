import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserInfoProps {
  className?: string;
  compact?: boolean;
}

export function UserInfo({ className = '', compact = false }: UserInfoProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  if (compact) {
    return (
      <div className="relative group">
        <button
          onClick={logout}
          className="p-2 rounded-full text-white hover:bg-indigo-500 transition-colors"
          title="Cerrar Sesión"
        >
          <LogOut className="h-5 w-5" />
        </button>
        
        {/* Stylized Tooltip */}
        <div className="
          absolute right-0 top-full mt-2
          min-w-max py-2 px-3
          bg-white rounded-lg shadow-lg
          border border-gray-200
          transform-gpu
          transition-all duration-200 ease-out
          opacity-0 invisible translate-y-1
          group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
          z-50
        ">
          <div className="text-sm font-medium text-gray-900">{user.email}</div>
          <div className="text-xs text-gray-500 mt-1">Haga clic para cerrar sesión</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="mr-4">
        <div className="text-sm font-medium text-white">{user.email}</div>
      </div>
      <button
        onClick={logout}
        className="p-2 rounded-full text-white hover:bg-indigo-500 transition-colors"
        title="Cerrar Sesión"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  );
}