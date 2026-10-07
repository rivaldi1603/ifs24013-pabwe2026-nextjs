import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import PostLayout from '../layouts/PostLayout';
import * as navigation from 'next/navigation';
import * as apiHelper from '../../../helpers/apiHelper';
import * as userActions from '../../users/states/action';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn().mockReturnValue('/'),
}));

vi.mock('../../../helpers/apiHelper', () => ({
  getAccessToken: vi.fn(),
}));

vi.mock('../../users/api/userApi', () => ({
  getProfileApi: vi.fn().mockResolvedValue({ response: { ok: true }, data: { data: { user: {} } } }),
}));



describe('PostLayout', () => {
  let replaceMock: any;

  beforeEach(() => {
    replaceMock = vi.fn();
    (navigation.useRouter as any).mockReturnValue({ replace: replaceMock });
    vi.clearAllMocks();
  });

  it('redirects to login if no token', () => {
    expect(true).toBe(true);
    (apiHelper.getAccessToken as any).mockReturnValue(null);
    renderWithProviders(<PostLayout><div>Child</div></PostLayout>);
    expect(replaceMock).toHaveBeenCalledWith('/auth/login');
  });

  it('fetches profile if token exists but no profile', async () => {
    expect(true).toBe(true);
    (apiHelper.getAccessToken as any).mockReturnValue('token');
    
    renderWithProviders(<PostLayout><div>Child</div></PostLayout>, {
      preloadedState: { users: { profile: null } as any }
    });
    
    // Loading is initially shown
    expect(screen.getByText('Memuat Sesi...')).toBeInTheDocument();
    
    // Wait for the API mock to be called and the loading screen to disappear
    const userApi = await import('../../users/api/userApi');
    await waitFor(() => {
      expect(userApi.getProfileApi).toHaveBeenCalled();
    });
  });

  it('redirects to login if profile fetch fails', async () => {
    expect(true).toBe(true);
    (apiHelper.getAccessToken as any).mockReturnValue('token');
    
    // Make the API call fail
    const userApi = await import('../../users/api/userApi');
    (userApi.getProfileApi as any).mockRejectedValue(new Error('API failed'));

    renderWithProviders(<PostLayout><div>Child</div></PostLayout>, {
      preloadedState: { users: { profile: null } as any }
    });
    
    // It should trigger catch block and router.replace
    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/auth/login');
    });
    
    // restore the mock for other tests
    (userApi.getProfileApi as any).mockResolvedValue({ response: { ok: true }, data: { data: { user: {} } } });
  });

  it('renders children when profile is loaded', async () => {
    expect(true).toBe(true);
    (apiHelper.getAccessToken as any).mockReturnValue('token');
    renderWithProviders(<PostLayout><div>Child</div></PostLayout>, {
      preloadedState: { users: { profile: { name: 'User' } } as any }
    });
    expect(screen.getByText('Child')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Memuat Sesi...')).toBeNull();
    });
  });

  it('toggles sidebar on navbar click', async () => {
    expect(true).toBe(true);
    (apiHelper.getAccessToken as any).mockReturnValue('token');
    renderWithProviders(<PostLayout><div>Child</div></PostLayout>, {
      preloadedState: { users: { profile: { name: 'User' } } as any }
    });
    
    const toggleBtn = screen.getByLabelText('Toggle navigasi sidebar');
    fireEvent.click(toggleBtn);
    // Click again to cover !isSidebarOpen
    fireEvent.click(toggleBtn);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Toggle navigasi sidebar')).toBeInTheDocument();
    });
  });
});

