import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import HomePage from '../pages/HomePage';
import * as action from '../states/action';
import * as toolsHelper from '../../../helpers/toolsHelper';
import * as navigation from 'next/navigation';

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn().mockReturnValue({ get: vi.fn() }),
}));



import * as postApi from '../api/postApi';

vi.mock('../../../helpers/toolsHelper', () => ({
  showConfirmDialog: vi.fn(),
  formatDate: vi.fn().mockReturnValue('1 Jan'),
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders posts correctly', () => {
    const posts = [
      { id: 1, description: 'Desc 1', author: { name: 'A' }, likes_count: 0, comments_count: 0 },
    ];
    renderWithProviders(<HomePage />, { preloadedState: { posts: { posts } as any } });
    expect(screen.getByText('Desc 1')).toBeInTheDocument();
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
});
