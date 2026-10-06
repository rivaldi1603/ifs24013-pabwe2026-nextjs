import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import ChangeCoverModal from '../modals/ChangeCoverModal';
import * as postApi from '../api/postApi';




vi.mock('../../../helpers/toolsHelper', () => ({ showSuccessDialog: vi.fn(), showErrorDialog: vi.fn(), showConfirmDialog: vi.fn().mockResolvedValue({ isConfirmed: true }) }));
describe('ChangeCoverModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders and handles upload', async () => {
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    const apiSpy = vi.spyOn(postApi, 'updatePostCoverApi').mockResolvedValue({ response: { ok: true }, data: {} } as any);
    renderWithProviders(<ChangeCoverModal isOpen={true} onClose={vi.fn()} postId={1} />);
    
    // Try clicking when file is empty (should not call api)
    const submitBtn = screen.getByRole('button', { name: /Unggah Cover/i });
    const form = submitBtn.closest('form');
    if (form) fireEvent.submit(form);
    expect(apiSpy).not.toHaveBeenCalled();
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    
    // Empty files branch
    fireEvent.change(fileInput, { target: { files: null } });
    
    // Valid file branch
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith(1, file);
    });
  });

  it('handles close button', () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeCoverModal isOpen={true} onClose={onClose} postId={1} />);
    const closeBtns = screen.getAllByRole('button');
    // first button is X icon, second is Batal
    fireEvent.click(screen.getByRole('button', { name: /Batal/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('clicks file input on area click', () => {
    renderWithProviders(<ChangeCoverModal isOpen={true} onClose={vi.fn()} postId={1} />);
    const clickArea = screen.getByText('Klik untuk memilih gambar');
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, 'click');
    fireEvent.click(clickArea);
    expect(clickSpy).toHaveBeenCalled();
  });

  it('closes automatically when isPostChangedCover is true', () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeCoverModal isOpen={true} onClose={onClose} postId={1} />, {
      preloadedState: { posts: { isPostChangedCover: true } } as any
    });
    expect(onClose).toHaveBeenCalled();
  });
});


