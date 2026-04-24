import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useRef, useState } from 'react';

import { navigation } from './data.ts';
import { NavbarLinks } from './ui/links.tsx';
import { NavbarMobileMenu } from './ui/mobile-menu.tsx';
import { SearchForm } from './ui/search-form.tsx';
import { NavbarToggle } from './ui/toggle.tsx';

// TODO: Implement dark mode toggle

export default function Navbar() {
  const { search } = useSearch({ from: '/' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(search || '');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const handleToggleMenu = () => {
    setIsMobileMenuOpen((open) => !open);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchInput(searchInput.trim());
    await navigate({
      to: '/',
      search: (prev) => ({ ...prev, search: searchInput }),
    });
  };

  return (
    <nav className="bg-navbar after:bg-navbar-border relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px">
      <div className="relative container flex h-16 items-center justify-between gap-x-6">
        <div className="flex items-center gap-6 lg:items-stretch lg:justify-start">
          <Link
            to="/"
            className="text-primary-foreground focus-visible:ring-ring w-auto shrink-0 self-center text-2xl font-semibold outline-none focus-visible:ring-2"
          >
            OnlyMust
          </Link>

          <div className="hidden lg:block">
            <NavbarLinks navigation={navigation} />
          </div>
        </div>

        <div className="flex flex-1 justify-end">
          <SearchForm
            handleSubmit={handleSubmit}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
          />

          <div className="flex items-center gap-x-2">
            {/* <NavbarActions /> */}
            <NavbarToggle
              isMobileMenuOpen={isMobileMenuOpen}
              onClick={handleToggleMenu}
              ref={buttonRef}
            />
          </div>
        </div>
      </div>

      <NavbarMobileMenu
        navigation={navigation}
        isMobileMenuOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        buttonRef={buttonRef}
      />
    </nav>
  );
}
