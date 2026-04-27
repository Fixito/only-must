import { Moon, Sun } from 'lucide-react';

import { toggleTheme } from '@/lib/theme.ts';

export function NavbarActions() {
  return (
    <button
      type="button"
      className="focus:outline-ring text-muted-foreground hover:text-navbar-accent-foreground relative rounded-full p-1 focus:outline-2 focus:outline-offset-2"
      onClick={toggleTheme}
    >
      <span className="absolute -inset-1.5" />
      <span className="sr-only">Toggle theme</span>
      <Moon className="text-navbar-foreground dark:hidden" />
      <Sun className="text-navbar-foreground hidden dark:block" />
    </button>
  );
}
