import { ShelfHeader } from '@/components/shelf-header';

interface ShelfHeaderWrapperProps {
  shelfDetailsPromise: Promise<any>;
  booksPromise: Promise<any>;
}

export async function ShelfHeaderWrapper({ shelfDetailsPromise, booksPromise }: ShelfHeaderWrapperProps) {
  const [shelf, { books }] = await Promise.all([shelfDetailsPromise, booksPromise]);
  const heroImage = books[0]?.coverUrl;
  
  return <ShelfHeader shelf={shelf} heroImage={heroImage} />;
}
