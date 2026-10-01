import React from 'react';
import { Book } from '../../types';
import { BookCard } from './BookCard';
import { LoadingState } from '../common/LoadingState';
import { EmptyState } from '../common/EmptyState';

export interface BookGridProps {
  books: Book[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onResetFilters?: () => void;
  columns?: '3' | '4';
}

export const BookGrid: React.FC<BookGridProps> = ({
  books,
  isLoading = false,
  emptyTitle = 'No books found',
  emptyDescription = 'We couldn’t find any books matching your criteria. Try adjusting your search keywords or active filters.',
  onResetFilters,
  columns = '4',
}) => {
  if (isLoading) {
    return <LoadingState variant="skeleton-grid" count={8} />;
  }

  if (books.length === 0) {
    return (
      <EmptyState
        icon="search"
        title={emptyTitle}
        description={emptyDescription}
        actionText={onResetFilters ? 'Clear all filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  const gridCols =
    columns === '3'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div
      className={`grid ${gridCols} gap-5 sm:gap-6`}
      role="region"
      aria-label="Books catalogue grid"
    >
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};
