import React from 'react';
import { Star } from 'lucide-react';

export interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = 'md',
  showCount = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div
      className={`inline-flex items-center gap-1 text-amber-500 ${className}`}
      aria-label={`Rating: ${value} out of ${max} stars`}
    >
      <div className="flex items-center" aria-hidden="true">
        {Array.from({ length: max }, (_, index) => {
          const fillPercentage = Math.max(0, Math.min(1, value - index));
          const isFull = fillPercentage >= 0.8;
          const isHalf = fillPercentage >= 0.3 && fillPercentage < 0.8;

          return (
            <span key={index} className="relative inline-block">
              {isFull ? (
                <Star className={`${sizeClasses[size]} fill-amber-400 text-amber-400`} />
              ) : isHalf ? (
                <div className="relative">
                  <Star className={`${sizeClasses[size]} text-gray-300`} />
                  <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                    <Star className={`${sizeClasses[size]} fill-amber-400 text-amber-400`} />
                  </div>
                </div>
              ) : (
                <Star className={`${sizeClasses[size]} text-gray-300`} />
              )}
            </span>
          );
        })}
      </div>
      {showCount && (
        <span className={`font-semibold text-gray-700 ml-0.5 ${textSizes[size]}`}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};
