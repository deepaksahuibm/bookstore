import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import { ArrowRight, ShieldCheck, Truck, Tag, Sparkles } from 'lucide-react';

export interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  showCheckoutButton = true,
}) => {
  const { subtotal, shipping, tax, total, totalItemCount } = useCart();
  const { success, error } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const freeShippingThreshold = 50;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountRemaining = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    if (promoCode.trim().toUpperCase() === 'FREESHIP' || promoCode.trim().toUpperCase() === 'NOVELLA10') {
      setPromoApplied(true);
      success('Promo code applied successfully!', 'Discount Activated');
    } else {
      error('Invalid promo code. Try "FREESHIP" or "NOVELLA10".', 'Code Not Recognized');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-sm space-y-6">
      <h3 className="text-lg font-serif font-bold text-gray-900 border-b border-gray-100 pb-3">
        Order Summary
      </h3>

      {/* Free Shipping Progress Meter */}
      <div className="p-4 bg-brand-50/70 rounded-2xl border border-brand-100/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-brand-900">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {subtotal >= freeShippingThreshold ? (
              <span className="text-emerald-700">You unlocked Free Express Shipping!</span>
            ) : (
              <span>
                Add <strong>{formatCurrency(amountRemaining)}</strong> for Free Shipping
              </span>
            )}
          </span>
          <span>{progressPercent}%</span>
        </div>

        <div className="w-full bg-brand-200/50 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              subtotal >= freeShippingThreshold ? 'bg-emerald-500' : 'bg-brand-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Financial Line Items */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})</span>
          <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1">
            Shipping
            {shipping === 0 && subtotal > 0 && (
              <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                Free
              </span>
            )}
          </span>
          <span className="font-semibold text-gray-900">
            {shipping === 0 ? '$0.00' : formatCurrency(shipping)}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Estimated Sales Tax (8%)</span>
          <span className="font-semibold text-gray-900">{formatCurrency(tax)}</span>
        </div>

        {promoApplied && (
          <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50/80 p-2 rounded-lg text-xs">
            <span>Special Promotional Perk:</span>
            <span>Applied ✓</span>
          </div>
        )}

        <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
          <span className="text-base font-bold text-gray-900">Estimated Total</span>
          <span className="text-2xl font-serif font-extrabold text-brand-700">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Promo Code Input */}
      {showCheckoutButton && (
        <form onSubmit={handleApplyPromo} className="pt-2 flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder="Promo code (e.g. FREESHIP)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-500 uppercase tracking-wider font-medium"
            />
          </div>
          <Button type="submit" size="sm" variant="secondary" className="text-xs">
            Apply
          </Button>
        </form>
      )}

      {showCheckoutButton && (
        <div className="pt-2">
          <Link to="/checkout" className="block w-full">
            <Button
              size="lg"
              className="w-full shadow-md shadow-brand-500/20"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      )}

      {/* Trust Badges */}
      <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Guaranteed Safe & Secure Checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-brand-600 shrink-0" />
          <span>Tracked delivery with insured packaging</span>
        </div>
      </div>
    </div>
  );
};
