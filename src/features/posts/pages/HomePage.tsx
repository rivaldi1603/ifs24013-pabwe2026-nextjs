'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { asyncGetPosts, asyncToggleLike, asyncDeleteAllPosts } from '../states/action';
import { IconSearch, IconHeartFilled, IconHeart, IconMessageCircle, IconPlus, IconTrash } from '@tabler/icons-react';
import { formatDate, showConfirmDialog } from '../../../helpers/toolsHelper';
import AddModal from '../modals/AddModal';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const isMe = tab === 'me';
  
  const posts = useAppSelector(state => state.posts?.posts || []);
  const isPost = useAppSelector(state => state.posts?.isPost || false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(asyncGetPosts({ isMe, search: searchQuery }));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, isMe, dispatch]);

  const handleLike = (e: React.MouseEvent, postId: number) => {
    e.preventDefault();
    dispatch(asyncToggleLike(postId));
  };

  const handleDeleteAll = async () => {
    const result = await showConfirmDialog(
      'Hapus Semua Postingan?',
      'Apakah Anda yakin ingin menghapus SELURUH postingan Anda? Tindakan ini tidak dapat dibatalkan.'
    );
    if (result.isConfirmed) {
      dispatch(asyncDeleteAllPosts());
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animation-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            {isMe ? 'Postingan Saya' : 'Linimasa Publik'}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {isMe ? 'Kelola semua cerita dan ide yang pernah Anda bagikan.' : 'Temukan cerita menarik dari seluruh kreator.'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-blue-500 transition-colors">
              <IconSearch size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari postingan..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all shadow-sm outline-none"
            />
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-colors"
          >
            <IconPlus size={20} />
            Buat Post
          </button>
          
          {isMe && posts.length > 0 && (
            <button 
              onClick={handleDeleteAll}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl font-medium transition-colors"
            >
              <IconTrash size={20} />
              Hapus Semua
            </button>
          )}
        </div>
      </div>

      {isPost && posts.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white dark:bg-neutral-900 rounded-2xl h-80 border border-neutral-100 dark:border-neutral-800 shadow-sm"></div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 mb-6">
            <IconMessageCircle size={40} />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Tidak ada postingan</h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mt-2">
            Belum ada postingan yang dapat ditampilkan. Buat postingan pertama Anda sekarang!
          </p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-colors"
          >
            Buat Postingan Baru
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link 
              href={`/posts/${post.id}`} 
              key={post.id} 
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
            >
              <div className="relative h-48 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                {post.cover ? (
                  <img src={post.cover} alt="Cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-300 dark:text-neutral-600">
                    <IconMessageCircle size={48} className="mb-2 opacity-50" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                  {formatDate(post.created_at)}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 text-blue-600 overflow-hidden flex items-center justify-center font-bold text-sm mr-3">
                    {post.author.avatar ? (
                      <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                    ) : (
                      post.author.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white line-clamp-1">
                    {post.author.name}
                  </div>
                </div>
                
                <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-3 mb-4 flex-1">
                  {post.description}
                </p>
                
                <div className="flex items-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <button 
                    aria-label="Suka postingan"
                    onClick={(e) => handleLike(e, post.id)}
                    className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-red-500 group/btn"
                  >
                    {post.is_liked ? (
                      <IconHeartFilled size={20} className="text-red-500 transform group-hover/btn:scale-110 transition-transform" />
                    ) : (
                      <IconHeart size={20} className="text-neutral-400 group-hover/btn:text-red-500 transform group-hover/btn:scale-110 transition-transform" />
                    )}
                    <span className={post.is_liked ? 'text-red-500' : 'text-neutral-500 dark:text-neutral-400'}>
                      {post.likes_count}
                    </span>
                  </button>
                  
                  <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-blue-500 transition-colors">
                    <IconMessageCircle size={20} />
                    <span>{post.comments_count}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <AddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
