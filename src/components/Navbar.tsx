import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { NavLinks } from './navigation/NavLinks';
import { UserInfo } from './navigation/UserInfo';

export default function Navbar() {
  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex-1 flex items-center">
            <Link to="/" className="flex items-center">
              <FileText className="h-6 w-6 text-white mr-2 sm:mr-3 shrink-0" />
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-white truncate">
                Centro de Producción
              </h1>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            <NavLinks />
            <UserInfo />
          </div>

          {/* Mobile user info */}
          <div className="lg:hidden">
            <UserInfo compact />
          </div>
        </div>
      </div>
    </nav>
  );
}