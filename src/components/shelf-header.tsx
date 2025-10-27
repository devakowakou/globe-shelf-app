import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, BookOpen } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const bookCoverPlaceholder = PlaceHolderImages.find(p => p.id === 'book-cover-placeholder');

interface ShelfHeaderProps {
  shelf: {
    title: string;
    formsCount?: number;
  };
  heroImage?: string;
}

export function ShelfHeader({ shelf, heroImage }: ShelfHeaderProps) {
  const displayImage = heroImage || bookCoverPlaceholder?.imageUrl;
  
  const summary = shelf?.formsCount 
    ? `Découvrez une collection de ${shelf.formsCount} livres soigneusement sélectionnés. Parcourez la bibliothèque et trouvez votre prochaine lecture.`
    : 'Explorez cette collection de livres.';

  return (
    <div className="relative overflow-hidden rounded-xl bg-secondary/50 border shadow-2xl p-8 md:p-12 min-h-[400px] flex flex-col justify-between items-start">
      <div className="absolute inset-0 w-full h-full">
        {displayImage && (
          <Image
            src={displayImage}
            alt={shelf?.title || 'Bookshelf'}
            fill
            className="object-cover"
            priority
            data-ai-hint={!heroImage ? bookCoverPlaceholder?.imageHint : 'book collection'}
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
