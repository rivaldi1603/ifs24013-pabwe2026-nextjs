import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import DetailPage from '../pages/DetailPage';
import * as postApi from '../api/postApi';
import * as navigation from 'next/navigation';
import * as toolsHelper from '../../../helpers/toolsHelper';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));



vi.mock('../../../helpers/toolsHelper', () => ({
  showConfirmDialog: vi.fn(),
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  formatDate: vi.fn().mockReturnValue('1 Jan'),
}));

describe('DetailPage', () => {
  let backMock: any;
  beforeEach(() => {
    backMock = vi.fn();
    (navigation.useRouter as any).mockReturnValue({ back: backMock });
    vi.clearAllMocks();
  });

  it('renders not found if no post and handles error', async () => {
    vi.spyOn(postApi, 'getPostDetailApi').mockRejectedValue(new Error('fail'));
    renderWithProviders(<DetailPage postId={1} />);
    
    await waitFor(() => {
      expect(screen.getByText('Postingan tidak ditemukan')).toBeInTheDocument();
    });
  });

  it('renders post details and handles missing avatars', async () => {
    const post = { 
      id: 1, description: 'Detail Desc', author: { name: 'Author', avatar: 'avatar.png' }, 
      is_me: true, likes_count: 5, comments_count: 0, cover: 'cover.jpg',
      comments: [
        { id: 10, comment: 'test', is_me: true, author: { name: 'me', avatar: 'img.png' }, created_at: '2023-01-01' },
        { id: 11, comment: 'test2', is_me: false, author: { name: 'other' }, created_at: '2023-01-01' } 
      ],
      created_at: '2023-01-01'
    };
    renderWithProviders(<DetailPage postId={1} />, { preloadedState: { posts: { post } as any } });
    await waitFor(() => {
      expect(screen.getByText('Detail Desc')).toBeInTheDocument();
      expect(screen.getByText('Author')).toBeInTheDocument();
      expect(screen.getByText('O')).toBeInTheDocument(); // fallback for other
    });
  });

  it('handles add comment', async () => {
    const apiSpy = vi.spyOn(postApi, 'addCommentApi').mockResolvedValue({ response: { ok: true }, data: {} } as any);
    const post = { id: 1, author: { name: 'A' }, comments: [] };
    renderWithProviders(<DetailPage postId={1} />, { preloadedState: { posts: { post } as any } });
    
    const input = screen.getByPlaceholderText('Tulis komentar Anda...');
    fireEvent.change(input, { target: { value: 'New comment' } });
    
    const btn = input.nextSibling as HTMLButtonElement;
    fireEvent.click(btn);
    
    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith(1, { comment: 'New comment' });
    });
  });

  it('handles add comment empty and error', async () => {
    const apiSpy = vi.spyOn(postApi, 'addCommentApi').mockRejectedValue(new Error('fail'));
    const post = { id: 1, author: { name: 'A' }, comments: [] };
    renderWithProviders(<DetailPage postId={1} />, { preloadedState: { posts: { post } as any } });
    
    const input = screen.getByPlaceholderText('Tulis komentar Anda...');
    const btn = input.nextSibling as HTMLButtonElement;
    const form = input.closest('form');
    
    // empty submit
    if (form) fireEvent.submit(form);
    expect(apiSpy).not.toHaveBeenCalled();
    
    // error submit
    fireEvent.change(input, { target: { value: 'New comment' } });
    if (form) fireEvent.submit(form);
    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalled();
    });
  });

  it('handles delete post', async () => {
    (toolsHelper.showConfirmDialog as any).mockResolvedValue({ isConfirmed: true });
    const apiSpy = vi.spyOn(postApi, 'deletePostApi').mockResolvedValue({ response: { ok: true }, data: {} } as any);
    const post = { id: 1, author: { name: 'A' }, is_me: true, comments: [] };
    
    renderWithProviders(<DetailPage postId={1} />, { preloadedState: { posts: { post } as any } });
    
    // Find delete button by title
    const delBtn = screen.getByTitle('Hapus Postingan');
    fireEvent.click(delBtn);
    
    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith(1);
    });
  });

  it('handles delete post cancel and error', async () => {
    // cancel
    (toolsHelper.showConfirmDialog as any).mockResolvedValueOnce({ isConfirmed: false });
    const apiSpy = vi.spyOn(postApi, 'deletePostApi').mockRejectedValue(new Error('fail'));
    const post = { id: 1, author: { name: 'A' }, is_me: true, comments: [] };
    
    renderWithProviders(<DetailPage postId={1} />, { preloadedState: { posts: { post } as any } });
    
    const delBtn = screen.getByTitle('Hapus Postingan');
    fireEvent.click(delBtn);
    expect(apiSpy).not.toHaveBeenCalled();
    
    // error
    (toolsHelper.showConfirmDialog as any).mockResolvedValueOnce({ isConfirmed: true });
    fireEvent.click(delBtn);
    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalled();
    });
  });

  it('handles like when is_liked is false', () => {
    const apiSpy = vi.spyOn(postApi, 'toggleLikeApi').mockResolvedValue({ response: { ok: true }, data: {} } as any);
    const post = { id: 1, author: { name: 'A' }, is_liked: false, comments: [] };
    renderWithProviders(<DetailPage postId={1} />, { preloadedState: { posts: { post } as any } });
    
    const likeBtn = screen.getByLabelText('Suka postingan');
    fireEvent.click(likeBtn);
    
    expect(apiSpy).toHaveBeenCalledWith(1);
  });

  it('handles like when is_liked is true', () => {
    const apiSpy = vi.spyOn(postApi, 'toggleLikeApi').mockResolvedValue({ response: { ok: true }, data: {} } as any);
    const post = { id: 1, author: { name: 'A' }, is_liked: true, comments: [] };
    renderWithProviders(<DetailPage postId={1} />, { preloadedState: { posts: { post } as any } });
    
    const likeBtn = screen.getByLabelText('Suka postingan');
    fireEvent.click(likeBtn);
    
    expect(apiSpy).toHaveBeenCalledWith(1);
  });

  it('handles like error', async () => {
    const apiSpy = vi.spyOn(postApi, 'toggleLikeApi').mockRejectedValue(new Error('fail'));
    const post = { id: 1, author: { name: 'A' }, is_liked: false, comments: [] };
    renderWithProviders(<DetailPage postId={1} />, { preloadedState: { posts: { post } as any } });
    
    const likeBtn = screen.getByLabelText('Suka postingan');
    fireEvent.click(likeBtn);
    
    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith(1);
    });
  });

  it('handles delete comment', async () => {
    (toolsHelper.showConfirmDialog as any).mockResolvedValue({ isConfirmed: true });
    const apiSpy = vi.spyOn(postApi, 'deleteCommentApi').mockResolvedValue({ response: { ok: true }, data: {} } as any);
    const post = { 
      id: 1, author: { name: 'A' }, 
      comments: [{ id: 10, comment: 'test', is_me: true, author: { name: 'me' } }] 
    };
    renderWithProviders(<DetailPage postId={1} />, { preloadedState: { posts: { post } as any } });
    
    const delCommentBtn = screen.getByTitle('Hapus komentar');
    fireEvent.click(delCommentBtn);
    
    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith(1, 10);
    });
  });

  it('handles delete comment cancel', async () => {
    (toolsHelper.showConfirmDialog as any).mockResolvedValue({ isConfirmed: false });
    const apiSpy = vi.spyOn(postApi, 'deleteCommentApi');
    const post = { 
      id: 1, author: { name: 'A' }, 
      comments: [{ id: 10, comment: 'test', is_me: true, author: { name: 'me' } }] 
    };
    renderWithProviders(<DetailPage postId={1} />, { preloadedState: { posts: { post } as any } });
    
    const delCommentBtn = screen.getByTitle('Hapus komentar');
    fireEvent.click(delCommentBtn);
    
    expect(apiSpy).not.toHaveBeenCalled();
  });

  it('handles back button', async () => {
    renderWithProviders(<DetailPage postId={1} />, { preloadedState: { posts: { post: null } as any } });
    await waitFor(() => {
      const backBtn = screen.getByText('Kembali');
      fireEvent.click(backBtn);
      expect(backMock).toHaveBeenCalled();
    });
  });

  it('handles back button on loaded post', () => {
    const post = { id: 1, author: { name: 'A' }, comments: [] };
    renderWithProviders(<DetailPage postId={1} />, { preloadedState: { posts: { post } as any } });
    
    const backBtn = screen.getByText('Kembali', { selector: 'button' });
    fireEvent.click(backBtn);
    expect(backMock).toHaveBeenCalled();
  });

  it('opens change modals and closes them', async () => {
    const post = { id: 1, description: 'Desc', author: { name: 'A' }, is_me: true, comments: [], created_at: '2023-01-01' }; // no cover here, covers missing cover logic!
    renderWithProviders(<DetailPage postId={1} />, { preloadedState: { posts: { post } as any } });
    
    const editBtn = screen.getByTitle('Ubah Postingan');
    fireEvent.click(editBtn);
    
    // Close edit modal
    await waitFor(() => {
      const closeEdit = screen.getByText('Batal', { selector: 'button' });
      fireEvent.click(closeEdit);
    });
    
    const coverBtn = screen.getByTitle('Ubah Gambar Cover');
    fireEvent.click(coverBtn);
    
    // Close cover modal
    await waitFor(() => {
      const closeCover = screen.getAllByText('Batal', { selector: 'button' })[0];
      fireEvent.click(closeCover);
    });
  });
});

