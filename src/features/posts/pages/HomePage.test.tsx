import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import HomePage from '../pages/HomePage';
import * as action from '../states/action';
import * as toolsHelper from '../../../helpers/toolsHelper';
import * as navigation from 'next/navigation';

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn().mockReturnValue({ get: vi.fn().mockReturnValue(null) }),
}));



import * as postApi from '../api/postApi';

vi.mock('../../../helpers/toolsHelper', () => ({
  showConfirmDialog: vi.fn(),
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  formatDate: vi.fn().mockReturnValue('1 Jan'),
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders posts correctly', () => {
    const posts = [
      { id: 1, description: 'Desc 1', author: { name: 'A' }, likes_count: 0, comments_count: 0, cover: 'img.png' },
      { id: 2, description: 'Desc 2', author: { name: 'B', avatar: 'img.png' }, likes_count: 0, comments_count: 0 } // no cover, has avatar
    ];
    renderWithProviders(<HomePage />, { preloadedState: { posts: { posts } as any } });
    expect(screen.getByText('Desc 1')).toBeInTheDocument();
    expect(screen.getByText('Desc 2')).toBeInTheDocument();
  });

  it('handles search input', async () => {
    const apiSpy = vi.spyOn(postApi, 'getPostsApi').mockResolvedValue({ response: { ok: true }, data: { data: [] } } as any);
    renderWithProviders(<HomePage />);
    
    const searchInput = screen.getByPlaceholderText('Cari postingan...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith(false, 'test');
    }, { timeout: 1500 });
  });

  it('handles delete all posts', async () => {
    (navigation.useSearchParams as any).mockReturnValue({ get: vi.fn().mockReturnValue('me') });
    (toolsHelper.showConfirmDialog as any).mockResolvedValue({ isConfirmed: true });
    
    const apiSpy = vi.spyOn(postApi, 'deleteAllPostsApi').mockResolvedValue({ response: { ok: true }, data: {} } as any);
    
    const posts = [{ id: 1, description: 'Desc 1', author: { name: 'A' } }];
    renderWithProviders(<HomePage />, { preloadedState: { posts: { posts } as any } });
    
    const delBtn = screen.getByText('Hapus Semua');
    fireEvent.click(delBtn);
    
    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalled();
    });
  });

  it('handles delete all cancel', async () => {
    (toolsHelper.showConfirmDialog as any).mockResolvedValue({ isConfirmed: false });
    const apiSpy = vi.spyOn(postApi, 'deleteAllPostsApi');
    const posts = [{ id: 1, description: 'Desc 1', author: { name: 'A' }, is_me: true }];
    (navigation.useSearchParams as any).mockReturnValue({ get: vi.fn().mockReturnValue('me') });
    renderWithProviders(<HomePage />, { preloadedState: { posts: { posts } as any } });
    
    const delAllBtn = screen.getByText('Hapus Semua');
    fireEvent.click(delAllBtn);
    
    expect(apiSpy).not.toHaveBeenCalled();
    
    // restore mock
    (navigation.useSearchParams as any).mockReturnValue({ get: vi.fn().mockReturnValue(null) });
  });

  it('handles undefined posts in state', () => {
    renderWithProviders(<HomePage />, { preloadedState: {} as any });
    expect(screen.getByText('Tidak ada postingan')).toBeInTheDocument();
  });

  it('handles empty posts object in state', () => {
    renderWithProviders(<HomePage />, { preloadedState: { posts: {} as any } });
    expect(screen.getByText('Tidak ada postingan')).toBeInTheDocument();
  });

  it('renders Postingan Saya when tab is me', () => {
    (navigation.useSearchParams as any).mockReturnValue({ get: vi.fn().mockReturnValue('me') });
    renderWithProviders(<HomePage />);
    expect(screen.getByText('Postingan Saya')).toBeInTheDocument();
    (navigation.useSearchParams as any).mockReturnValue({ get: vi.fn().mockReturnValue(null) });
  });

  it('handles like', () => {
    const apiSpy = vi.spyOn(postApi, 'toggleLikeApi').mockResolvedValue({ response: { ok: true }, data: {} } as any);
    const posts = [{ id: 1, description: 'Desc 1', author: { name: 'A' }, is_liked: true }];
    renderWithProviders(<HomePage />, { preloadedState: { posts: { posts } as any } });
    
    const likeBtn = screen.getByLabelText('Suka postingan');
    fireEvent.click(likeBtn);
    
    expect(apiSpy).toHaveBeenCalledWith(1);
  });

  it('handles like error', async () => {
    const apiSpy = vi.spyOn(postApi, 'toggleLikeApi').mockRejectedValue(new Error('fail'));
    const posts = [{ id: 1, description: 'Desc 1', author: { name: 'A' }, likes_count: 0, comments_count: 0 }];
    renderWithProviders(<HomePage />, { preloadedState: { posts: { posts } as any } });
    
    const likeBtn = screen.getByLabelText('Suka postingan');
    fireEvent.click(likeBtn);
    
    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith(1);
    });
  });

  it('opens add modal from top button and closes it', async () => {
    renderWithProviders(<HomePage />);
    const addBtn = screen.getByText('Buat Post');
    fireEvent.click(addBtn);
    
    await waitFor(() => {
      const closeBtn = screen.getByText('Batal', { selector: 'button' });
      expect(closeBtn).toBeInTheDocument();
      fireEvent.click(closeBtn);
    });
  });

  it('opens add modal from empty state button', async () => {
    renderWithProviders(<HomePage />, { preloadedState: { posts: { posts: [] } as any } });
    const addBtn = screen.getByText('Buat Postingan Baru');
    fireEvent.click(addBtn);
    
    await waitFor(() => {
      const modalTitle = screen.getByText('Buat Postingan Baru', { selector: 'h3' });
      expect(modalTitle).toBeInTheDocument();
    });
  });
});

