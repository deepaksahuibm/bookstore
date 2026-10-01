import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CartProvider, useCart } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';
import { mockBooks } from '../data/mockBooks';

const SetupCartAndRender: React.FC = () => {
  const { addToCart } = useCart();

  React.useEffect(() => {
    addToCart(mockBooks[0], 2);
  }, [addToCart]);

  return <CheckoutPage />;
};

const renderCheckout = () => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <SetupCartAndRender />
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('Checkout Flow', () => {
  it('validates required fields on submission attempt', async () => {
    const user = userEvent.setup();
    renderCheckout();

    const submitBtn = screen.getByRole('button', { name: /Place Order/i });
    await user.click(submitBtn);

    expect(await screen.findByText('Full name is required')).toBeInTheDocument();
    expect(screen.getByText('Email address is required')).toBeInTheDocument();
    expect(screen.getByText('Phone number is required')).toBeInTheDocument();
    expect(screen.getByText('Street address is required')).toBeInTheDocument();
  });

  it('completes order successfully when all valid info is provided', async () => {
    const user = userEvent.setup();
    renderCheckout();

    // Fill customer info
    await user.type(screen.getByLabelText(/Full Name/i), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/Email Address/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/Phone Number/i), '555-0199');

    // Fill shipping
    await user.type(screen.getByLabelText(/Street Address/i), '123 Algorithm Way');
    await user.type(screen.getByLabelText(/City/i), 'London');
    await user.type(screen.getByLabelText(/State/i), 'Greater London');
    await user.type(screen.getByLabelText(/ZIP/i), 'SW1A 1AA');

    // Fill mock card info
    await user.type(screen.getByLabelText(/Card Number/i), '4242424242424242');
    await user.type(screen.getByLabelText(/Expiration Date/i), '12/28');
    await user.type(screen.getByLabelText(/Security Code/i), '123');

    const submitBtn = screen.getByRole('button', { name: /Place Order/i });
    await user.click(submitBtn);

    // Verify order confirmed receipt
    expect(await screen.findByText(/Thank you for your order, Ada!/i, {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByText(/Order Confirmed & Processing/i)).toBeInTheDocument();
    expect(screen.getByText(/Order Identifier:/i)).toBeInTheDocument();
  });
});
