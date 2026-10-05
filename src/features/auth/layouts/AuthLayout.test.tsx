import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuthLayout from '../layouts/AuthLayout';
import * as apiHelper from '../../../helpers/apiHelper';
import * as navigation from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('../../../helpers/apiHelper', () => ({
  getAccessToken: vi.fn(),
}));

describe('AuthLayout', () => {
  let replaceMock: any;

  beforeEach(() => {
    replaceMock = vi.fn();
    (navigation.useRouter as any).mockReturnValue({ replace: replaceMock });
    vi.clearAllMocks();
  });

  it('should redirect to / if token exists', () => {
    (apiHelper.getAccessToken as any).mockReturnValue('token');
    render(<AuthLayout><div>Test Child</div></AuthLayout>);
    
    expect(replaceMock).toHaveBeenCalledWith('/');
    // When checking, the child is not rendered, a spinner is shown
    expect(screen.queryByText('Test Child')).toBeNull();
  });

  it('should render children if no token exists', () => {
    (apiHelper.getAccessToken as any).mockReturnValue(null);
    render(<AuthLayout><div>Test Child</div></AuthLayout>);
    
    expect(replaceMock).not.toHaveBeenCalled();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
