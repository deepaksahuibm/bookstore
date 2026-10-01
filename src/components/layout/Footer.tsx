import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, ShieldCheck, Truck, RefreshCw, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-950 border border-brand-800 flex items-center justify-center text-brand-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Free Express Shipping</h4>
              <p className="text-gray-400 text-xs mt-0.5">On all domestic orders over $50</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-950 border border-brand-800 flex items-center justify-center text-brand-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Secure Checkout</h4>
              <p className="text-gray-400 text-xs mt-0.5">256-bit SSL encrypted transactions</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-950 border border-brand-800 flex items-center justify-center text-brand-400 shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">30-Day Easy Returns</h4>
              <p className="text-gray-400 text-xs mt-0.5">Hassle-free guarantee for readers</p>
            </div>
          </div>
        </div>

        {/* Navigation & Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12">
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-white font-serif font-bold text-2xl tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              Novella<span className="text-brand-500">.</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              An independent, thoughtfully curated online bookstore bringing the world’s best literature, technology, science, and history directly to your doorstep.
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>Crafted for bibliophiles everywhere</span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Explore</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/books" className="hover:text-white transition-colors">All Catalogue</Link>
              </li>
              <li>
                <Link to="/books?category=Technology" className="hover:text-white transition-colors">Technology & Coding</Link>
              </li>
              <li>
                <Link to="/books?category=Sci-Fi" className="hover:text-white transition-colors">Science Fiction</Link>
              </li>
              <li>
                <Link to="/books?category=Fiction" className="hover:text-white transition-colors">Literary Fiction</Link>
              </li>
              <li>
                <Link to="/books?category=Finance" className="hover:text-white transition-colors">Business & Finance</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Support</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">Order Tracking</Link>
              </li>
              <li>
                <a href="#help" className="hover:text-white transition-colors">Shipping Rates</a>
              </li>
              <li>
                <a href="#help" className="hover:text-white transition-colors">Returns & Refunds</a>
              </li>
              <li>
                <a href="#help" className="hover:text-white transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#help" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Stay Inspired</h5>
            <p className="text-xs text-gray-400 mb-3">Get our weekly reading recommendations & discounts.</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="reader@example.com"
                  aria-label="Email address for newsletter"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-3 pr-8 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 top-1 bottom-1 px-2 bg-brand-600 hover:bg-brand-500 text-white rounded text-xs flex items-center justify-center transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Novella Bookstore. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Built with precision & passion</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by Applied AI Specialist</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
