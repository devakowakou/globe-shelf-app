import { BookGrid } from '@/components/book-grid';
import { fetchBooksForShelf, fetchShelfDetails } from '@/lib/api';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ChevronLeft, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateShelfSummary } from '@/ai/flows/shelf-summary-flow';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const BOOKS_PER_PAGE = 12;
const bookCoverPlaceholder = PlaceHolderImages.find(p => p.id === 'book-cover-placeholder');

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
  const booksPromise = fetchBooksForShelf({
    shelfId,
    limit: BOOKS_PER_PAGE,
    offset: (currentPage - 1) * BOOKS_PER_PAGE
  });

  return (
    <div className="space-y-8">
      <Suspense fallback={<ShelfHeaderSkeleton />}>
        <ShelfHeader shelfDetailsPromise={shelfDetailsPromise} booksPromise={booksPromise} />
      </Suspense>

      <Suspense key={currentPage + query} fallback={<BookGridSkeleton />}>
        <BooksDataFetcher 
          booksPromise={booksPromise}
        />
      </Suspense>
    </div>
  );
}

function ShelfHeaderSkeleton() {
    return (
      <div className="relative overflow-hidden rounded-lg bg-card border p-8 md:p-12 min-h-[300px] flex flex-col justify-between">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="relative z-10">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-10 md:h-12 w-3/4" />
        </div>
        <div className="relative z-10 mt-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3 mt-2" />
        </div>
      </div>
    );
}

async function ShelfHeader({ shelfDetailsPromise, booksPromise }: { shelfDetailsPromise: Promise<any>, booksPromise: Promise<any> }) {
  const [shelf, { books }] = await Promise.all([shelfDetailsPromise, booksPromise]);
  const bookTitles = books.map((b: any) => b.title).slice(0, 5); // Use first 5 book titles for summary
  const summaryPromise = generateShelfSummary({ shelfTitle: shelf?.title, bookTitles });

  const heroImage = books[0]?.coverUrl || bookCoverPlaceholder?.imageUrl;

  return (
    <div className="relative overflow-hidden rounded-lg bg-secondary/50 border p-8 md:p-12 min-h-[300px] flex flex-col justify-between items-start">
      <div className="absolute inset-0 w-full h-full">
        {heroImage && (
          <Image
            src={heroImage}
            alt={shelf?.title || 'Bookshelf'}
            fill
            className="object-cover"
            priority
            data-ai-hint={!books[0]?.coverUrl ? bookCoverPlaceholder?.imageHint : 'book collection'}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="relative z-10 text-white">
        <Link href="/?page=1" className="flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm font-medium">
          <ChevronLeft className="h-4 w-4" />
          Back to Bookshelves
        </Link>
        <h1 className="text-3xl md:text-5xl font-bold font-headline text-shadow-lg" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>{shelf?.title || 'Shelf'}</h1>
        {shelf?.formsCount && (
            <p className="text-white/90 mt-2 text-shadow-sm" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.7)'}}>
            {shelf.formsCount} books in this collection
            </p>
        )}
      </div>
      <div className="relative z-10 mt-4 max-w-4xl">
        <Suspense fallback={<Skeleton className="h-5 w-full" />}>
            <ShelfSummary summaryPromise={summaryPromise} />
        </Suspense>
      </div>
    </div>
  );
}

async function ShelfSummary({ summaryPromise }: { summaryPromise: Promise<string> }) {
    const summary = await summaryPromise;
    return <p className="text-white/90 text-shadow-sm text-sm md:text-base" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.7)'}}>{summary}</p>
}


async function BooksDataFetcher({ booksPromise }: {
  booksPromise: Promise<{ books: any[], total: number }>;
}) {
  try {
    const { books, total } = await booksPromise;
    const totalPages = Math.ceil(total / BOOKS_PER_PAGE);
    
    // This is not ideal as we lose the ability to paginate on this page with this design.
    // The fetch happens at the top level component.
    const currentPage = 1;

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
