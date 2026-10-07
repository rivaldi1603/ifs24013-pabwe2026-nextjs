'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { asyncUpdatePostCover, resetPostStatus } from '../states/action';
import { IconX, IconUpload, IconPhoto } from '@tabler/icons-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
}

export default function ChangeCoverModal({ isOpen, onClose, postId }: Props) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const isPostChangeCover = useAppSelector(state => state.posts?.isPostChangeCover || false);
  const isPostChangedCover = useAppSelector(state => state.posts?.isPostChangedCover || false);

  useEffect(() => {
    if (isPostChangedCover) {
      dispatch(resetPostStatus());
      setFile(null);
      setPreview(null);
      onClose();
    }
  }, [isPostChangedCover, dispatch, onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreview(url);
    }
  };

  const handleUpload = () => {
    dispatch(asyncUpdatePostCover({ id: postId, file: file as File }));
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animation-fade-in">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-lg p-6 shadow-2xl m-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Ubah Gambar Cover</h3>
          <button onClick={handleClose} className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none">
            <IconX size={24} />
          </button>
        </div>

        <div className="mb-6">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors ${preview ? 'border-blue-500' : 'border-neutral-300 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-500 bg-neutral-50 dark:bg-neutral-800/50'}`}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <IconPhoto size={48} className="text-neutral-400 mb-3" />
                <p className="text-neutral-600 dark:text-neutral-400 font-medium">Klik untuk memilih gambar</p>
                <p className="text-xs text-neutral-500 mt-1">PNG, JPG atau WEBP (Max. 5MB)</p>
              </>
            )}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleUpload}
            disabled={isPostChangeCover || !file}
            className="flex items-center px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPostChangeCover ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <IconUpload size={18} className="mr-2" />
            )}
            Unggah Cover
          </button>
        </div>
      </div>
    </div>
  );
}
