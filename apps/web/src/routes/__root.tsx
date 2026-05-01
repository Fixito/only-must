import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import Error from '@/components/error.tsx';
import Footer from '@/components/footer.tsx';
import Navbar from '@/components/navbar/navbar.tsx';
import { NotFound } from '@/components/not-found.tsx';
import { getThemeServFn } from '@/lib/theme.ts';

import appCss from '../styles.css?url';

const THEME_INIT_SCRIPT = `(function () {
  try {
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('theme='));
    const mode = cookie ? cookie.split('=')[1].trim() : 'auto';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode;
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'auto');
    root.classList.add(resolved);
    if (mode !== 'auto') root.setAttribute('data-theme', mode);
    root.style.colorScheme = resolved;
  } catch {}
})();`;

export const Route = createRootRoute({
  beforeLoad: async () => await getThemeServFn(),
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'OnlyMust',
      },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/must-play.svg' },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  errorComponent: ({ error }) => <Error error={error} />,
  notFoundComponent: () => <NotFound />,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="text-foreground bg-background grid min-h-screen grid-rows-[auto_1fr_auto] antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
