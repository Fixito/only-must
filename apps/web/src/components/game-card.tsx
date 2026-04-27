import { Link } from '@tanstack/react-router';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { formatdate } from '@/lib/date.ts';

interface GameCardProps {
  game: {
    id: string;
    slug: string;
    title: string;
    description: string;
    releaseDate: string | null;
    metaScore: number;
    image: string;
  };
  index: number;
}

export default function GameCard({ game, index }: GameCardProps) {
  const { id, slug, title, image, description, releaseDate, metaScore } = game;

  return (
    <Card
      key={id}
      className="bg-card text-card-foreground group has-focus-visible:border-ring has-focus-visible:ring-ring relative isolate grid cursor-pointer grid-cols-[7rem_auto] gap-4 p-0 shadow-sm transition-shadow outline-none hover:shadow-lg has-focus-visible:ring-3"
    >
      <div className="relative shrink-0">
        <img src={image} alt={title} className="h-full w-full object-cover" />
        <img
          src="/must-play.svg"
          alt="must-play"
          loading="lazy"
          className="absolute inset-be-0 left-1/2 z-10 aspect-square w-12 -translate-x-1/2 object-cover"
        />
      </div>

      <CardContent className="py-4 ps-0">
        <CardHeader className="px-0">
          <CardTitle className="group-hover:text-muted-foreground text-foreground flex gap-1 text-base font-semibold transition-colors">
            <span>{index + 1}.</span>
            <h3 className="line-clamp-1">
              <Link
                to="/games/$slug"
                params={{ slug: slug }}
                className="focus-visible:outline-none"
                preload="intent"
              >
                {title}
                <span aria-hidden="true" className="absolute inset-0 z-10"></span>
              </Link>
            </h3>
          </CardTitle>

          <CardDescription>
            <time dateTime={releaseDate ?? undefined} className="text-xs">
              {releaseDate ? formatdate(releaseDate) : null}
            </time>
          </CardDescription>
        </CardHeader>

        <CardDescription className="mbs-3 line-clamp-2 text-sm text-ellipsis">
          {description}
        </CardDescription>

        <CardFooter className="mbs-3 gap-2 px-0">
          <span className="inline-flex aspect-square items-center justify-center bg-green-900 px-1 text-sm font-semibold text-white">
            {metaScore}
          </span>
          <span className="text-muted-foreground text-sm">Metascore</span>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
