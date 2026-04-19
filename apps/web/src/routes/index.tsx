import { GamesQuerySchema } from '@only-must/shared';
import { createFileRoute, Link } from '@tanstack/react-router';

import Error from '@/components/error.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { gamesQueryOptions } from '@/features/games/use-games.ts';
import { formatdate } from '@/lib/date.ts';
import { getPaginationItems } from '@/lib/pagination';
import { queryClient } from '@/router.tsx';

export const Route = createFileRoute('/')({
  validateSearch: (search) => GamesQuerySchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => queryClient.ensureQueryData(gamesQueryOptions(deps)),
  component: App,
  errorComponent: Error,
});

function App() {
  const {
    data,
    meta: { page, total, totalPages, hasNext, hasPrev },
  } = Route.useLoaderData();

  return (
    <>
      <div className="container py-12">
        <h1 className="text-foreground text-2xl font-semibold lg:text-3xl">
          Must Play Games of All Time
        </h1>

        <p className="text-muted-foreground mbs-2 text-base">
          Find your next game for any platform. Filter by platform, genre, or release year.
        </p>
      </div>

      <div className="container">
        <div>
          <p className="text-muted-foreground font-light">{total} results</p>
        </div>

        <div className="mbs-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((game, index) => (
            <Card
              key={game.id}
              className="group relative isolate grid grid-cols-[7rem_auto] p-0 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative shrink-0">
                <img
                  src={game.image || undefined}
                  alt={game.title || 'Game image'}
                  className="h-full w-full object-cover"
                />
                <img
                  src="must-play.svg"
                  alt="must-play"
                  className="absolute inset-be-0 left-1/2 z-10 aspect-square w-12 -translate-x-1/2 object-cover"
                />
              </div>

              <CardContent className="px-0 py-4">
                <CardHeader className="px-0">
                  <CardTitle className="group-hover:text-muted-foreground flex gap-1 text-base font-semibold transition-colors">
                    <span>{index + 1}.</span>{' '}
                    <h3>
                      <Link to=".">
                        {game.title}
                        {/* <span aria-hidden="true" className="absolute inset-0"></span> */}
                      </Link>
                    </h3>
                  </CardTitle>

                  <CardDescription>
                    <time dateTime={game.releaseDate ?? undefined}>
                      {game.releaseDate ? formatdate(game.releaseDate) : ''}
                    </time>
                  </CardDescription>
                </CardHeader>

                <CardDescription className="mbs-1 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis praesentium
                  enim magni itaque perspiciatis. Eligendi!
                </CardDescription>

                <CardFooter className="mbs-1 gap-1 px-0">
                  <span className="inline-flex aspect-square items-center justify-center bg-green-900 px-1 text-xs font-semibold text-white">
                    {game.metaScore}
                  </span>

                  <span className="text-muted-foreground font-light">Metascore</span>
                </CardFooter>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mbs-8">
          <Pagination>
            <PaginationContent>
              {hasPrev && (
                <PaginationItem>
                  <PaginationPrevious
                    to="."
                    search={(prev) => ({
                      ...prev,
                      page: (prev.page ?? 1) - 1,
                    })}
                  />
                </PaginationItem>
              )}

              {getPaginationItems(page, totalPages).map((item, i) =>
                item === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      to="."
                      search={(prev) => ({ ...prev, page: item })}
                      isActive={page === item}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              {hasNext && (
                <PaginationItem>
                  <PaginationNext
                    to="."
                    search={(prev) => ({
                      ...prev,
                      page: (prev.page ?? 1) + 1,
                    })}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
}
