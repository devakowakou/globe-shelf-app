import { BookshelfList } from '@/components/bookshelf-list';
import { fetchBookshelves } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const SHELVES_PER_PAGE = 10;

export default async function Home({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
  const params = searchParams ? await searchParams : {};
  const currentPage = Number(params?.page) || 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Bookshelves</h1>
        <p className="text-muted-foreground mt-2">Explore the collections of a passionate reader.</p>
      </div>
      <Suspense key={currentPage} fallback={<BookshelvesLoadingSkeleton />}>
        <ShelvesDataFetcher currentPage={currentPage} />
      </Suspense>
    </div>
  );
}

async function ShelvesDataFetcher({ currentPage }: { currentPage: number }) {
  try {
    const { shelves, total } = await fetchBookshelves({ limit: SHELVES_PER_PAGE, offset: (currentPage - 1) * SHELVES_PER_PAGE });
    const totalPages = Math.ceil(total / SHELVES_PER_PAGE);
    
    return <BookshelfList shelves={shelves} currentPage={currentPage} totalPages={totalPages} />;
  } catch (error) {
    console.error(error);
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load bookshelves. Please try again later.</AlertDescription>
      </Alert>
    );
  }
}

function BookshelvesLoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-6 border rounded-lg space-y-4 bg-card">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
