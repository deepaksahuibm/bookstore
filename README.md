# 📚 Novella Books — Agentic AI Frontend Bookstore

A responsive, production-quality eCommerce bookstore web application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **React Router**.

This project demonstrates the thoughtful, disciplined execution of **Agentic AI Software Engineering** — showcasing end-to-end workflow from requirements decomposition, architectural specification, component design system implementation, responsive refinement, accessibility audits, automated testing, and build verification.

---

## 🌟 Key Features

### 1. Home / Bookstore Showcase
- **Top Promotional Banner**: Real-time free shipping calculation and incentive banners.
- **Hero Showcase**: Value proposition with primary CTA buttons, trust badges, and an interactive "Editors' Pick" preview card.
- **Visual Category Browser**: Multi-subject category filters (Technology, Sci-Fi, Fiction, Non-Fiction, Finance, Self-Help).
- **Curated Carousels / Grids**: Featured titles, trending bestsellers, and architecture recommendations.
- **Value Proposition Bar**: Highlighting lightning delivery, verified editions, and reader guarantees.

### 2. Comprehensive Book Catalogue & Multi-Filtering
- **Live Search**: Instant keyword querying across book titles, authors, categories, descriptions, and ISBN numbers.
- **Multi-Facet Filtering**:
  - Filter by category taxonomy
  - Maximum price slider ($10 – $60)
  - Minimum customer rating filter (4.0+, 4.5+, 4.8+)
  - In-stock availability toggle
- **Sorting Engine**: Sort by Curated/Featured, Price (Low to High / High to Low), Customer Rating, and Title Alphabetical (A-Z / Z-A).
- **Active Filter Chips**: Dismissible filter chips displaying active query states with a 1-click "Clear All" action.
- **Empty & Loading States**: Skeleton grid loaders and informative zero-result states with fallback actions.

### 3. Rich Book Detail Experience
- High-resolution cover display with bestseller/featured badges.
- Dynamic stock indicator showing real-time inventory count and "Hurry! Only X left" warnings.
- Increment/decrement quantity selector with automatic ceiling clamped to available stock.
- Specifications grid (Publisher, Publication year, Page count, ISBN).
- Related books recommendation carousel based on book category.
- Seamless breadcrumb navigation and deep linking.

### 4. Shopping Cart & State Management
- Persistent shopping cart backed by browser `localStorage`.
- Real-time cart indicator badge in the persistent header.
- Increment, decrement, direct input, and removal controls.
- Automatic shipping fee calculation (Free express shipping on orders $\ge \$50$, otherwise \$4.99).
- Dynamic sales tax estimation (8%) and real-time total computation.

### 5. Multi-Step Checkout Flow
- **Customer Contact Information**: Name, Email, Phone number with format validation.
- **Shipping Address**: Full address fields with street, unit, city, state, and postal code.
- **Payment Method Selection**: Credit card sandbox, PayPal express, or Apple Pay tabs.
- **Order Review**: Real-time order summary calculation and instant validation.
- **Order Confirmation Receipt**: Generates a unique tracking reference (`NOV-XXXXXX`), estimated delivery date, recipient summary, and purchased line items breakdown.

---

## 🏗️ Architecture & Folder Structure

```
src/
├── assets/             # Static icons and assets
├── components/
│   ├── common/         # Atomic UI Design System
│   │   ├── Button.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingState.tsx
│   │   ├── Modal.tsx
│   │   ├── QuantitySelector.tsx
│   │   ├── Rating.tsx
│   │   └── SearchBar.tsx
│   ├── layout/         # Shell and navigation
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── books/          # Domain-specific components
│   │   ├── BookCard.tsx
│   │   ├── BookGrid.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── SortControl.tsx
│   └── cart/           # Cart and checkout widgets
│       ├── CartItem.tsx
│       └── CartSummary.tsx
├── context/
│   └── CartContext.tsx # Centralized Cart state + localStorage sync
├── data/
│   └── mockBooks.ts    # 22 curated books across 6 genres
├── hooks/
│   └── useLocalStorage.ts
├── layouts/
│   └── MainLayout.tsx  # React Router Shell with ScrollRestoration
├── pages/
│   ├── HomePage.tsx
│   ├── BookListingPage.tsx
│   ├── BookDetailPage.tsx
│   ├── CartPage.tsx
│   └── CheckoutPage.tsx
├── services/
│   └── bookService.ts  # Clean API abstraction with async querying
├── tests/              # Vitest & React Testing Library test suites
│   ├── BookCard.test.tsx
│   ├── BookService.test.ts
│   ├── CartContext.test.tsx
│   ├── CheckoutPage.test.tsx
│   └── setup.ts
├── types/
│   └── index.ts        # Strict TypeScript domain interfaces
├── utils/
│   └── formatters.ts   # Currency, shipping, and tax calculations
├── App.tsx             # Root router declaration
├── index.css           # Tailwind directives and base layer
└── main.tsx            # Entry point
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) + PostCSS |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Testing** | [Vitest 3](https://vitest.dev/) + [@testing-library/react](https://testing-library.com/) + [jsdom](https://github.com/jsdom/jsdom) |
| **Code Quality** | ESLint 9 + Prettier |

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- **Node.js**: v18.0.0 or later (Tested with Node v24.16.0)
- **npm**: v9.0.0 or later

### 1. Clone & Install
```bash
git clone <repo-url>
cd bookstore
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Run Automated Tests
```bash
# Run unit & integration test suite once
npm test

# Run tests in interactive watch mode
npm run test:watch
```

