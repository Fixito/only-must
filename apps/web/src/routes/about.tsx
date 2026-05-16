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
          Search by title, filter by platform, genre, release year, or playtime to quickly find your
          next must-play game. Sort by best rated, newest, oldest, or game duration.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-2xl space-y-3">
        <h2 className="text-xl font-semibold">Features</h2>

        <ul className="text-muted-foreground list-disc space-y-1 pl-5">
          <li>Curated catalog of the highest-rated games across all platforms</li>
          <li>Search by title</li>
          <li>Filter by platform, genre, release year, and playtime</li>
          <li>Sort by best rated, newest, oldest, shortest or longest duration</li>
          <li>
            Game detail pages with description, developer info, platforms, genres, Metascore, and
            playtime breakdown (Main Story / Main Story + Sides / Completionist)
          </li>
        </ul>
      </section>

      {/* How */}
      <section className="max-w-2xl space-y-3">
        <h2 className="text-xl font-semibold">How does it work?</h2>

        <p className="text-muted-foreground">
          Game scores and metadata are scraped from Metacritic using Playwright. Only titles above a
          high score threshold are kept, eliminating the noise from mediocre releases.
        </p>

        <p className="text-muted-foreground">
          Playtime data (Main Story, Main Story + Sides, Completionist) is synced from HowLongToBeat
          and stored alongside each game, so you can filter and sort by how long a game actually
          takes to finish.
        </p>

        <p className="text-muted-foreground">
          The goal is simple: reduce choice overload and help you pick great games faster.
        </p>
      </section>

      {/* Tech */}
      <section className="max-w-2xl space-y-3">
        <h2 className="text-xl font-semibold">Tech stack</h2>

        <ul className="text-muted-foreground list-disc space-y-1 pl-5">
          <li>React 19 + TanStack Start + TanStack Router + React Query</li>
          <li>Tailwind CSS v4 + shadcn/ui</li>
          <li>Node.js + Express 5</li>
          <li>PostgreSQL (Neon) + Drizzle ORM</li>
          <li>Web scraping with Playwright + HowLongToBeat sync</li>
          <li>Deployed on Netlify</li>
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
