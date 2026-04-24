import { Link } from '@tanstack/react-router';

import type { NavigationItem } from '../data.ts';

interface NavbarLinksProps {
  navigation: Array<NavigationItem>;
}

export function NavbarLinks({ navigation }: NavbarLinksProps) {
  return (
    <div className="flex gap-x-4">
      {navigation.map((item) => (
        <NavbarLink key={item.name} item={item} />
      ))}
    </div>
  );
}

function NavbarLink({ item }: { item: NavigationItem }) {
  return (
    <Link
      key={item.name}
      to={item.href}
      className={
        'data-[status=active]:bg-navbar-primary data-[status=active]:text-navbar-primary-foreground text-navbar-foreground hover:bg-navbar-accent hover:text-navbar-accent-foreground focus-visible:ring-ring focus-visible:border-ring rounded-md px-3 py-2 text-sm font-medium outline-none focus-visible:ring-2'
      }
    >
      {item.name}
    </Link>
  );
}
