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
  formatDate: vi.fn().mockReturnValue('1 Jan'),
}));

describe('DetailPage', () => {
  let backMock: any;
  beforeEach(() => {
    backMock = vi.fn();
    (navigation.useRouter as any).mockReturnValue({ back: backMock });
    vi.clearAllMocks();
  });

  it('renders not found if no post', async () => {
    vi.spyOn(postApi, 'getPostDetailApi').mockResolvedValue({ response: { ok: false }, data: {} } as any);
    renderWithProviders(<DetailPage postId={1} />);
    await waitFor(() => {
      expect(screen.getByText('Postingan tidak ditemukan')).toBeInTheDocument();
    });
  });

  it('renders post details', async () => {
    const post = { 
      id: 1, description: 'Detail Desc', author: { name: 'Author' }, 
      is_me: true, likes_count: 5, comments_count: 0, comments: []
    };
    renderWithProviders(<DetailPage postId={1} />, { preloadedState: { posts: { post } as any } });
    await waitFor(() => {
      expect(screen.getByText('Detail Desc')).toBeInTheDocument();
      expect(screen.getByText('Author')).toBeInTheDocument();
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
});
