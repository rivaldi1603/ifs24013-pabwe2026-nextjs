'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useInput } from '../../../hooks/useInput';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { asyncAuthLogin } from '../states/action';
import { IconMail, IconLock, IconLogin } from '@tabler/icons-react';
import { showWarningDialog } from '../../../helpers/toolsHelper';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  
  // Safe default since Redux store might not be fully configured yet
  const isAuthLogin = useAppSelector((state) => state.auth?.isAuthLogin || false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      showWarningDialog('Form tidak lengkap', 'Silakan isi email dan kata sandi Anda.');
      return;
    }

    try {
      await dispatch(asyncAuthLogin({ email, password }));
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="w-full animation-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-2">
          Selamat Datang Kembali
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 font-medium">
          Masuk ke akun Anda untuk melanjutkan
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="space-y-1 block">
          <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1 block">Email</span>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-blue-500 transition-colors">
              <IconMail size={20} />
            </div>
            <input
              id="login-email-input"
              type="email"
              value={email}
              onChange={onEmailChange}
              placeholder="nama@email.com"
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all duration-300 outline-none shadow-sm"
              required
            />
          </div>
        </label>

        <label className="space-y-1 block">
          <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1 block">Kata Sandi</span>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-blue-500 transition-colors">
              <IconLock size={20} />
            </div>
            <input
              id="login-password-input"
              type="password"
              value={password}
              onChange={onPasswordChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all duration-300 outline-none shadow-sm"
              required
            />
          </div>
        </label>

        <button
          id="login-submit-button"
          type="submit"
          disabled={isAuthLogin}
          className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
        >
          {isAuthLogin ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Masuk</span>
              <IconLogin size={20} className="ml-2" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
        Belum memiliki akun?{' '}
        <Link href="/auth/register" className="text-blue-600 hover:text-blue-500 underline transition-all">
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}
