'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '../../../helpers/apiHelper';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      router.replace('/');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-gray-50 dark:bg-neutral-900">
      {/* Left side: Visual Banner */}
      <div className="hidden lg:flex w-1/2 relative bg-neutral-900 overflow-hidden">
        {/* Dynamic Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-60">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {/* Banner Content */}
        <div className="relative z-10 w-full p-16 flex flex-col justify-center h-full text-white">
          <div className="mb-8">
            <h2 className="text-5xl font-black tracking-tight mb-6 leading-tight">
              Platform Berbagi <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Cerita & Ide</span>
            </h2>
            <p className="text-lg text-neutral-300 max-w-md leading-relaxed font-light">
              Bergabunglah dengan komunitas kami. Bagikan pengalaman, baca pemikiran menarik, dan terhubung dengan kreator lainnya di seluruh dunia.
            </p>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-neutral-900 bg-neutral-700 flex items-center justify-center text-xs font-bold z-${30 - i * 10}`}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-neutral-400 font-medium">
                Telah dipercaya oleh <span className="text-white font-bold">10,000+</span> pengguna
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <main className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-neutral-950 shadow-2xl z-10 relative">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
}
