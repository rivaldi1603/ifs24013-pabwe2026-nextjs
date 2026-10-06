'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconLayoutDashboard, IconUser, IconUsers, IconX } from '@tabler/icons-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function SidebarComponent({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { name: 'Semua Postingan', href: '/', icon: <IconLayoutDashboard size={20} /> },
    { name: 'Postingan Saya', href: '/?tab=me', icon: <IconUser size={20} /> },
    { name: 'Daftar Pengguna', href: '/users', icon: <IconUsers size={20} /> },
    { name: 'Profil Saya', href: '/profile', icon: <IconUser size={20} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm lg:hidden transition-opacity" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar container */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:h-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between h-16 px-6 lg:hidden border-b border-neutral-100 dark:border-neutral-800">
          <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            DelcomPosts
          </span>
          <button 
            aria-label="Tutup sidebar"
            onClick={() => setIsOpen(false)} 
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 focus:outline-none"
          >
            <IconX size={24} />
          </button>
        </div>

        <div className="h-full overflow-y-auto pt-6 pb-4 px-4 flex flex-col gap-2">
          {links.map((link) => {
            // Very simple active state matching
            const isActive = pathname === link.href || (link.href === '/?tab=me' && typeof window !== 'undefined' && window.location.search === '?tab=me');
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <div className={`mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400 group-hover:text-neutral-500'}`}>
                  {link.icon}
                </div>
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
