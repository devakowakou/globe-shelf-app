'use client';

import type { Bookshelf } from '@/lib/definitions';
import { BookshelfItem } from './bookshelf-item';
import { PaginationComponent } from './pagination';
import { EmptyState } from './empty-state';

interface BookshelfListProps {
  shelves: Bookshelf[];
  currentPage: number;
  totalPages: number;
}

export function BookshelfList({ shelves, currentPage, totalPages }: BookshelfListProps) {
  if (shelves.length === 0) {
    return (
      <EmptyState 
        title="No bookshelves found"
        description="Could not retrieve any bookshelves at this time."
      />
    );
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
