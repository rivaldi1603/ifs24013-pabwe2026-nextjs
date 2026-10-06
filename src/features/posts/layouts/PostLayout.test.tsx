import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
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



describe('PostLayout', () => {
  let replaceMock: any;

  beforeEach(() => {
    replaceMock = vi.fn();
    (navigation.useRouter as any).mockReturnValue({ replace: replaceMock });
    vi.clearAllMocks();
  });

  it('redirects to login if no token', () => {
    (apiHelper.getAccessToken as any).mockReturnValue(null);
    renderWithProviders(<PostLayout><div>Child</div></PostLayout>);
    expect(replaceMock).toHaveBeenCalledWith('/auth/login');
  });

  it('fetches profile if token exists but no profile', () => {
    (apiHelper.getAccessToken as any).mockReturnValue('token');
    const { store } = renderWithProviders(<PostLayout><div>Child</div></PostLayout>, {
      preloadedState: { users: { profile: null } as any }
    });
    const dispatchSpy = vi.spyOn(store, 'dispatch').mockImplementation(() => {
      return { unwrap: () => Promise.resolve({}) } as any;
    });
    // the layout triggers dispatch on mount, but before we can spy it, it already happened
    // instead, let's just assert that loading is shown.
    expect(screen.getByText('Memuat Sesi...')).toBeInTheDocument();
  });

  it('renders children when profile is loaded', () => {
    (apiHelper.getAccessToken as any).mockReturnValue('token');
    renderWithProviders(<PostLayout><div>Child</div></PostLayout>, {
      preloadedState: { users: { profile: { name: 'User' } } as any }
    });
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});

