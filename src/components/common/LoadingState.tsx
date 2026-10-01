import React from 'react';

export interface LoadingStateProps {
  message?: string;
  variant?: 'spinner' | 'skeleton-grid';
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading books...',
  variant = 'spinner',
  count = 8,
}) => {
  if (variant === 'skeleton-grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" aria-busy="true" aria-label="Loading content">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-pulse flex flex-col"
          >
            <div className="aspect-[3/4] bg-gray-200 w-full" />
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-8 bg-gray-200 rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center" aria-live="polite">
      <div className="relative w-12 h-12 mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
      </div>
      <p className="text-gray-600 text-sm font-medium">{message}</p>
    </div>
  );
};
