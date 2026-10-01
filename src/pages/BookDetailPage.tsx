import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Book } from '../types';
import { BookService } from '../services/bookService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatters';
import { Rating } from '../components/common/Rating';
import { QuantitySelector } from '../components/common/QuantitySelector';
import { Button } from '../components/common/Button';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { BookCard } from '../components/books/BookCard';
import { BookImage } from '../components/common/BookImage';
import {
  ChevronRight,
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  Calendar,
  Building,
  FileText,
  Barcode,
  ArrowLeft,
  User
} from 'lucide-react';

export const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();
  const { success, error } = useToast();

  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadBookData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const foundBook = await BookService.getBookById(id);
        if (isMounted) {
          setBook(foundBook);
          setQuantity(1);
          if (foundBook) {
            const related = await BookService.getRelatedBooks(foundBook.category, foundBook.id, 4);
            if (isMounted) setRelatedBooks(related);
          }
        }
      } catch (err) {
        console.error('Error fetching book detail:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadBookData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoadingState message="Fetching book details..." />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon="book"
          title="Book Not Found"
          description="The book you are looking for may have been removed or is temporarily unavailable."
          actionText="Browse Catalogue"
          onAction={() => navigate('/books')}
        />
      </div>
    );
  }

  const inCartQty = getItemQuantity(book.id);
  const isOutOfStock = book.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      error(`"${book.title}" is out of stock.`);
      return;
    }
    const added = addToCart(book, quantity);
    if (added) {
      setJustAdded(true);
      success(`Added ${quantity} ${quantity === 1 ? 'copy' : 'copies'} of "${book.title}" to your cart.`, 'Cart Updated');
      setTimeout(() => setJustAdded(false), 2500);
    } else {
      error(`Cannot add more copies. Maximum stock reached in your cart.`, 'Stock Limit');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 flex-wrap">
        <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/books" className="hover:text-brand-600 transition-colors">Catalogue</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link
          to={`/books?category=${encodeURIComponent(book.category)}`}
          className="hover:text-brand-600 transition-colors font-medium text-brand-600"
        >
          {book.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold line-clamp-1">{book.title}</span>
      </nav>

      {/* Main Details Presentation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Book Cover Presentation */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="sticky top-28 space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-gray-100 shadow-xl border border-gray-200">
              <BookImage
                src={book.coverImage}
                alt={`Cover artwork for ${book.title}`}
                title={book.title}
                category={book.category}
                containerClassName="w-full h-full"
              />
              {book.bestseller && (
                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-amber-500 text-white rounded-lg shadow-md">
                  Bestseller
                </span>
              )}
            </div>

            <div className="hidden sm:grid grid-cols-3 gap-2 text-center text-xs text-gray-500 pt-2">
              <div className="p-3 bg-white border border-gray-200 rounded-xl flex flex-col items-center gap-1 shadow-xs">
                <Truck className="w-4 h-4 text-brand-600" />
                <span className="font-medium">Fast Shipping</span>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-xl flex flex-col items-center gap-1 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Verified Copy</span>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-xl flex flex-col items-center gap-1 shadow-xs">
                <RotateCcw className="w-4 h-4 text-brand-600" />
                <span className="font-medium">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information, Specs, & Purchase Actions */}
        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              {book.category}
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 leading-tight">
              {book.title}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 mt-2 font-medium">
              by <span className="text-gray-900 underline font-semibold">{book.author}</span>
            </p>

            <div className="flex items-center gap-4 mt-3">
              <Rating value={book.rating} size="lg" />
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">Verified Reader Reviews</span>
            </div>
          </div>

          {/* Pricing Box & Stock Status */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Price</span>
                <div className="text-3xl sm:text-4xl font-serif font-extrabold text-gray-900">
                  {formatCurrency(book.price)}
                </div>
              </div>

              {/* Stock Indicator */}
              <div>
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                    Out of Stock
                  </span>
                ) : book.stock <= 5 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold animate-pulse">
                    Hurry! Only {book.stock} remaining in stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    ✓ In Stock ({book.stock} available)
                  </span>
                )}
              </div>
            </div>

            {/* Actions: Quantity Selector & Add to Cart */}
            {!isOutOfStock && (
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600">Qty:</span>
                  <QuantitySelector
                    quantity={quantity}
                    max={book.stock}
                    onChange={setQuantity}
                    size="lg"
                  />
                </div>

                <Button
                  size="lg"
                  variant={justAdded ? 'secondary' : 'primary'}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 shadow-md shadow-brand-500/20"
                  leftIcon={
                    justAdded ? (
                      <Check className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ShoppingBag className="w-5 h-5" />
                    )
                  }
                >
                  {justAdded
                    ? 'Added to Your Cart!'
                    : inCartQty > 0
                    ? `Add ${quantity} More to Cart (In Cart: ${inCartQty})`
                    : `Add ${quantity} to Cart — ${formatCurrency(book.price * quantity)}`}
                </Button>
              </div>
            )}

            {/* Cart Quick Navigation CTA */}
            {inCartQty > 0 && (
              <div className="pt-2 text-xs flex items-center justify-between text-gray-600 bg-brand-50/50 p-3.5 rounded-xl border border-brand-100">
                <span>You currently have <strong>{inCartQty} copies</strong> of this book in your cart.</span>
                <Link to="/cart" className="text-brand-600 font-bold hover:underline flex items-center gap-1">
                  View Shopping Cart →
                </Link>
              </div>
            )}
          </div>

          {/* Synopsis */}
          <div className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-gray-900 border-b border-gray-100 pb-2">
              Book Description & Synopsis
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {book.description}
            </p>
          </div>

          {/* Book Metadata & Specifications */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
              Product Details & Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-5 rounded-2xl border border-gray-200 text-xs">
              {book.publisher && (
                <div className="space-y-1">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" /> Publisher
                  </span>
                  <span className="font-semibold text-gray-900">{book.publisher}</span>
                </div>
              )}
              {book.publishedYear && (
                <div className="space-y-1">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Published
                  </span>
                  <span className="font-semibold text-gray-900">{book.publishedYear}</span>
                </div>
              )}
              {book.pages && (
                <div className="space-y-1">
                  <span className="text-gray-400 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Length
                  </span>
                  <span className="font-semibold text-gray-900">{book.pages} pages</span>
                </div>
              )}
              {book.isbn && (
                <div className="space-y-1">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Barcode className="w-3.5 h-3.5" /> ISBN
                  </span>
                  <span className="font-semibold text-gray-900">{book.isbn}</span>
                </div>
              )}
            </div>
          </div>

          {/* Reader Reviews Preview */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
              Reader Impressions
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/60 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[10px]">
                      <User className="w-3 h-3" />
                    </div>
                    <span className="font-bold text-gray-900">Devon Archer</span>
                    <span className="text-gray-400 text-[10px]">Verified Purchaser</span>
                  </div>
                  <Rating value={5} size="sm" showCount={false} />
                </div>
                <p className="text-gray-600 leading-relaxed italic">
                  "Incredible depth and clarity. Exactly the kind of authoritative text that belongs in every serious reader's permanent collection."
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Books in Category */}
      {relatedBooks.length > 0 && (
        <section className="pt-8 border-t border-gray-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                Readers Also Explored in {book.category}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Discover more critically acclaimed books in this discipline
              </p>
            </div>
            <Link
              to={`/books?category=${encodeURIComponent(book.category)}`}
              className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
            >
              <span>See category</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook.id} book={relBook} />
            ))}
          </div>
        </section>
      )}

      {/* Back button */}
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Catalogue
        </Button>
      </div>

    </div>
  );
};
