import { describe, it, expect, vi } from 'vitest';
import { showSuccessDialog, showErrorDialog, showWarningDialog, showConfirmDialog, formatDate } from '../helpers/toolsHelper';
import Swal from 'sweetalert2';

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
  },
}));

describe('toolsHelper', () => {
  describe('SweetAlert functions', () => {
    it('should call showSuccessDialog with correct options', async () => {
      await showSuccessDialog('Success', 'Operation successful');
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'success',
          title: 'Success',
          text: 'Operation successful',
        })
      );
    });

    it('should call showErrorDialog with correct options', async () => {
      await showErrorDialog('Error', 'Operation failed');
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'error',
          title: 'Error',
          text: 'Operation failed',
        })
      );
    });

    it('should call showWarningDialog with correct options', async () => {
      await showWarningDialog('Warning', 'Be careful');
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'warning',
          title: 'Warning',
          text: 'Be careful',
        })
      );
    });

    it('should call showConfirmDialog with correct options', async () => {
      await showConfirmDialog('Are you sure?', 'This cannot be undone');
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'question',
          title: 'Are you sure?',
          text: 'This cannot be undone',
          showCancelButton: true,
        })
      );
    });
  });

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const dateString = '2023-10-05T12:00:00Z';
      const formatted = formatDate(dateString);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should return empty string if date is not provided', () => {
      expect(formatDate('')).toBe('');
    });
  });
});
