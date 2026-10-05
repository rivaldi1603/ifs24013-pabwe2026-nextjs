import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import ProfilePage from '../pages/ProfilePage';
import * as action from '../states/action';



describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: { isProfile: true, profile: null } as any
      }
    });
    // If it's loading and no profile, the spinner should be visible, texts shouldn't
    expect(screen.queryByText('Pengaturan Profil')).toBeNull();
  });

  it('should render profile data', () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: { 
          profile: { name: 'John', email: 'j@j.com', avatar: 'http://avatar' },
          isProfile: false 
        } as any
      }
    });
    expect(screen.getByText('Pengaturan Profil')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('j@j.com')).toBeInTheDocument();
  });

  it('should handle update profile', async () => {
    const { store } = renderWithProviders(<ProfilePage />, {
      preloadedState: { users: { profile: { name: 'John' } } as any }
    });
    const dispatchSpy = vi.spyOn(store, 'dispatch').mockImplementation(vi.fn());
    
    const nameInput = screen.getByDisplayValue('John');
    fireEvent.change(nameInput, { target: { value: 'Johnny' } });
    
    const saveBtn = screen.getByRole('button', { name: /Simpan Perubahan/i });
    fireEvent.click(saveBtn);
    
    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  it('should handle update password', async () => {
    const { store } = renderWithProviders(<ProfilePage />, {
      preloadedState: { users: { profile: { name: 'John' } } as any }
    });
    
    // We mock the dispatch directly to simulate fullfilled match
    const dispatchSpy = vi.spyOn(store, 'dispatch').mockResolvedValue({ 
      meta: { requestStatus: 'fulfilled' } 
    } as any);

    const passwordInputs = Array.from(document.querySelectorAll('input[type="password"]'));
    
    fireEvent.change(passwordInputs[0], { target: { value: 'old123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'new123' } });
    
    const saveBtn = screen.getByRole('button', { name: /Perbarui Kata Sandi/i });
    fireEvent.click(saveBtn);
    
    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });
});
