'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { useInput } from '../../../hooks/useInput';
import { 
  asyncGetProfile, 
  asyncUpdateProfile, 
  asyncUpdateProfilePhoto, 
  asyncUpdateProfilePassword 
} from '../states/action';
import { IconUser, IconCamera, IconLock, IconCheck, IconUpload } from '@tabler/icons-react';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.users?.profile);
  const isProfile = useAppSelector((state) => state.users?.isProfile || false);
  const isChangeProfile = useAppSelector((state) => state.users?.isChangeProfile || false);
  const isChangeProfilePhoto = useAppSelector((state) => state.users?.isChangeProfilePhoto || false);
  const isChangeProfilePassword = useAppSelector((state) => state.users?.isChangeProfilePassword || false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for forms
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  
  // Password form
  const [oldPassword, onOldPasswordChange, setOldPassword] = useInput('');
  const [newPassword, onNewPasswordChange, setNewPassword] = useInput('');
  
  useEffect(() => {
    dispatch(asyncGetProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      // Bio handling if backend supports it; falling back to empty string
      setBio((profile as any).bio || '');
    }
  }, [profile]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(asyncUpdateProfile({ name, bio }));
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(asyncUpdateProfilePassword({ 
      old_password: oldPassword, 
      new_password: newPassword 
    }));
    if (asyncUpdateProfilePassword.fulfilled.match(result)) {
      setOldPassword('');
      setNewPassword('');
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(asyncUpdateProfilePhoto(file));
    }
  };

  if (isProfile && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animation-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Pengaturan Profil
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          Kelola informasi pribadi dan keamanan akun Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col items-center text-center">
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 border-4 border-white dark:border-neutral-800 shadow-md overflow-hidden relative transition-transform duration-300 group-hover:scale-105">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-500 font-bold text-4xl">
                    {profile?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                
                {/* Upload Overlay */}
                <div 
                  onClick={handlePhotoClick}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                >
                  <IconCamera size={24} className="mb-1" />
                  <span className="text-xs font-medium">Ubah Foto</span>
                </div>
              </div>
              
              {isChangeProfilePhoto && (
                <div className="absolute inset-0 bg-white/70 dark:bg-neutral-900/70 rounded-full flex items-center justify-center z-10">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white line-clamp-1">{profile?.name}</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{profile?.email}</p>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center">
              <IconUser size={20} className="text-blue-500 mr-2" />
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Informasi Dasar</h3>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white outline-none transition-all"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white outline-none transition-all resize-none"
                  placeholder="Ceritakan sedikit tentang diri Anda..."
                ></textarea>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isChangeProfile}
                  className="flex items-center py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isChangeProfile ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <IconCheck size={18} className="mr-2" />
                  )}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>

          {/* Password Form */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center">
              <IconLock size={20} className="text-purple-500 mr-2" />
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Ubah Kata Sandi</h3>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Kata Sandi Lama</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={onOldPasswordChange}
                  className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:text-white outline-none transition-all"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={onNewPasswordChange}
                  className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:text-white outline-none transition-all"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isChangeProfilePassword}
                  className="flex items-center py-2.5 px-6 bg-neutral-800 dark:bg-neutral-100 hover:bg-neutral-900 dark:hover:bg-white text-white dark:text-neutral-900 rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isChangeProfilePassword ? (
                    <div className="w-5 h-5 border-2 border-white dark:border-neutral-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <IconLock size={18} className="mr-2" />
                  )}
                  Perbarui Kata Sandi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
