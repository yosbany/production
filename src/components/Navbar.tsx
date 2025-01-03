import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Menu } from 'lucide-react';
import { NavLinks } from './navigation/NavLinks';
import { UserInfo } from './navigation/UserInfo';
import { MobileMenu } from './navigation/MobileMenu';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex-1 flex items-center">
            <Link to="/" className="flex items-center">
              <FileText className="h-6 w-6 text-white mr-3" />
              <h1 className="text-xl font-bold text-white">Centro de Producción</h1>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            <NavLinks />
            <UserInfo />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-full text-white hover:bg-indigo-500"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </nav>
  );
}