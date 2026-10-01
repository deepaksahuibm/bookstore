import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

export interface BookImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  category?: string;
  title?: string;
  containerClassName?: string;
}

export const BookImage: React.FC<BookImageProps> = ({
  src,
  alt,
  category = 'General',
  title = '',
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ${containerClassName}`}>
      {/* Loading Shimmer Placeholder */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gray-200/80 animate-pulse z-0" aria-hidden="true" />
      )}

      {/* Actual or Fallback Cover */}
      {!hasError && src ? (
        <img
          src={src}
          alt={alt || title || 'Book cover'}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          {...props}
        />
      ) : (
        /* Editorial Fallback Placeholder */
        <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-gradient-to-br from-brand-900 to-slate-900 text-white text-center select-none">
          <div className="text-[10px] uppercase tracking-widest text-brand-300 font-semibold pt-2">
            {category}
          </div>
          <div className="space-y-1.5 px-2">
            <BookOpen className="w-8 h-8 mx-auto text-brand-400 opacity-80" />
            <div className="font-serif font-bold text-xs sm:text-sm line-clamp-2 leading-snug text-white">
              {title || 'Novella Title'}
            </div>
          </div>
          <div className="text-[9px] text-brand-300/60 pb-1">Novella Edition</div>
        </div>
      )}
    </div>
  );
};
