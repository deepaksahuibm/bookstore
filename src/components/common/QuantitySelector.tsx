import React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface QuantitySelectorProps {
  quantity: number;
  max: number;
  min?: number;
  onChange: (quantity: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  max,
  min = 1,
  onChange,
  size = 'md',
  disabled = false,
}) => {
  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const handleDirectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) return;
    const clamped = Math.max(min, Math.min(val, max));
    onChange(clamped);
  };

  const btnSizes = {
    sm: 'p-1 h-7 w-7',
    md: 'p-1.5 h-9 w-9',
    lg: 'p-2 h-11 w-11',
  };

  const inputSizes = {
    sm: 'h-7 w-8 text-xs',
    md: 'h-9 w-12 text-sm',
    lg: 'h-11 w-14 text-base',
  };

  return (
    <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= min}
        aria-label="Decrease quantity"
        className={`${btnSizes[size]} flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <input
        type="number"
        min={min}
        max={max}
        value={quantity}
        onChange={handleDirectInput}
        disabled={disabled}
        aria-label="Quantity"
        className={`${inputSizes[size]} text-center font-medium text-gray-800 bg-transparent border-x border-gray-200 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
        className={`${btnSizes[size]} flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
