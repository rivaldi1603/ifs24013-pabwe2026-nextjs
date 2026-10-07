'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { useInput } from '../../../hooks/useInput';
import { asyncAddPost, resetPostStatus, asyncGetPosts } from '../states/action';
import { IconX, IconCheck } from '@tabler/icons-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddModal({ isOpen, onClose }: Readonly<Props>) {
  const dispatch = useAppDispatch();
  const [description, onDescriptionChange, setDescription] = useInput('');
  
  const isPostAdd = useAppSelector(state => state.posts?.isPostAdd || false);
  const isPostAdded = useAppSelector(state => state.posts?.isPostAdded || false);

  useEffect(() => {
    if (isPostAdded) {
      setDescription('');
      dispatch(resetPostStatus());
      dispatch(asyncGetPosts());
      onClose();
    }
  }, [isPostAdded, dispatch, onClose, setDescription]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animation-fade-in">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-lg p-6 shadow-2xl m-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Buat Postingan Baru</h3>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none">
            <IconX size={24} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); dispatch(asyncAddPost({ description })); }}>
          <div className="mb-6">
            <textarea
              value={description}
              onChange={onDescriptionChange}
              placeholder="Apa yang Anda pikirkan?"
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white outline-none transition-all resize-none min-h-[120px]"
              required
            ></textarea>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPostAdd || !description.trim()}
              className="flex items-center px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPostAdd ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <IconCheck size={18} className="mr-2" />
              )}
              Bagikan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
