import { Link } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

import type { NavigationItem } from '../data.ts';

interface NavbarMobileMenuProps {
  navigation: Array<NavigationItem>;
  isMobileMenuOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

export function NavbarMobileMenu({
  navigation,
  isMobileMenuOpen,
  onClose,
  buttonRef,
}: NavbarMobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobileMenuOpen || !menuRef.current) return undefined;

    const menu = menuRef.current;
    const focusable = menu.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])',
    );

    if (focusable.length && focusable[0]) focusable[0].focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        if (buttonRef.current) buttonRef.current.focus();
      }

      if (e.key === 'Tab' && focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    menu.addEventListener('keydown', handleKeyDown);

    return () => menu.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, onClose, buttonRef]);

  if (!isMobileMenuOpen) return null;

  return (
    <div id="mobile-menu" ref={menuRef} className="mobile-menu-animate block sm:hidden">
      <div className="space-y-1 px-2 pt-2 pb-3">
        {navigation.map((item, i) => (
          <NavbarMobileMenuItem key={item.name} item={item} index={i} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}

function NavbarMobileMenuItem({
  item,
  index,
  onClose,
}: {
  item: NavigationItem;
  index: number;
  onClose: () => void;
}) {
  return (
    <Link
      to={item.href}
      className="text-navbar-foreground hover:bg-navbar-accent hover:text-navbar-accent-foreground mobile-menu-item-animate data-[status=active]:bg-navbar-primary data-[status=active]:text-navbar-primary-foreground focus-visible:ring-ring focus-visible:border-ring block rounded-md px-3 py-2 text-base font-medium outline-none focus-visible:ring-2"
      style={{
        transitionDelay: `${index * 40}ms`,
      }}
      onClick={onClose}
    >
      {item.name}
    </Link>
  );
}
