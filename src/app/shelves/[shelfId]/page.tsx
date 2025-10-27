import { fetchBooksForShelf, fetchShelfDetails } from '@/lib/api';
import { Suspense } from 'react';
import { ShelfHeaderSkeleton, BookGridSkeleton } from '@/components/skeletons';
import { ShelfHeaderWrapper } from '@/components/shelf-header-wrapper';
import { BooksDataFetcher } from '@/components/books-data-fetcher';

const BOOKS_PER_PAGE = 12;

export default async function ShelfPage({
  params,
  searchParams,
}: {
  params: Promise<{ shelfId: string }>;
  searchParams?: Promise<{ page?: string; query?: string }>;
}) {
  const { shelfId } = await params;
  const search = searchParams ? await searchParams : {};
  const currentPage = Number(search?.page) || 1;
  const query = search?.query || '';
  
  const shelfDetailsPromise = fetchShelfDetails(shelfId);
  const booksPromise = fetchBooksForShelf({
    shelfId,
    limit: BOOKS_PER_PAGE,
    offset: (currentPage - 1) * BOOKS_PER_PAGE
  });

  return (
    <div className="space-y-8">
      <Suspense fallback={<ShelfHeaderSkeleton />}>
        <ShelfHeaderWrapper 
          shelfDetailsPromise={shelfDetailsPromise} 
          booksPromise={booksPromise} 
        />
      </Suspense>

      <Suspense key={currentPage + query} fallback={<BookGridSkeleton />}>
        <BooksDataFetcher 
          booksPromise={booksPromise}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
}
