import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface NavLinksProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function NavLinks({ orientation = 'horizontal', className = '' }: NavLinksProps) {
  const { userRole } = useAuth();

  const linkClass = orientation === 'vertical'
    ? 'block py-2 text-gray-700 hover:text-indigo-600'
    : 'text-white hover:text-indigo-100';

  return (
    <nav className={`${orientation === 'vertical' ? 'space-y-2' : 'space-x-4'} ${className}`}>
      {userRole === 'admin' ? (
        <>
          <Link to="/admin" className={linkClass}>Panel de Administración</Link>
          <Link to="/admin/products" className={linkClass}>Productos</Link>
        </>
      ) : (
        <Link to="/dashboard" className={linkClass}>Mi Producción</Link>
      )}
    </nav>
  );
}