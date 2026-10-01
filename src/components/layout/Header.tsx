import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, BookOpen, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { SearchBar } from '../common/SearchBar';

export const Header: React.FC = () => {
  const { totalItemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'All Books', path: '/books' },
    { label: 'Technology', path: '/books?category=Technology' },
    { label: 'Sci-Fi', path: '/books?category=Sci-Fi' },
    { label: 'Fiction', path: '/books?category=Fiction' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      {/* Top Banner */}
      <div className="bg-brand-900 text-brand-100 text-xs py-1.5 px-4 text-center font-medium">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Free express shipping on all orders over $50! Use code <strong>FREESHIP</strong>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-brand-900 font-extrabold text-xl sm:text-2xl tracking-tight focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg shrink-0 group"
            aria-label="Novella Books Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="font-serif font-bold text-gray-900">
              Novella<span className="text-brand-600">.</span>
            </span>
          </Link>

          {/* Desktop Search Bar with Live Preview */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <SearchBar autoNavigate showLivePreview placeholder="Search books, authors, or categories..." />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand-600 font-semibold'
                      : 'text-gray-600 hover:text-brand-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 text-gray-700 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label={`Shopping Cart with ${totalItemCount} items`}
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-in zoom-in">
                  {totalItemCount > 99 ? '99+' : totalItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-brand-600 hover:bg-gray-100 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden pb-3 pt-1">
          <SearchBar autoNavigate showLivePreview placeholder="Search title, author, category..." />
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(link.path);
                }}
                className="text-left px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100">
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 bg-brand-50 text-brand-700 rounded-lg font-medium text-sm"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                View Shopping Cart
              </span>
              <span className="bg-brand-600 text-white font-bold px-2 py-0.5 rounded-full text-xs">
                {totalItemCount} items
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
