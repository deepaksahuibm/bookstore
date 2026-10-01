import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-brand-500 selection:text-white">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-brand-600 text-white font-medium rounded-lg shadow-lg outline-none ring-2 ring-white"
      >
        Skip to main content
      </a>

      <ScrollRestoration />
      <Header />
      <main className="flex-1 w-full" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
