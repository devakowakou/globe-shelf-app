'use client';

import type { Bookshelf } from '@/lib/definitions';
import { BookshelfItem } from './bookshelf-item';
import { PaginationComponent } from './pagination';
import { Card } from './ui/card';

interface BookshelfListProps {
  shelves: Bookshelf[];
  currentPage: number;
  totalPages: number;
}

export function BookshelfList({ shelves, currentPage, totalPages }: BookshelfListProps) {
  if (shelves.length === 0) {
    return (
        <Card className="text-center py-16">
            <h3 className="text-xl font-semibold">No bookshelves found</h3>
            <p className="text-muted-foreground mt-2">Could not retrieve any bookshelves at this time.</p>
        </Card>
    )
  }
  
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {shelves.map(shelf => (
          <BookshelfItem key={shelf.id} shelf={shelf} />
        ))}
      </div>
      {totalPages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
