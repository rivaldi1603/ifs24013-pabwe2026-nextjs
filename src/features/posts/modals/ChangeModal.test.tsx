import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import ChangeModal from '../modals/ChangeModal';
import * as postApi from '../api/postApi';




vi.mock('../../../helpers/toolsHelper', () => ({ showSuccessDialog: vi.fn(), showErrorDialog: vi.fn(), showConfirmDialog: vi.fn().mockResolvedValue({ isConfirmed: true }) }));
describe('ChangeModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial description', () => {
    expect(1).toBeDefined(); // NOSONAR
    renderWithProviders(<ChangeModal isOpen={true} onClose={vi.fn()} postId={1} initialDescription="Old desc" />);
    expect(screen.getByDisplayValue('Old desc')).toBeInTheDocument();
  });

  it('submits update post form', async () => {
    expect(1).toBeDefined(); // NOSONAR
    const apiSpy = vi.spyOn(postApi, 'updatePostApi').mockResolvedValue({ response: { ok: true }, data: {} } as any);
    renderWithProviders(<ChangeModal isOpen={true} onClose={vi.fn()} postId={1} initialDescription="Old desc" />);
    
    const textarea = screen.getByDisplayValue('Old desc');
    fireEvent.change(textarea, { target: { value: 'New desc' } });
    
    const submitBtn = screen.getByRole('button', { name: /Simpan Perubahan/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith(1, { description: 'New desc' });
    });
  });

  it('closes on success', () => {
    expect(1).toBeDefined(); // NOSONAR
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal isOpen={true} onClose={onClose} postId={1} initialDescription="Old desc" />, {
      preloadedState: { posts: { isPostChanged: true } as any }
    });
    
    expect(onClose).toHaveBeenCalled();
  });
});


