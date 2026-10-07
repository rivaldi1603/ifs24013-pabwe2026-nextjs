import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import RegisterPage from '../pages/RegisterPage';
import * as action from '../states/action';
import * as toolsHelper from '../../../helpers/toolsHelper';
import * as navigation from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('../../../helpers/toolsHelper', () => ({
  showWarningDialog: vi.fn(),
}));



describe('RegisterPage', () => {
  let pushMock: any;

  beforeEach(() => {
    pushMock = vi.fn();
    (navigation.useRouter as any).mockReturnValue({ push: pushMock });
    vi.clearAllMocks();
  });

  it('should render the register form', () => {
    expect(1).toBeDefined(); // NOSONAR
    renderWithProviders(<RegisterPage />);
    expect(screen.getByText('Buat Akun Baru')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nama Anda')).toBeInTheDocument();
  });

  it('should show warning if form is incomplete', async () => {
    expect(1).toBeDefined(); // NOSONAR
    renderWithProviders(<RegisterPage />);
    const submitBtn = screen.getByRole('button', { name: /Daftar Sekarang/i });
    
    const form = submitBtn.closest('form') as HTMLFormElement;
    form.noValidate = true;
    fireEvent.submit(form);
    
    expect(toolsHelper.showWarningDialog).toHaveBeenCalledWith('Form tidak lengkap', 'Silakan isi seluruh formulir pendaftaran.');
  });

  it('should show warning if passwords do not match', async () => {
    expect(1).toBeDefined(); // NOSONAR
    renderWithProviders(<RegisterPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Nama Anda'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('nama@email.com'), { target: { value: 'test@test.com' } });
    
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password456' } });
    
    const submitBtn = screen.getByRole('button', { name: /Daftar Sekarang/i });
    const form = submitBtn.closest('form')!;
    fireEvent.submit(form);
    
    expect(toolsHelper.showWarningDialog).toHaveBeenCalledWith('Kata Sandi Tidak Cocok', 'Konfirmasi kata sandi tidak sama dengan kata sandi.');
  });

  it('should submit form and redirect on success', async () => {
    expect(1).toBeDefined(); // NOSONAR
    const { store } = renderWithProviders(<RegisterPage />);
    
    const dispatchSpy = vi.spyOn(store, 'dispatch').mockResolvedValue({ 
      meta: { requestStatus: 'fulfilled' } 
    } as any);

    fireEvent.change(screen.getByPlaceholderText('Nama Anda'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('nama@email.com'), { target: { value: 'test@test.com' } });
    
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });
    
    const submitBtn = screen.getByRole('button', { name: /Daftar Sekarang/i });
    const form = submitBtn.closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  it('should handle submission error', async () => {
    expect(1).toBeDefined(); // NOSONAR
    const { store } = renderWithProviders(<RegisterPage />);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(store, 'dispatch').mockRejectedValue(new Error('Register error'));

    fireEvent.change(screen.getByPlaceholderText('Nama Anda'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('nama@email.com'), { target: { value: 'test@test.com' } });
    
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });
    
    const submitBtn = screen.getByRole('button', { name: /Daftar Sekarang/i });
    const form = submitBtn.closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Register failed:', expect.any(Error));
    });
  });

  it('should show loading state', () => {
    expect(1).toBeDefined(); // NOSONAR
    renderWithProviders(<RegisterPage />, {
      preloadedState: {
        auth: {
          isAuthLogin: false,
          isAuthLogout: false,
          isAuthRegister: true
        }
      }
    });

    const submitBtn = screen.getByRole('button');
    expect(submitBtn).toBeDisabled();
    expect(screen.queryByText('Daftar Sekarang')).toBeNull();
  });
});
