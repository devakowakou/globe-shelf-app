'use client';

import { useState, useTransition } from 'react';
import type { Book } from '@/lib/definitions';

export function useBookSearch(books: Book[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Book[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setSearchResults(null);
      return;
    }

    startTransition(() => {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(term.toLowerCase()) ||
        book.authors.some(author => author.name.toLowerCase().includes(term.toLowerCase()))
      );
      setSearchResults(filtered);
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
  };

  return {
    searchTerm,
    searchResults,
    isPending,
    handleSearch,
    clearSearch,
    isFiltered: searchTerm.trim() !== '',
    booksToDisplay: searchResults !== null ? searchResults : books,
  };
}
