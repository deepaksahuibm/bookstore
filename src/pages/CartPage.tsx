import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, clearCart, totalItemCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon="cart"
          title="Your Shopping Cart is Empty"
          description="Explore our curated collection of books and find your next intellectual companion."
          actionText="Start Browsing Books"
          onAction={() => navigate('/books')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-brand-600" />
            Shopping Cart
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            You have <strong className="text-gray-900">{totalItemCount}</strong> {totalItemCount === 1 ? 'item' : 'items'} in your cart.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Clear Cart
          </Button>
          <Link to="/books">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      {/* Cart Content: Items List + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items Table / Cards */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-2">
          <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 border-b border-gray-100 text-xs font-bold uppercase text-gray-400">
            <div className="col-span-6">Book Item</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Subtotal</div>
          </div>

          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <CartItem key={item.book.id} item={item} />
            ))}
          </div>

          <div className="pt-6 flex justify-between items-center text-sm text-gray-500 border-t border-gray-100">
            <Link to="/books" className="text-brand-600 hover:underline flex items-center gap-1 font-medium">
              <ArrowLeft className="w-4 h-4" />
              Add more titles to this order
            </Link>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          <CartSummary />
        </div>

      </div>

    </div>
  );
};
