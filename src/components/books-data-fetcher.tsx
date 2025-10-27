import { BookGrid } from '@/components/book-grid';
import { Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BOOKS_PER_PAGE = 12;

interface BooksDataFetcherProps {
  booksPromise: Promise<{ books: any[], total: number }>;
  currentPage: number;
}

export async function BooksDataFetcher({ booksPromise, currentPage }: BooksDataFetcherProps) {
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
