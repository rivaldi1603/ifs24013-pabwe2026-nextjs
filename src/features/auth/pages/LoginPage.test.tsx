import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import LoginPage from '../pages/LoginPage';
import * as action from '../states/action';
import * as toolsHelper from '../../../helpers/toolsHelper';
import * as navigation from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('../../../helpers/toolsHelper', () => ({
  showWarningDialog: vi.fn(),
}));



describe('LoginPage', () => {
  let pushMock: any;

  beforeEach(() => {
    pushMock = vi.fn();
    (navigation.useRouter as any).mockReturnValue({ push: pushMock });
    vi.clearAllMocks();
  });

  it('should render the login form', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByText('Selamat Datang Kembali')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('nama@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('should show warning if form is incomplete', async () => {
    renderWithProviders(<LoginPage />);
    const submitBtn = screen.getByRole('button', { name: /Masuk/i });
    
    const form = submitBtn.closest('form') as HTMLFormElement;
    form.noValidate = true;
    fireEvent.submit(form);
    
    expect(toolsHelper.showWarningDialog).toHaveBeenCalledWith('Form tidak lengkap', 'Silakan isi email dan kata sandi Anda.');
  });

  it('should submit form and redirect on success', async () => {
    const { store } = renderWithProviders(<LoginPage />);
    
    // We spy on dispatch to see what actions are dispatched
    const dispatchSpy = vi.spyOn(store, 'dispatch').mockResolvedValue({ 
      meta: { requestStatus: 'fulfilled' },
      payload: {}
    } as any);

    const emailInput = screen.getByPlaceholderText('nama@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: /Masuk/i });

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    
    const form = submitBtn.closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  it('should handle submission error', async () => {
    const { store } = renderWithProviders(<LoginPage />);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(store, 'dispatch').mockRejectedValue(new Error('Login error'));

    const emailInput = screen.getByPlaceholderText('nama@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: /Masuk/i });

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    
    const form = submitBtn.closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Login failed:', expect.any(Error));
    });
  });

  it('should show loading state', () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: {
        auth: {
          isAuthLogin: true,
          isAuthLogout: false,
          isAuthRegister: false
        }
      }
    });

    const submitBtn = screen.getByRole('button');
    expect(submitBtn).toBeDisabled();
    // The spinner should be present, Masuk text shouldn't be
    expect(screen.queryByText('Masuk')).toBeNull();
  });
});
