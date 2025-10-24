import { BookGrid } from '@/components/book-grid';
import { fetchBooksForShelf, fetchShelfDetails } from '@/lib/api';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ChevronLeft, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SearchInput } from '@/components/search-input';

const BOOKS_PER_PAGE = 12;

export default function ShelfPage({
  params,
  searchParams,
}: {
  params: { shelfId: string };
  searchParams?: { page?: string; query?: string };
}) {
  const shelfId = params.shelfId;
  const currentPage = Number(searchParams?.page) || 1;
  const query = searchParams?.query || '';
  
  const shelfDetailsPromise = fetchShelfDetails(shelfId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Suspense fallback={<Skeleton className="h-10 w-64" />}>
          <ShelfHeader shelfDetailsPromise={shelfDetailsPromise} />
        </Suspense>
      </div>

      <Suspense key={currentPage + query} fallback={<BookGridSkeleton />}>
        <BooksDataFetcher 
          shelfId={shelfId} 
          currentPage={currentPage} 
          query={query}
        />
      </Suspense>
    </div>
  );
}

async function ShelfHeader({ shelfDetailsPromise }: { shelfDetailsPromise: Promise<any> }) {
  const shelf = await shelfDetailsPromise;
  return (
    <div>
      <Link href="/?page=1" className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 text-sm">
        <ChevronLeft className="h-4 w-4" />
        Back to Bookshelves
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold font-headline">{shelf?.title || 'Shelf'}</h1>
      {shelf?.formsCount && (
        <p className="text-muted-foreground mt-2">
          {shelf.formsCount} books in this collection
        </p>
      )}
    </div>
  );
}

async function BooksDataFetcher({ shelfId, currentPage, query }: {
  shelfId: string;
  currentPage: number;
  query: string;
}) {
  try {
    const { books, total } = await fetchBooksForShelf({
      shelfId,
      limit: BOOKS_PER_PAGE,
      offset: (currentPage - 1) * BOOKS_PER_PAGE
    });

    const totalPages = Math.ceil(total / BOOKS_PER_PAGE);
    
    return <BookGrid initialBooks={books} currentPage={currentPage} totalPages={totalPages} />;
  } catch (error) {
    console.error(error);
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load books for this shelf. Please try again later.</AlertDescription>
      </Alert>
    );
  }
}

function BookGridSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Skeleton className="h-10 w-full max-w-sm" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
