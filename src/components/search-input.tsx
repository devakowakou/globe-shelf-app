'use client';
import { Search } from 'lucide-react';
import { Input } from './ui/input';

export function SearchInput({ 
  onSearch, 
  placeholder,
  initialValue = ''
}: { 
  onSearch: (term: string) => void; 
  placeholder?: string;
  initialValue?: string;
}) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder || "Search..."}
        className="pl-10"
        onChange={(e) => onSearch(e.target.value)}
        defaultValue={initialValue}
        aria-label={placeholder || "Search"}
      />
    </div>
  );
}
