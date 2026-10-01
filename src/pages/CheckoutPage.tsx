import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { CustomerInfo, ShippingInfo, OrderConfirmation } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyState } from '../components/common/EmptyState';
import {
  CheckCircle2,
  Lock,
  Truck,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  PackageCheck
} from 'lucide-react';

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const { success } = useToast();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
  });

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple-pay'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);

  // If cart is empty and no confirmation has been placed yet
  if (items.length === 0 && !orderConfirmation) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon="cart"
          title="No Items in Cart for Checkout"
          description="Your cart is currently empty. Please add some books before proceeding to checkout."
          actionText="Browse Books"
          onAction={() => navigate('/books')}
        />
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Customer validation
    if (!customer.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!customer.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!customer.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    // Shipping validation
    if (!shippingInfo.addressLine1.trim()) {
      newErrors.addressLine1 = 'Street address is required';
    }
    if (!shippingInfo.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!shippingInfo.state.trim()) {
      newErrors.state = 'State / Province is required';
    }
    if (!shippingInfo.postalCode.trim()) {
      newErrors.postalCode = 'Postal / ZIP code is required';
    }

    // Card validation if card method selected
    if (paymentMethod === 'card') {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 13) {
        newErrors.cardNumber = 'Valid card number is required (mock)';
      }
      if (!cardExpiry.trim()) {
        newErrors.cardExpiry = 'MM/YY required';
      }
      if (!cardCvv.trim() || cardCvv.length < 3) {
        newErrors.cardCvv = 'CVV required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate mock order placement latency
    setTimeout(() => {
      const confirmation: OrderConfirmation = {
        orderId: `NOV-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        items: [...items],
        subtotal,
        shippingFee: shipping,
        tax,
        total,
        customer: { ...customer },
        shipping: { ...shippingInfo },
        estimatedDelivery: '3 to 5 business days',
      };

      setOrderConfirmation(confirmation);
      clearCart();
      setIsSubmitting(false);
      success('Your order has been received and confirmed!', 'Order Placed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 900);
  };

  // SUCCESS CONFIRMATION VIEW
  if (orderConfirmation) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in fade-in">
        {/* Celebration header */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 sm:p-10 text-center space-y-3 shadow-xs">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="inline-block text-xs uppercase tracking-wider font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Order Confirmed & Processing
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
            Thank you for your order, {orderConfirmation.customer.fullName.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            A confirmation receipt and tracking itinerary have been dispatched to <strong>{orderConfirmation.customer.email}</strong>.
          </p>
          <div className="pt-2 text-xs text-gray-500 font-mono">
            Order Identifier: <strong className="text-gray-900">{orderConfirmation.orderId}</strong>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-gray-100 text-sm">
            <div>
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Recipient</span>
              <p className="font-semibold text-gray-900 mt-1">{orderConfirmation.customer.fullName}</p>
              <p className="text-gray-500 text-xs">{orderConfirmation.customer.phone}</p>
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Shipping Address</span>
              <p className="font-semibold text-gray-900 mt-1">{orderConfirmation.shipping.addressLine1}</p>
              <p className="text-gray-500 text-xs">
                {orderConfirmation.shipping.city}, {orderConfirmation.shipping.state} {orderConfirmation.shipping.postalCode}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Estimated Delivery</span>
              <p className="font-semibold text-brand-700 mt-1 flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                {orderConfirmation.estimatedDelivery}
              </p>
              <p className="text-gray-500 text-xs">Tracked carrier delivery</p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <h3 className="font-serif font-bold text-gray-900 mb-4">Purchased Titles</h3>
            <div className="divide-y divide-gray-100">
              {orderConfirmation.items.map((item) => (
                <div key={item.book.id} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.book.coverImage}
                      alt={item.book.title}
                      className="w-10 h-14 object-cover rounded-md shadow-xs border border-gray-100"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 font-serif">{item.book.title}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatCurrency(item.book.price)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(item.book.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Final Financials */}
          <div className="pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-600 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium text-gray-900">{formatCurrency(orderConfirmation.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="font-medium text-gray-900">
                {orderConfirmation.shippingFee === 0 ? 'FREE' : formatCurrency(orderConfirmation.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%):</span>
              <span className="font-medium text-gray-900">{formatCurrency(orderConfirmation.tax)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Paid:</span>
              <span className="text-brand-700 font-serif text-lg">{formatCurrency(orderConfirmation.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center pt-4">
          <Link to="/books">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue Exploring Novella
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // CHECKOUT FORM VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Checkout Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <Lock className="w-7 h-7 text-brand-600" />
          Secure Checkout
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Complete your customer and delivery details below to finalize your order.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Fields Section */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Customer Contact Info */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h2 className="text-lg font-serif font-bold text-gray-900">
                  Customer Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Full Name"
                    required
                    placeholder="Eleanor Vance"
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    error={errors.fullName}
                    leftIcon={<User className="w-4 h-4" />}
                  />
                </div>

                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    placeholder="eleanor@example.com"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    error={errors.email}
                    helperText="Order receipt & tracking will be sent here"
                    leftIcon={<Mail className="w-4 h-4" />}
                  />
                </div>

                <div>
                  <Input
                    label="Phone Number"
                    type="tel"
                    required
                    placeholder="(555) 019-2834"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    error={errors.phone}
                    leftIcon={<Phone className="w-4 h-4" />}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h2 className="text-lg font-serif font-bold text-gray-900">
                  Shipping Address
                </h2>
              </div>

              <div className="space-y-4">
                <Input
                  label="Street Address"
                  required
                  placeholder="742 Evergreen Terrace"
                  value={shippingInfo.addressLine1}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, addressLine1: e.target.value })}
                  error={errors.addressLine1}
                  leftIcon={<MapPin className="w-4 h-4" />}
                />

                <Input
                  label="Apartment, suite, unit (optional)"
                  placeholder="Apt 4B"
                  value={shippingInfo.addressLine2}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, addressLine2: e.target.value })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Input
                      label="City"
                      required
                      placeholder="Springfield"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      error={errors.city}
                    />
                  </div>

                  <div>
                    <Input
                      label="State / Province"
                      required
                      placeholder="OR"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      error={errors.state}
                    />
                  </div>

                  <div>
                    <Input
                      label="ZIP / Postal Code"
                      required
                      placeholder="97477"
                      value={shippingInfo.postalCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                      error={errors.postalCode}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Mock Payment Method */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h2 className="text-lg font-serif font-bold text-gray-900">
                    Payment Method
                  </h2>
                </div>
                <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-semibold px-2 py-0.5 rounded-full">
                  Demo Sandbox Mode
                </span>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-xs sm:text-sm font-semibold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-brand-600 bg-brand-50/50 text-brand-700 shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-2xl border text-xs sm:text-sm font-semibold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-brand-600 bg-brand-50/50 text-brand-700 shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-bold">PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple-pay')}
                  className={`p-3 rounded-2xl border text-xs sm:text-sm font-semibold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'apple-pay'
                      ? 'border-brand-600 bg-brand-50/50 text-brand-700 shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-bold">Apple Pay</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4 pt-2">
                  <Input
                    label="Card Number (Demo Sandbox)"
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    error={errors.cardNumber}
                    helperText="Enter any 16-digit test number (e.g. 4242 4242 4242 4242)"
                    leftIcon={<CreditCard className="w-4 h-4" />}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiration Date"
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      error={errors.cardExpiry}
                    />

                    <Input
                      label="Security Code (CVV)"
                      placeholder="123"
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      error={errors.cardCvv}
                    />
                  </div>
                </div>
              )}

              {paymentMethod !== 'card' && (
                <div className="p-4 bg-gray-50 rounded-2xl text-center text-xs text-gray-600 space-y-1">
                  <p className="font-medium text-gray-800">Direct Express Checkout Activated</p>
                  <p>You will authorize safely through {paymentMethod === 'paypal' ? 'PayPal' : 'Apple Pay'} upon submission.</p>
                </div>
              )}

              <p className="text-[11px] text-gray-400 italic">
                * Note: This is an educational demonstration sandbox. No actual payments or sensitive financial records are processed or retained.
              </p>
            </div>

          </div>

          {/* Right Column: Order Summary & Trigger */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            <CartSummary showCheckoutButton={false} />

            <Button
              type="submit"
              size="lg"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full shadow-lg shadow-brand-500/25"
              rightIcon={<PackageCheck className="w-5 h-5" />}
            >
              Place Order — {formatCurrency(total)}
            </Button>

            <div className="text-center">
              <Link to="/cart" className="text-xs text-gray-500 hover:text-brand-600 underline">
                Return to review cart items
              </Link>
            </div>
          </div>

        </div>
      </form>

    </div>
  );
};
