import React from 'react';
import { X } from 'lucide-react';
import { NavLinks } from './NavLinks';
import { UserInfo } from './UserInfo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Off-canvas menu */}
      <div className={`
        fixed inset-y-0 right-0 w-64 bg-white shadow-lg z-50 
        transform transition-transform duration-300 ease-in-out
        lg:hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4">
            <UserInfo className="border-b border-gray-200 pb-4 mb-4" />
            <NavLinks orientation="vertical" />
          </div>
        </div>
      </div>
    </>
  );
}