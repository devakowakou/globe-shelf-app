import { BookGrid } from '@/components/book-grid';
import { fetchBooksForShelf, fetchShelfDetails } from '@/lib/api';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ChevronLeft, Terminal, BookOpen } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const BOOKS_PER_PAGE = 12;
const bookCoverPlaceholder = PlaceHolderImages.find(p => p.id === 'book-cover-placeholder');

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
        <ShelfHeader shelfDetailsPromise={shelfDetailsPromise} booksPromise={booksPromise} />
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
  
  const heroImage = books[0]?.coverUrl || bookCoverPlaceholder?.imageUrl;
  
  const summary = shelf?.formsCount 
    ? `Découvrez une collection de ${shelf.formsCount} livres soigneusement sélectionnés. Parcourez la bibliothèque et trouvez votre prochaine lecture.`
    : 'Explorez cette collection de livres.';

  return (
    <div className="relative overflow-hidden rounded-xl bg-secondary/50 border shadow-2xl p-8 md:p-12 min-h-[400px] flex flex-col justify-between items-start">
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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/70" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 text-white w-full">
        <Link href="/?page=1" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors group">
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Bookshelves
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold font-headline drop-shadow-2xl">{shelf?.title || 'Shelf'}</h1>
        </div>
        {shelf?.formsCount && (
            <p className="text-white/90 mt-3 text-lg drop-shadow-lg">
            {shelf.formsCount} books in this collection
            </p>
        )}
      </div>
      <div className="relative z-10 mt-6 max-w-3xl">
        <p className="text-white/95 text-base md:text-lg leading-relaxed drop-shadow-lg">{summary}</p>
      </div>
    </div>
  );
}

async function BooksDataFetcher({ booksPromise, currentPage }: {
  booksPromise: Promise<{ books: any[], total: number }>;
  currentPage: number;
}) {
  try {
    const { books, total } = await booksPromise;
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
