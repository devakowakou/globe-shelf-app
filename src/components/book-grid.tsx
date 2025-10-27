'use client';

import { useState, useMemo, useTransition, useEffect } from 'react';
import type { Book } from '@/lib/definitions';
import { BookCard } from './book-card';
import { PaginationComponent } from './pagination';
import { SearchInput } from './search-input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

interface BookGridProps {
  initialBooks: Book[];
  currentPage: number;
  totalPages: number;
  shelfId?: string;
}

export function BookGrid({ initialBooks, currentPage, totalPages, shelfId }: BookGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const [searchResults, setSearchResults] = useState<Book[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setSearchResults(null);
      return;
    }

    startTransition(() => {
      const filtered = initialBooks.filter(book =>
        book.title.toLowerCase().includes(term.toLowerCase()) ||
        book.authors.some(author => author.name.toLowerCase().includes(term.toLowerCase()))
      );
      setSearchResults(filtered);
    });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
  };

  const booksToDisplay = searchResults !== null ? searchResults : initialBooks;
  const isFiltered = searchTerm.trim() !== '';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <SearchInput 
          onSearch={handleSearch}
          placeholder="Search by title or author..."
          initialValue={searchTerm}
        />
        {isFiltered && (
          <Badge 
            variant="secondary" 
            className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
            onClick={handleClearSearch}
          >
            Filtered: {booksToDisplay.length} result{booksToDisplay.length !== 1 ? 's' : ''}
            <X className="ml-2 h-3 w-3" />
          </Badge>
        )}
      </div>
      
      {booksToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {booksToDisplay.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <h3 className="text-xl font-semibold">No books found</h3>
          <p className="text-muted-foreground mt-2">
            {isFiltered 
              ? `No books match "${searchTerm}". Try adjusting your search or clear the filter.`
              : 'No books available on this page.'
            }
          </p>
          {isFiltered && (
            <button
              onClick={handleClearSearch}
              className="mt-4 text-primary hover:underline"
            >
              Clear search filter
            </button>
          )}
        </Card>
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
