import { useRouteContext, useRouter } from '@tanstack/react-router';
import { Monitor, Moon, Sun } from 'lucide-react';

import { setThemeServFn } from '@/lib/theme.ts';

export function NavbarActions() {
  const { theme } = useRouteContext({ from: '__root__' });
  const router = useRouter();

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.findIndex((t) => t === theme);
    const nextTheme =
      themes[(currentIndex === -1 ? 0 : currentIndex + 1) % themes.length] ?? 'system';

    const html = document.documentElement;
    html.classList.remove('dark', 'auto');
    html.style.colorScheme = '';

    if (nextTheme === 'dark') {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
    } else if (nextTheme === 'light') {
      html.style.colorScheme = 'light';
    } else {
      html.classList.add('auto');
      html.style.colorScheme = 'light dark';
    }

    void setThemeServFn({ data: nextTheme }).then(() => router.invalidate());
  };

  return (
    <button
      type="button"
      className="focus:outline-ring text-muted-foreground hover:text-navbar-accent-foreground relative rounded-full p-1 focus:outline-2 focus:outline-offset-2"
      onClick={toggleTheme}
    >
      <span className="absolute -inset-1.5" />
      <span className="sr-only">Toggle dark mode</span>
      {theme === 'dark' ? (
        <Sun aria-hidden="true" className="size-6" />
      ) : theme === 'light' ? (
        <Moon aria-hidden="true" className="size-6" />
      ) : (
        <Monitor aria-hidden="true" className="size-6" />
      )}
    </button>
  );
}
