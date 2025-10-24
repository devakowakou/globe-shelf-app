'use client';

import { useState, useMemo, useTransition } from 'react';
import type { Book } from '@/lib/definitions';
import { BookCard } from './book-card';
import { PaginationComponent } from './pagination';
import { SearchInput } from './search-input';
import { Card } from './ui/card';

interface BookGridProps {
  initialBooks: Book[];
  currentPage: number;
  totalPages: number;
}

export function BookGrid({ initialBooks, currentPage, totalPages }: BookGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    startTransition(() => {
      setSearchTerm(term);
    });
  };

  const filteredBooks = useMemo(() => {
    if (!searchTerm) return initialBooks;
    return initialBooks.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authors.some(author => author.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [initialBooks, searchTerm]);

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <SearchInput 
          onSearch={handleSearch}
          placeholder="Filter books on this page..."
        />
      </div>
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <h3 className="text-xl font-semibold">No books found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filter or check other pages.</p>
        </Card>
      )}
      {totalPages > 1 && !searchTerm && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
