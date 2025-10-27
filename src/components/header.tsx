import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="bg-card border-b py-4 px-4 sm:px-6 md:px-8 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-primary transition-opacity hover:opacity-80">
          <BookOpen className="h-7 w-7" />
          <h1 className="text-xl sm:text-2xl font-bold font-headline">
            Glose Shelf Explorer
          </h1>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
