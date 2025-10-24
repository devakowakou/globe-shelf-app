import Image from 'next/image';
import { Card } from '@/components/ui/card';
import type { Book } from '@/lib/definitions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star } from 'lucide-react';

const bookCoverPlaceholder = PlaceHolderImages.find(p => p.id === 'book-cover-placeholder');

export function BookCard({ book }: { book: Book }) {
  const authors = book.authors?.map(author => author.name).join(', ');

  const renderStars = () => {
    if (!book.averageRating) return null;
    const rating = Math.round(book.averageRating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  return (
    <div className="group relative flex flex-col h-full">
      <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 flex-grow">
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
      </Card>
      <div className="pt-3 space-y-1">
        <h3 className="text-base font-semibold leading-tight line-clamp-2" title={book.title}>{book.title}</h3>
        {authors && <p className="text-sm text-muted-foreground truncate" title={authors}>{authors}</p>}
        {renderStars()}
      </div>
    </div>
  );
}
