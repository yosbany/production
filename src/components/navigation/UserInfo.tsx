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
          min-w-max py-1.5 px-3
          bg-gray-900/95 backdrop-blur-sm
          rounded-lg shadow-lg
          border border-gray-800
          text-sm text-white
          transform-gpu
          transition-all duration-200 ease-out
          opacity-0 invisible translate-y-1
          group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
        ">
          {/* Tooltip Arrow */}
          <div className="
            absolute -top-1.5 right-4
            w-3 h-3
            bg-gray-900/95
            border-t border-l border-gray-800
            transform rotate-45
          "/>
          
          {/* Email Content */}
          <span className="relative z-10">{user.email}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-white mr-4">{user.email}</span>
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