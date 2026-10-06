'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { getAccessToken } from '../../../helpers/apiHelper';
import { asyncGetProfile } from '../../users/states/action';
import NavbarComponent from '../components/NavbarComponent';
import SidebarComponent from '../components/SidebarComponent';

export default function PostLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  const profile = useAppSelector((state) => state.users?.profile);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace('/auth/login');
      return;
    }

    // Load profile if not loaded
    if (!profile) {
      (dispatch(asyncGetProfile()) as any)
        .then(() => setIsChecking(false))
        .catch(() => {
          // If profile fetch fails (e.g. token expired), redirect to login
          router.replace('/auth/login');
        });
    } else {
      setIsChecking(false);
    }
  }, [router, dispatch, profile]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">Memuat Sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-neutral-950">
      <NavbarComponent toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <SidebarComponent isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
