import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import SidebarComponent from '../components/SidebarComponent';
import * as navigation from 'next/navigation';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/'),
}));

describe('SidebarComponent', () => {
  it('renders all links', () => {
    renderWithProviders(<SidebarComponent isOpen={true} setIsOpen={vi.fn()} />);
    expect(screen.getByText('Semua Postingan')).toBeInTheDocument();
    expect(screen.getByText('Postingan Saya')).toBeInTheDocument();
    expect(screen.getByText('Daftar Pengguna')).toBeInTheDocument();
    expect(screen.getByText('Profil Saya')).toBeInTheDocument();
  });

  it('calls setIsOpen when mobile backdrop is clicked', () => {
    const setIsOpen = vi.fn();
    renderWithProviders(<SidebarComponent isOpen={true} setIsOpen={setIsOpen} />);
    
    // The backdrop is the first div with fixed inset-0
    const backdrop = document.querySelector('.fixed.inset-0.z-40') as HTMLElement;
    fireEvent.click(backdrop);
    
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});
