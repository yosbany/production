import React from 'react';
import { X } from 'lucide-react';
import { UserInfo } from './UserInfo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <>
      {/* Backdrop with blur effect */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Off-canvas menu */}
      <div className={`
        fixed inset-y-0 right-0 w-80 z-50 
        bg-gradient-to-b from-white to-gray-50
        transform transition-all duration-300 ease-out
        lg:hidden
        ${isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 px-6 py-4 bg-white/80 backdrop-blur-sm border-b">
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full pt-20 px-6 pb-6">
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <UserInfo className="w-full" />
          </div>
        </div>
      </div>
    </>
  );
}