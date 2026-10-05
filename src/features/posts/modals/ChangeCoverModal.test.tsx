import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import ChangeCoverModal from '../modals/ChangeCoverModal';
import * as postApi from '../api/postApi';



describe('ChangeCoverModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders and handles upload', async () => {
    global.URL.createObjectURL = vi.fn();
    const apiSpy = vi.spyOn(postApi, 'updatePostCoverApi').mockResolvedValue({ response: { ok: true }, data: {} } as any);
    renderWithProviders(<ChangeCoverModal isOpen={true} onClose={vi.fn()} postId={1} />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    const submitBtn = screen.getByRole('button', { name: /Unggah Cover/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith(1, file);
    });
  });
});
