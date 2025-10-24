import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronRight, BookCopy } from 'lucide-react';
import type { Bookshelf } from '@/lib/definitions';

export function BookshelfItem({ shelf }: { shelf: Bookshelf }) {
  return (
    <Link href={`/shelves/${shelf.id}`} className="group block">
      <Card className="h-full transition-all duration-300 ease-in-out group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle className="text-xl font-headline">{shelf.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <BookCopy className="h-4 w-4" />
              <span>{shelf.formsCount} books</span>
            </CardDescription>
          </div>
          <ChevronRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </CardHeader>
      </Card>
    </Link>
  );
}
