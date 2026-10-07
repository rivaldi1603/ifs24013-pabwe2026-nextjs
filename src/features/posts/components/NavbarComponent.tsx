'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { asyncAuthLogout } from '../../auth/states/action';
import { useRouter } from 'next/navigation';
import { IconMenu2, IconLogout, IconUserCircle } from '@tabler/icons-react';

export default function NavbarComponent({ toggleSidebar }: Readonly<{ toggleSidebar: () => void }>) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const profile = useAppSelector((state) => state.users?.profile);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(asyncAuthLogout());
      router.push('/auth/login');
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-sm backdrop-blur-sm bg-white/90 dark:bg-neutral-900/90 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              aria-label="Toggle navigasi sidebar"
              onClick={toggleSidebar}
              className="p-2 -ml-2 mr-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors lg:hidden focus:outline-none"
            >
              <IconMenu2 size={24} />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                DelcomPosts
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <div className="relative ml-3">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 rounded-full py-1 pl-1 pr-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-white dark:border-neutral-700">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{profile?.name?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
                <div className="hidden sm:block text-sm font-medium text-neutral-700 dark:text-neutral-300 max-w-[120px] truncate">
                  {profile?.name || 'Pengguna'}
                </div>
              </button>

              {isDropdownOpen && (
                <>
                  <button 
                    type="button"
                    className="fixed inset-0 z-40 w-full h-full border-none bg-transparent cursor-default focus:outline-none" 
                    onClick={() => setIsDropdownOpen(false)}
                    aria-hidden="true"
                    tabIndex={-1}
                  ></button>
                  <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden transform origin-top-right transition-all animation-fade-in py-1">
                    <Link 
                      href="/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <IconUserCircle size={18} className="mr-2 text-neutral-400" />
                      Profil Saya
                    </Link>
                    <div className="border-t border-neutral-100 dark:border-neutral-700 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
                    >
                      <IconLogout size={18} className="mr-2" />
                      Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
