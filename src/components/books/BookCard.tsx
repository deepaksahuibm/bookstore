import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../../types';
import { Rating } from '../common/Rating';
import { Button } from '../common/Button';
import { BookImage } from '../common/BookImage';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { ShoppingBag, Check } from 'lucide-react';

export interface BookCardProps {
  book: Book;
  compact?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, compact = false }) => {
  const { addToCart, getItemQuantity } = useCart();
  const { success, error } = useToast();
  const quantityInCart = getItemQuantity(book.id);
  const isOutOfStock = book.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      error(`"${book.title}" is currently out of stock.`);
      return;
    }

    const added = addToCart(book, 1);
    if (added) {
      success(`Added "${book.title}" to your cart.`, 'Item Added');
    } else {
      error(`You have already added all available stock for "${book.title}".`, 'Stock Limit Reached');
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200/80 hover:border-brand-400 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden h-full">
      {/* Cover Image Container */}
      <Link
        to={`/books/${book.id}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 block group-hover:opacity-95"
        aria-label={`View details for ${book.title}`}
      >
        <BookImage
          src={book.coverImage}
          alt={`Book cover of ${book.title} by ${book.author}`}
          title={book.title}
          category={book.category}
          loading="lazy"
          className="group-hover:scale-105 transition-transform duration-300"
          containerClassName="w-full h-full"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {book.bestseller && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-amber-500 text-white rounded-md shadow-xs">
              Bestseller
            </span>
          )}
          {book.featured && !book.bestseller && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-brand-600 text-white rounded-md shadow-xs">
              Featured
            </span>
          )}
        </div>

        {/* Stock Tag */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center p-3 text-center">
            <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
              Out of Stock
            </span>
          </div>
        ) : book.stock <= 5 ? (
          <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-semibold bg-orange-100 text-orange-800 border border-orange-200 rounded-md">
            Only {book.stock} left
          </span>
        ) : null}
      </Link>

      {/* Book Metadata & Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="font-medium text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full text-[11px]">
              {book.category}
            </span>
            <Rating value={book.rating} size="sm" showCount={false} />
          </div>

          <Link to={`/books/${book.id}`} className="block group-hover:text-brand-600 transition-colors">
            <h3
              className={`font-serif font-bold text-gray-900 leading-snug line-clamp-2 ${
                compact ? 'text-sm' : 'text-base sm:text-lg'
              }`}
            >
              {book.title}
            </h3>
          </Link>

          <p className="text-xs text-gray-600 mt-1 line-clamp-1">by {book.author}</p>
        </div>

        {/* Price & Cart Action */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] text-gray-400 font-medium">Price</div>
            <div className="text-base sm:text-lg font-bold text-gray-900">
              {formatCurrency(book.price)}
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            variant={quantityInCart > 0 ? 'secondary' : 'primary'}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            aria-label={
              isOutOfStock
                ? `${book.title} is out of stock`
                : quantityInCart > 0
                ? `Add another copy of ${book.title} to cart (${quantityInCart} currently in cart)`
                : `Add ${book.title} to cart`
            }
            className="shrink-0"
            leftIcon={
              quantityInCart > 0 ? (
                <Check className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5" />
              )
            }
          >
            {quantityInCart > 0 ? `In Cart (${quantityInCart})` : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
};
