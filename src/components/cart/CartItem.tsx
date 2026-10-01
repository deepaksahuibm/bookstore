import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { QuantitySelector } from '../common/QuantitySelector';
import { Trash2 } from 'lucide-react';

export interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { book, quantity } = item;

  const itemTotal = book.price * quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-gray-100 last:border-none">
      
      {/* Book Cover + Info */}
      <div className="flex items-center gap-4 flex-1">
        <Link
          to={`/books/${book.id}`}
          className="w-16 h-22 sm:w-20 sm:h-28 rounded-lg overflow-hidden bg-gray-100 shrink-0 shadow-sm border border-gray-200"
        >
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </Link>

        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
            {book.category}
          </span>
          <Link
            to={`/books/${book.id}`}
            className="block text-sm sm:text-base font-serif font-bold text-gray-900 hover:text-brand-600 line-clamp-1"
          >
            {book.title}
          </Link>
          <p className="text-xs text-gray-500">by {book.author}</p>
          <p className="text-xs font-semibold text-gray-900 sm:hidden">
            {formatCurrency(book.price)} each
          </p>
        </div>
      </div>

      {/* Controls: Price, Quantity & Delete */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
        <div className="hidden sm:block text-right">
          <div className="text-xs text-gray-400">Unit Price</div>
          <div className="text-sm font-medium text-gray-700">{formatCurrency(book.price)}</div>
        </div>

        <div className="flex items-center gap-2">
          <QuantitySelector
            quantity={quantity}
            max={book.stock}
            onChange={(newQty) => updateQuantity(book.id, newQty)}
            size="sm"
          />
        </div>

        <div className="text-right min-w-[70px]">
          <div className="text-xs text-gray-400 sm:hidden">Total</div>
          <div className="text-sm sm:text-base font-bold text-gray-900">
            {formatCurrency(itemTotal)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => removeFromCart(book.id)}
          aria-label={`Remove ${book.title} from cart`}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
