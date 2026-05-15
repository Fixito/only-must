import { useIsFetching } from '@tanstack/react-query';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { gamesQueryOptions } from '@/features/games/queries/games.query.ts';
import { getPaginationItems } from '@/lib/pagination';

interface Props {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function GamesPagination({ page, totalPages, hasNext, hasPrev }: Props) {
  const isFetching = useIsFetching({ queryKey: gamesQueryOptions().queryKey.slice(0, 1) }) > 0;

  if (totalPages <= 1) return null;

  return (
    <div className="mbs-8">
      <Pagination>
        <PaginationContent>
          {hasPrev && (
            <PaginationItem>
              <PaginationPrevious
                to="."
                search={(prev) => ({ ...prev, page: (prev.page ?? 1) - 1 })}
                preload="intent"
                disabled={isFetching}
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
                  preload="intent"
                  disabled={isFetching}
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
                search={(prev) => ({ ...prev, page: (prev.page ?? 1) + 1 })}
                preload="intent"
                disabled={isFetching}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
