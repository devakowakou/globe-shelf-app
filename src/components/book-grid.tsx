'use client';

import type { Book } from '@/lib/definitions';
import { PaginationComponent } from './pagination';
import { SearchBar } from './search-bar';
import { BooksDisplay } from './books-display';
import { EmptyState } from './empty-state';
import { useBookSearch } from '@/hooks/use-book-search';

interface BookGridProps {
  initialBooks: Book[];
  currentPage: number;
  totalPages: number;
  shelfId?: string;
}

export function BookGrid({ initialBooks, currentPage, totalPages }: BookGridProps) {
  const {
    searchTerm,
    booksToDisplay,
    isFiltered,
    handleSearch,
    clearSearch,
  } = useBookSearch(initialBooks);

  const hasBooks = booksToDisplay.length > 0;
  const emptyDescription = isFiltered 
    ? `No books match "${searchTerm}". Try adjusting your search or clear the filter.`
    : 'No books available on this page.';

  return (
    <div className="space-y-8">
      <SearchBar 
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onClear={clearSearch}
        resultsCount={booksToDisplay.length}
        isFiltered={isFiltered}
      />
      
      {hasBooks ? (
        <BooksDisplay books={booksToDisplay} />
      ) : (
        <EmptyState 
          title="No books found"
          description={emptyDescription}
          action={isFiltered ? {
            label: 'Clear search filter',
            onClick: clearSearch
          } : undefined}
        />
      )}
      
      {totalPages > 1 && !isFiltered && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}
      
      {isFiltered && (
        <p className="text-sm text-muted-foreground text-center">
          Showing results from current page only. Navigate to other pages to search more books.
        </p>
      )}
    </div>
  );
}
