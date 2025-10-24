import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Book } from '@/lib/definitions';
import { Star, Tag } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const bookCoverPlaceholder = PlaceHolderImages.find(p => p.id === 'book-cover-placeholder');

export function BookCard({ book }: { book: Book }) {
  const authors = book.authors?.map(author => author.name).join(', ');

  return (
    <div className="group relative">
      <Card className="h-full overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-xl">
        <CardHeader className="p-0">
          <div className="aspect-[2/3] w-full relative overflow-hidden rounded-t-lg">
            <Image
              src={book.coverUrl || bookCoverPlaceholder?.imageUrl || ''}
              alt={`Cover of ${book.title}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={!book.coverUrl ? bookCoverPlaceholder?.imageHint : undefined}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <CardTitle className="text-base font-semibold leading-tight line-clamp-2" title={book.title}>{book.title}</CardTitle>
          {authors && <p className="text-sm text-muted-foreground truncate" title={authors}>{authors}</p>}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
            {book.price && (
              <div className="flex items-center gap-1 font-medium text-foreground/80">
                <Tag className="h-3.5 w-3.5" />
                <span>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: book.price.currency }).format(book.price.amount)}
                </span>
              </div>
            )}
            {book.averageRating && book.averageRating > 0 && (
              <div className="flex items-center gap-1 ml-auto">
                <Star className="h-4 w-4 text-accent-foreground fill-accent" />
                <span className="font-semibold">{book.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
