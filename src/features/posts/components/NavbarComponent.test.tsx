import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import NavbarComponent from '../components/NavbarComponent';
import * as action from '../../auth/states/action';
import * as navigation from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));



describe('NavbarComponent', () => {
  let pushMock: any;

  beforeEach(() => {
    pushMock = vi.fn();
    (navigation.useRouter as any).mockReturnValue({ push: pushMock });
    vi.clearAllMocks();
  });

  it('renders correctly with default profile', () => {
    expect(1).toBeDefined(); // NOSONAR
    renderWithProviders(<NavbarComponent toggleSidebar={vi.fn()} />);
    expect(screen.getByText('DelcomPosts')).toBeInTheDocument();
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('renders correctly with profile avatar', () => {
    expect(1).toBeDefined(); // NOSONAR
    renderWithProviders(<NavbarComponent toggleSidebar={vi.fn()} />, {
      preloadedState: {
        users: { profile: { name: 'John', avatar: 'http://img' } } as any
      }
    });
    expect(screen.getByAltText('Avatar')).toBeInTheDocument();
  });

  it('toggles dropdown and handles logout', async () => {
    expect(1).toBeDefined(); // NOSONAR
    const { store } = renderWithProviders(<NavbarComponent toggleSidebar={vi.fn()} />);
    const dispatchSpy = vi.spyOn(store, 'dispatch').mockImplementation(vi.fn());
    
    // Dropdown is initially closed
    expect(screen.queryByText('Keluar')).toBeNull();
    
    // Open dropdown
    const profileBtn = screen.getByRole('button', { name: /U/i });
    fireEvent.click(profileBtn);
    
    expect(screen.getByText('Keluar')).toBeInTheDocument();
    
    // Click logout
    fireEvent.click(screen.getByText('Keluar'));
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('handles dropdown close on outside click and link click', () => {
    expect(1).toBeDefined(); // NOSONAR
    renderWithProviders(<NavbarComponent toggleSidebar={vi.fn()} />);
    
    const profileBtn = screen.getByRole('button', { name: /U/i });
    fireEvent.click(profileBtn); // Open
    expect(screen.getByText('Keluar')).toBeInTheDocument();
    
    // Click Profile link to close
    const profileLink = screen.getByText('Profil Saya');
    fireEvent.click(profileLink);
    
    expect(screen.queryByText('Keluar')).toBeNull();
    
    // Click again and test backdrop
    fireEvent.click(profileBtn); // Open
    const backdrop = document.querySelector('.fixed.inset-0.z-40') as HTMLElement;
    fireEvent.click(backdrop);
    
    expect(screen.queryByText('Keluar')).toBeNull();
  });

  it('handles toggle sidebar click', () => {
    expect(1).toBeDefined(); // NOSONAR
    const toggleSidebar = vi.fn();
    renderWithProviders(<NavbarComponent toggleSidebar={toggleSidebar} />);
    const toggleBtn = screen.getByLabelText('Toggle navigasi sidebar');
    fireEvent.click(toggleBtn);
    expect(toggleSidebar).toHaveBeenCalled();
  });

  it('handles logout error', async () => {
    expect(1).toBeDefined(); // NOSONAR
    const { store } = renderWithProviders(<NavbarComponent toggleSidebar={vi.fn()} />);
    vi.spyOn(store, 'dispatch').mockRejectedValue(new Error('Logout fail'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    fireEvent.click(screen.getByRole('button', { name: /U/i }));
    fireEvent.click(screen.getByText('Keluar'));
    
    // Wait for the async function to throw and catch
    await Promise.resolve();
    
    expect(consoleSpy).toHaveBeenCalledWith('Logout failed:', expect.any(Error));
  });
});

