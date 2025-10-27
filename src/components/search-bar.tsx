'use client';

import { SearchInput } from './search-input';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  onClear: () => void;
  resultsCount?: number;
  isFiltered: boolean;
}

export function SearchBar({ searchTerm, onSearch, onClear, resultsCount, isFiltered }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <SearchInput 
        onSearch={onSearch}
        placeholder="Search by title or author..."
        initialValue={searchTerm}
      />
      {isFiltered && resultsCount !== undefined && (
        <Badge 
          variant="secondary" 
          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
          onClick={onClear}
        >
          Filtered: {resultsCount} result{resultsCount !== 1 ? 's' : ''}
          <X className="ml-2 h-3 w-3" />
        </Badge>
      )}
    </div>
  );
}
