import React from 'react';
import { BookOpen, SearchX, ShoppingBag, AlertCircle } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: 'search' | 'cart' | 'book' | 'error';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon = 'book',
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'search':
        return <SearchX className="w-12 h-12 text-gray-400" />;
      case 'cart':
        return <ShoppingBag className="w-12 h-12 text-gray-400" />;
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-400" />;
      case 'book':
      default:
        return <BookOpen className="w-12 h-12 text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5 shadow-inner">
        {getIcon()}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionText}
        </Button>
      )}
    </div>
  );
};