### 4. Build for Production & Typecheck
```bash
npm run build
```
Generates optimized static output in `dist/`.

### 5. Lint
```bash
npm run lint
```

---

## 📱 Responsive Design Strategy

The application adopts a **mobile-first** responsive architecture across three key viewport tiers:

- **Mobile (320px – 767px)**:
  - Collapsible navigation drawer with touch-friendly tap targets ($\ge 44\text{px}$).
  - Inline sticky search bar.
  - Floating slide-over modal dialog for faceted filtering.
  - Stacked 1-column product cards with clean metadata.
- **Tablet (768px – 1023px)**:
  - 2-to-3 column responsive grid layouts (`BookGrid`).
  - Tablet-adapted horizontal search toolbar.
  - Adapted cart and checkout form grids.
- **Desktop (1024px+)**:
  - Full horizontal sticky navigation with live cart count badge.
  - Fixed sidebar multi-faceted filtering alongside a 3-to-4 column product grid.
  - Two-column split layout for cart review and checkout flow.

---

## ♿ Accessibility (a11y) Approach

- **Semantic HTML**: Proper use of `<header>`, `<main>`, `<nav>`, `<aside>`, `<section>`, `<footer>`, `<dialog>`, and `<button>`.
- **Keyboard Navigation**: Explicit focus rings (`focus-visible:ring-2 focus-visible:ring-brand-500`) across all interactive elements.
- **ARIA Annotations**:
  - Descriptive `aria-label`s on icon-only buttons (cart triggers, quantity adjusters, delete buttons, filter dismissals).
  - `role="region"`, `role="search"`, and `role="dialog"` landmarks.
  - `aria-invalid` and `aria-describedby` on validated form fields.
  - `aria-busy="true"` on skeleton loading states.
- **Color Contrast**: WCAG AA compliant text color pairings on all backgrounds.

---

## 🤖 How I Used AI / Agentic Development

This repository was constructed in partnership with **IBM Bob / GitHub Copilot** acting as an Applied AI Specialist and Senior Front-End Engineer. The development followed an explicit **Agentic Lifecycle**:

```
[Analyze Requirements] ➔ [Architecture & Planning] ➔ [Component Design System] 
      ➔ [Domain Layer & State] ➔ [Page Assembly] ➔ [Automated Testing] ➔ [Build QA]
```

### 1. Requirements Analysis & Architecture
- **AI Contribution**: Deconstructed the functional and non-functional requirements into a decoupled architecture separating UI, Data Access (`BookService`), State (`CartContext`), and Atomic Components (`common/`).
- **Developer Review**: Verified that the service abstraction completely isolates mock data from React components, enabling drop-in REST or GraphQL API replacement.

### 2. Data Modeling & Domain Service
- **AI Contribution**: Synthesized a realistic catalog of 22 books across diverse categories with prices, ratings, publication details, and stock limits, plus an asynchronous query engine supporting multi-criterion search and sorting.
- **Developer Review**: Confirmed edge cases such as zero-stock items (`The Lean Startup`) and low-stock thresholds to test out-of-stock badge rendering and disabled cart buttons.

### 3. Atomic Design System Generation
- **AI Contribution**: Generated reusable design system elements (`Button`, `Input`, `Rating`, `QuantitySelector`, `Modal`, `EmptyState`, `LoadingState`, `SearchBar`).
- **Developer Review**: Enforced consistent spacing, accessibility tokens, and error handling for form controls.

### 4. Refactoring & Bug Resolution
- **AI Contribution**: Identified and resolved TypeScript import path mismatches in `MainLayout.tsx` and cleaned up unused icon imports across pages during ESLint validation.
- **Developer Review**: Ran `npm run build` and `npm run test` after each fix to ensure continuous green build status.

### 5. Automated Test Generation
- **AI Contribution**: Created 20 comprehensive unit and integration tests across 4 suites covering `BookService` query operations, `CartContext` mutations and stock clamping, `BookCard` interactions, and end-to-end `CheckoutPage` form validation and order placement.
- **Developer Review**: Executed `vitest` to verify 100% test pass rate with zero flaky tests.

---

## 🔒 Security & Privacy Considerations

- **Frontend-Only Sandbox**: No real credit card or sensitive financial information is transmitted or stored.
- **Form Sanitization**: All user inputs are handled through controlled React inputs with validation against injection and formatting anomalies.
- **No Secrets**: The project contains zero API keys, secrets, or hardcoded credentials.

---

## 🔮 Future Improvements

1. **Authentication & User Profiles**: Integrate OAuth (e.g. GitHub/Google) or Auth0 for saved wishlists and past order histories.
2. **Backend API Integration**: Connect `BookService` to a live Node.js/Express or Python/FastAPI microservice with PostgreSQL database.
3. **Stripe Integration**: Add real Stripe Elements or PayPal SDK for actual payment processing in live environments.
4. **Product Reviews System**: Enable authenticated users to post star ratings and rich written reviews.
5. **Dark Mode Theme**: Add dynamic Tailwind dark mode toggle.
