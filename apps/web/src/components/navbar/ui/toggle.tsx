import { Menu, X } from 'lucide-react';

interface NavbarToggleProps {
  isMobileMenuOpen: boolean;
  onClick: () => void;
  ref?: React.Ref<HTMLButtonElement>;
}

export function NavbarToggle({ isMobileMenuOpen, onClick, ref }: NavbarToggleProps) {
  return (
    <button
      type="button"
      className="focus:outline-ring text-muted-foreground hover:text-navbar-accent-foreground hover:bg-navbar-accent relative inline-flex items-center justify-center rounded-md p-2 focus:outline-2 focus:-outline-offset-1 sm:hidden"
      aria-controls="mobile-menu"
      aria-expanded={isMobileMenuOpen}
      ref={ref}
      onClick={onClick}
    >
      <span className="absolute -inset-0.5" />
      <span className="sr-only">{isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
      {isMobileMenuOpen ? (
        <X aria-hidden="true" className="size-6" />
      ) : (
        <Menu aria-hidden="true" className="size-6" />
      )}
    </button>
  );
}
