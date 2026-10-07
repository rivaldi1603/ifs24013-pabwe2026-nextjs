'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { asyncGetUsers } from '../states/action';
import { IconSearch, IconUser, IconCalendar } from '@tabler/icons-react';
import { formatDate } from '../../../helpers/toolsHelper';

const EMPTY_USERS: any[] = [];

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users?.users || EMPTY_USERS);
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce logic for searching
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(asyncGetUsers(searchQuery));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, dispatch]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animation-fade-in">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Direktori Pengguna
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Temukan dan jelajahi kreator di dalam platform
          </p>
        </div>
        
        <div className="relative w-full md:w-72 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-blue-500 transition-colors">
            <IconSearch size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pengguna..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all shadow-sm outline-none"
          />
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 mb-4">
            <IconUser size={32} />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Tidak ada pengguna</h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mt-2">
            Pengguna yang Anda cari tidak ditemukan. Coba dengan kata kunci lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow group flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 border-4 border-white dark:border-neutral-800 shadow-sm overflow-hidden mb-4 relative">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-500 font-bold text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {user.name}
              </h2>
              
              <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                <IconCalendar size={14} className="mr-1.5" />
                <span>Bergabung {formatDate(user.created_at)}</span>
              </div>
              
              <button className="mt-5 w-full py-2 px-4 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-semibold transition-colors">
                Lihat Profil
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
