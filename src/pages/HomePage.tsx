import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';
import { BookService } from '../services/bookService';
import { BookCard } from '../components/books/BookCard';
import { Button } from '../components/common/Button';
import { LoadingState } from '../components/common/LoadingState';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  TrendingUp,
  Cpu,
  Rocket,
  Compass,
  BookmarkCheck,
  Shield,
  CreditCard,
  Truck
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [bestsellers, setBestsellers] = useState<Book[]>([]);
  const [techBooks, setTechBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadHomeData() {
      try {
        const [featured, best, tech] = await Promise.all([
          BookService.getFeaturedBooks(),
          BookService.getBestsellers(),
          BookService.queryBooks({ category: 'Technology' }),
        ]);

        if (isMounted) {
          setFeaturedBooks(featured.slice(0, 4));
          setBestsellers(best.slice(0, 4));
          setTechBooks(tech.books.slice(0, 4));
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load home page books', error);
        if (isMounted) setIsLoading(false);
      }
    }

    loadHomeData();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { name: 'Technology', count: '5 titles', icon: Cpu, color: 'bg-blue-500/10 text-brand-600 border-blue-200' },
    { name: 'Sci-Fi', count: '4 titles', icon: Rocket, color: 'bg-purple-500/10 text-purple-600 border-purple-200' },
    { name: 'Fiction', count: '4 titles', icon: BookOpen, color: 'bg-amber-500/10 text-amber-600 border-amber-200' },
    { name: 'Non-Fiction', count: '3 titles', icon: Compass, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
    { name: 'Finance', count: '2 titles', icon: CreditCard, color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200' },
    { name: 'Self-Help', count: '2 titles', icon: BookmarkCheck, color: 'bg-rose-500/10 text-rose-600 border-rose-200' },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 text-white overflow-hidden py-16 sm:py-24">
        {/* Subtle decorative background blur shapes */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-brand-200 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Hand-picked masterworks & modern bestsellers
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
                Stories, ideas & insights to shape your world.
              </h1>

              <p className="text-base sm:text-lg text-brand-100/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Discover exceptional books spanning deep technical engineering, timeless literary fiction, groundbreaking sci-fi, and transformative non-fiction.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/books" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-brand-500/25" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Browse Catalogue
                  </Button>
                </Link>
                <Link to="/books?category=Technology" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white/20 hover:bg-white/10">
                    Explore Tech & Architecture
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-bold font-serif text-white">20+</div>
                  <div className="text-xs text-brand-200">Curated Titles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif text-white">4.8★</div>
                  <div className="text-xs text-brand-200">Average Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif text-white">100%</div>
                  <div className="text-xs text-brand-200">Reader Guarantee</div>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
                <div className="relative bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/15 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" /> Editors’ Pick of the Month
                    </span>
                    <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-full">Technology</span>
                  </div>

                  <div className="flex gap-4 items-center">
                    <img
                      src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80"
                      alt="Designing Data-Intensive Applications"
                      className="w-24 h-32 sm:w-28 sm:h-36 object-cover rounded-xl shadow-md shrink-0 border border-white/10"
                    />
                    <div className="space-y-2 text-left">
                      <h2 className="text-base sm:text-lg font-serif font-bold text-white line-clamp-2">
                        Designing Data-Intensive Applications
                      </h2>
                      <p className="text-xs text-brand-200">Martin Kleppmann</p>
                      <div className="text-lg font-bold text-white">$49.99</div>
                      <Link to="/books/book-1" className="inline-block">
                        <span className="text-xs text-brand-300 hover:text-white underline font-medium">
                          Read Overview →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
              Explore by Category
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Browse top subjects hand-curated by our literary editors
            </p>
          </div>
          <Link
            to="/books"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View all categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/books?category=${encodeURIComponent(cat.name)}`}
                className="group p-5 bg-white rounded-2xl border border-gray-200 hover:border-brand-500 hover:shadow-md transition-all flex flex-col items-center text-center focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 border ${cat.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs text-gray-400 mt-0.5">{cat.count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Books Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Curated Showcase
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
              Featured Titles
            </h2>
          </div>
          <Link
            to="/books"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>Explore full library</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingState variant="skeleton-grid" count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Promo Banner / Reading Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-800 to-brand-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 bg-amber-400 text-brand-950 rounded-full text-xs font-bold uppercase tracking-wider">
              Exclusive Member Perk
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
              Build your technical & intellectual library today.
            </h2>
            <p className="text-brand-100 text-sm sm:text-base leading-relaxed">
              Every book in our catalogue is rigorously selected for timeless depth and real-world applicability.
            </p>
            <div className="pt-2">
              <Link to="/books?category=Technology">
                <Button variant="secondary" size="lg">
                  Explore Software Engineering Books
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Bestsellers Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              <TrendingUp className="w-3.5 h-3.5" /> Readers’ Favorites
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
              Trending Bestsellers
            </h2>
          </div>
          <Link
            to="/books"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>See all {bestsellers.length > 0 ? 'bestsellers' : 'books'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingState variant="skeleton-grid" count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Recommended Tech & Science Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              <Cpu className="w-3.5 h-3.5" /> Systems & Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
              Recommended in Technology
            </h2>
          </div>
          <Link
            to="/books?category=Technology"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View Technology catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingState variant="skeleton-grid" count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {techBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Features Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">Lightning Delivery</h4>
              <p className="text-xs text-gray-500">Ships within 24 hours in protective packaging</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">Quality Verified</h4>
              <p className="text-xs text-gray-500">100% authentic editions directly from publishers</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">Carefully Curated</h4>
              <p className="text-xs text-gray-500">Only the highest-rated titles make our shelves</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
