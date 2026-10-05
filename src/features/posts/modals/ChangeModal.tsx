'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { useInput } from '../../../hooks/useInput';
import { asyncUpdatePost, resetPostStatus } from '../states/action';
import { IconX, IconCheck } from '@tabler/icons-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  initialDescription: string;
}

export default function ChangeModal({ isOpen, onClose, postId, initialDescription }: Props) {
  const dispatch = useAppDispatch();
  const [description, onDescriptionChange, setDescription] = useInput('');
  
  const isPostChange = useAppSelector(state => state.posts?.isPostChange || false);
  const isPostChanged = useAppSelector(state => state.posts?.isPostChanged || false);

  useEffect(() => {
    if (isOpen) {
      setDescription(initialDescription);
    }
  }, [isOpen, initialDescription, setDescription]);

  useEffect(() => {
    if (isPostChanged) {
      dispatch(resetPostStatus());
      onClose();
    }
  }, [isPostChanged, dispatch, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animation-fade-in">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-lg p-6 shadow-2xl m-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Ubah Postingan</h3>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none">
            <IconX size={24} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); dispatch(asyncUpdatePost({ id: postId, description })); }}>
          <div className="mb-6">
            <textarea
              value={description}
              onChange={onDescriptionChange}
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
              disabled={isPostChange || !description.trim() || description === initialDescription}
              className="flex items-center px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPostChange ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <IconCheck size={18} className="mr-2" />
              )}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
