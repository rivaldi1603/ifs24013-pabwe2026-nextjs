'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useInput } from '../../../hooks/useInput';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { asyncAuthRegister } from '../states/action';
import { IconMail, IconLock, IconUser, IconUserPlus } from '@tabler/icons-react';
import { showWarningDialog } from '../../../helpers/toolsHelper';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [passwordConfirm, onPasswordConfirmChange] = useInput('');
  
  const isAuthRegister = useAppSelector((state) => state.auth?.isAuthRegister || false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !passwordConfirm) {
      showWarningDialog('Form tidak lengkap', 'Silakan isi seluruh formulir pendaftaran.');
      return;
    }
    
    if (password !== passwordConfirm) {
      showWarningDialog('Kata Sandi Tidak Cocok', 'Konfirmasi kata sandi tidak sama dengan kata sandi.');
      return;
    }

    try {
      await dispatch(asyncAuthRegister({ name, email, password }));
      router.push('/auth/login');
    } catch (error) {}
  };

  return (
    <div className="w-full animation-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-2">
          Buat Akun Baru
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 font-medium">
          Bergabung dan mulai bagikan cerita Anda
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="space-y-1 block">
          <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1 block">Nama Lengkap</span>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-purple-500 transition-colors">
              <IconUser size={20} />
            </div>
            <input
              id="register-name-input"
              type="text"
              value={name}
              onChange={onNameChange}
              placeholder="Nama Anda"
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:text-white transition-all duration-300 outline-none shadow-sm"
              required
            />
          </div>
        </label>

        <label className="space-y-1 block">
          <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1 block">Email</span>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-purple-500 transition-colors">
              <IconMail size={20} />
            </div>
            <input
              id="register-email-input"
              type="email"
              value={email}
              onChange={onEmailChange}
              placeholder="nama@email.com"
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:text-white transition-all duration-300 outline-none shadow-sm"
              required
            />
          </div>
        </label>

        <label className="space-y-1 block">
          <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1 block">Kata Sandi</span>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-purple-500 transition-colors">
              <IconLock size={20} />
            </div>
            <input
              id="register-password-input"
              type="password"
              value={password}
              onChange={onPasswordChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:text-white transition-all duration-300 outline-none shadow-sm"
              required
            />
          </div>
        </label>

        <label className="space-y-1 block">
          <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1 block">Konfirmasi Kata Sandi</span>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-purple-500 transition-colors">
              <IconLock size={20} />
            </div>
            <input
              id="register-confirm-password-input"
              type="password"
              value={passwordConfirm}
              onChange={onPasswordConfirmChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:text-white transition-all duration-300 outline-none shadow-sm"
              required
            />
          </div>
        </label>

        <button
          id="register-submit-button"
          type="submit"
          disabled={isAuthRegister}
          className="w-full mt-2 flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
        >
          {isAuthRegister ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Daftar Sekarang</span>
              <IconUserPlus size={20} className="ml-2" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
        Sudah memiliki akun?{' '}
        <Link href="/auth/login" className="text-purple-600 hover:text-purple-500 underline transition-all">
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
