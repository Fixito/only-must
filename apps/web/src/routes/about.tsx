import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container space-y-12 py-12">
      {/* Hero */}
      <header className="max-w-2xl space-y-4">
        <h1 className="text-3xl font-semibold">About OnlyMust</h1>

        <p className="text-muted-foreground">
          OnlyMust helps you find the best video games ever made — fast.
        </p>

        <p className="text-muted-foreground">
          No noise. No endless lists. Just curated, must-play games across all platforms.
        </p>
      </header>

      {/* What */}
      <section className="max-w-2xl space-y-3">
        <h2 className="text-xl font-semibold">What is OnlyMust?</h2>

        <p className="text-muted-foreground">
          OnlyMust is a curated database of top-rated games. Instead of browsing thousands of
          titles, you only see games that are widely considered essential.
        </p>

        <p className="text-muted-foreground">
          You can filter by platform, genre or release year to quickly find your next must-play
          game.
        </p>
      </section>

      {/* How */}
      <section className="max-w-2xl space-y-3">
        <h2 className="text-xl font-semibold">How does it work?</h2>

        <p className="text-muted-foreground">
          The data is collected from trusted sources and filtered to keep only the highest-rated
          titles. Each game includes key information such as platforms, release date, and metascore.
        </p>

        <p className="text-muted-foreground">
          The goal is simple: reduce choice overload and help you pick great games faster.
        </p>
      </section>

      {/* Tech */}
      <section className="max-w-2xl space-y-3">
        <h2 className="text-xl font-semibold">Tech stack</h2>

        <ul className="text-muted-foreground list-disc space-y-1 pl-5">
          <li>React + TanStack Router + React Query</li>
          <li>Node.js + Express</li>
          <li>PostgreSQL (Neon) + Drizzle ORM</li>
          <li>Web scraping with Playwright</li>
        </ul>
      </section>

      {/* Dev */}
      <section className="max-w-2xl space-y-3">
        <h2 className="text-xl font-semibold">About the developer</h2>

        <p className="text-muted-foreground">
          This project was built to practice full-stack development and explore modern React
          patterns such as server data fetching, caching, and UX optimizations.
        </p>

        <p className="text-muted-foreground">
          It focuses on performance, simplicity, and real-world constraints like free hosting and
          API limitations.
        </p>
      </section>
    </div>
  );
}
