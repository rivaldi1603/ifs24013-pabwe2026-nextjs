'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { useInput } from '../../../hooks/useInput';
import { 
  asyncGetPostDetail, asyncDeletePost, asyncToggleLike, 
  asyncAddComment, asyncDeleteComment 
} from '../states/action';
import { 
  IconArrowLeft, IconHeartFilled, IconHeart, IconMessageCircle, 
  IconTrash, IconEdit, IconPhotoEdit, IconSend 
} from '@tabler/icons-react';
import { formatDate, showConfirmDialog } from '../../../helpers/toolsHelper';
import dynamic from 'next/dynamic';
const ChangeModal = dynamic(() => import('../modals/ChangeModal'), { ssr: false });
const ChangeCoverModal = dynamic(() => import('../modals/ChangeCoverModal'), { ssr: false });

export default function DetailPage({ postId }: { postId: number }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const post = useAppSelector(state => state.posts?.post);
  const isPost = useAppSelector(state => state.posts?.isPost || false);
  const isPostAddComment = useAppSelector(state => state.posts?.isPostAddComment || false);
  
  const [commentText, onCommentChange, setCommentText] = useInput('');
  
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

  useEffect(() => {
    dispatch(asyncGetPostDetail(postId) as any).catch(() => {});
  }, [dispatch, postId]);

  const handleLike = () => {
    dispatch(asyncToggleLike(postId));
  };

  const handleDeletePost = async () => {
    const result = await showConfirmDialog(
      'Hapus Postingan?', 
      'Apakah Anda yakin ingin menghapus postingan ini secara permanen?'
    );
    if (result.isConfirmed) {
      try {
        await dispatch(asyncDeletePost(postId));
        router.push('/');
      } catch (error) {}
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await dispatch(asyncAddComment({ id: postId, comment: commentText }));
      setCommentText('');
    } catch (error) {}
  };

  const handleDeleteComment = async (commentId: number) => {
    const result = await showConfirmDialog(
      'Hapus Komentar?',
      'Apakah Anda yakin ingin menghapus komentar ini?'
    );
    if (result.isConfirmed) {
      dispatch(asyncDeleteComment({ postId, commentId }));
    }
  };

  if (isPost && !post) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Postingan tidak ditemukan</h2>
        <button onClick={() => router.back()} className="mt-4 text-blue-500 hover:underline">Kembali</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animation-fade-in">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-6 font-medium"
      >
        <IconArrowLeft size={20} className="mr-2" />
        Kembali
      </button>

      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-xl overflow-hidden mb-8">
        {/* Cover Section */}
        <div className="relative h-64 sm:h-80 md:h-96 bg-neutral-100 dark:bg-neutral-800 overflow-hidden group">
          {post.cover ? (
            <img src={post.cover} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-300 dark:text-neutral-600 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
              <IconMessageCircle size={64} className="mb-4 opacity-50" />
            </div>
          )}
          
          {post.is_me && (
            <button 
              onClick={() => setIsCoverModalOpen(true)}
              className="absolute top-4 right-4 md:opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-black/80"
              title="Ubah Gambar Cover"
            >
              <IconPhotoEdit size={20} />
            </button>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 md:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 text-blue-600 overflow-hidden flex items-center justify-center font-bold text-xl mr-4 shadow-sm">
                {post.author.avatar ? (
                  <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                ) : (
                  post.author.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  {post.author.name}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {formatDate(post.created_at)}
                </p>
              </div>
            </div>

            {post.is_me && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsChangeModalOpen(true)}
                  className="p-2.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors"
                  title="Ubah Postingan"
                >
                  <IconEdit size={20} />
                </button>
                <button 
                  onClick={handleDeletePost}
                  className="p-2.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-colors"
                  title="Hapus Postingan"
                >
                  <IconTrash size={20} />
                </button>
              </div>
            )}
          </div>

          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-lg whitespace-pre-wrap mb-10">
            {post.description}
          </p>

          <div className="flex items-center gap-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
            <button 
              aria-label="Suka postingan"
              onClick={handleLike}
              className="flex items-center gap-2 font-medium transition-colors hover:text-red-500 group"
            >
              <div className={`p-2.5 rounded-full transition-colors ${post.is_liked ? 'bg-red-50 dark:bg-red-900/20' : 'bg-neutral-50 dark:bg-neutral-800 group-hover:bg-red-50 dark:group-hover:bg-red-900/20'}`}>
                {post.is_liked ? (
                  <IconHeartFilled size={24} className="text-red-500" />
                ) : (
                  <IconHeart size={24} className="text-neutral-400 group-hover:text-red-500" />
                )}
              </div>
              <span className={`text-lg ${post.is_liked ? 'text-red-500' : 'text-neutral-600 dark:text-neutral-400'}`}>
                {post.likes_count}
              </span>
            </button>
            
            <div className="flex items-center gap-2 font-medium text-neutral-600 dark:text-neutral-400">
              <div className="p-2.5 rounded-full bg-neutral-50 dark:bg-neutral-800">
                <IconMessageCircle size={24} />
              </div>
              <span className="text-lg">{post.comments_count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-md p-6 sm:p-8">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Komentar</h3>
        
        <form onSubmit={handleAddComment} className="flex gap-3 mb-8">
          <input
            type="text"
            value={commentText}
            onChange={onCommentChange}
            placeholder="Tulis komentar Anda..."
            className="flex-1 px-5 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white outline-none transition-all"
          />
          <button
            aria-label="Kirim komentar"
            type="submit"
            disabled={isPostAddComment || !commentText.trim()}
            className="flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPostAddComment ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <IconSend size={24} />
            )}
          </button>
        </form>

        <div className="space-y-6">
          {!post.comments || post.comments.length === 0 ? (
            <p className="text-center text-neutral-500 dark:text-neutral-400 py-6">
              Belum ada komentar. Jadilah yang pertama berkomentar!
            </p>
          ) : (
            post.comments.map(comment => (
              <div key={comment.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full flex-shrink-0 bg-blue-100 text-blue-600 flex items-center justify-center font-bold overflow-hidden">
                  {comment.author.avatar ? (
                    <img src={comment.author.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    comment.author.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 bg-neutral-50 dark:bg-neutral-800 rounded-2xl rounded-tl-none p-4 relative group">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-neutral-900 dark:text-white">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm whitespace-pre-wrap">
                    {comment.comment}
                  </p>
                  
                  {comment.is_me && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="absolute -right-2 -top-2 p-1.5 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                      title="Hapus komentar"
                    >
                      <IconTrash size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {post.is_me && (
        <>
          <ChangeModal 
            isOpen={isChangeModalOpen} 
            onClose={() => setIsChangeModalOpen(false)} 
            postId={post.id} 
            initialDescription={post.description} 
          />
          <ChangeCoverModal 
            isOpen={isCoverModalOpen} 
            onClose={() => setIsCoverModalOpen(false)} 
            postId={post.id} 
          />
        </>
      )}
    </div>
  );
}
