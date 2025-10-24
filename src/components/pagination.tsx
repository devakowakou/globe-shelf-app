'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PaginationComponent({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const getPaginationNumbers = () => {
    const delta = 1;
    const left = currentPage - delta;
    const right = currentPage + delta + 1;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) {
        range.push(i);
      }
    }

    let l: number | null = null;
    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {getPaginationNumbers().map((page, index) =>
        typeof page === 'number' ? (
          <Button
            key={`${page}-${index}`}
            variant={currentPage === page ? 'default' : 'outline'}
            size="icon"
            onClick={() => handlePageChange(page)}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </Button>
        ) : (
          <span key={`${page}-${index}`} className="px-1 sm:px-2 py-1 text-muted-foreground">
            {page}
          </span>
        )
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
