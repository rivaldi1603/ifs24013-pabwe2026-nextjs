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
    renderWithProviders(<NavbarComponent toggleSidebar={vi.fn()} />);
    expect(screen.getByText('DelcomPosts')).toBeInTheDocument();
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('renders correctly with profile avatar', () => {
    renderWithProviders(<NavbarComponent toggleSidebar={vi.fn()} />, {
      preloadedState: {
        users: { profile: { name: 'John', avatar: 'http://img' } } as any
      }
    });
    expect(screen.getByAltText('Avatar')).toBeInTheDocument();
  });

  it('toggles dropdown and handles logout', async () => {
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
});
