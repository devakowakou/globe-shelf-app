'use client';

import type { Book } from '@/lib/definitions';
import { BookCard } from './book-card';

interface BooksDisplayProps {
  books: Book[];
}

export function BooksDisplay({ books }: BooksDisplayProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {books.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
