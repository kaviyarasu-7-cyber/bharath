import React, { useState } from 'react';
import { ShoppingBag, Search, Shield, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onNavigateSection,
}) => {
  const {
    cartCount,
    setIsCartOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    wishlist,
  } = useCart();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand title, one line wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateSection('hero')}
              className="text-left group cursor-pointer focus:outline-hidden"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs group-hover:bg-blue-700 transition-colors">
                  பா
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                    பாரத் எண்டர்பிரைசஸ்
                  </span>
                  <span className="text-xs text-blue-600 font-medium tracking-wide block">
                    Bharath Enterprises · வடசித்தூர்
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Zone 2: 4–5 nav links, 1–2 word labels, single-line */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
            <button
              onClick={() => onNavigateSection('hero')}
              className="hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              முகப்பு
            </button>
            <button
              onClick={() => onNavigateSection('ad-offers')}
              className="hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer py-1 text-blue-700 font-semibold"
            >
              விளம்பர சலுகைகள்
            </button>
            <button
              onClick={() => onNavigateSection('products')}
              className="hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              அனைத்து பொருட்கள்
            </button>
            <button
              onClick={() => onNavigateSection('bajaj-emi')}
              className="hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              பஜாஜ் EMI வசதி
            </button>
            <button
              onClick={() => onNavigateSection('contact')}
              className="hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              கடை முகவரி
            </button>
          </nav>

          {/* Zone 3: Search + Tracking + Wishlist + Cart Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Inline search input */}
            <div className="relative hidden md:block w-56 lg:w-64">
              <input
                type="text"
                placeholder="டிவி, மிக்ஸி, பிரிட்ஜ் தேட..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-500 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Mobile search toggle */}
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-700 hover:text-blue-600 rounded-lg active:bg-slate-100 transition-colors cursor-pointer"
              aria-label="தேடல்"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist indicator if any */}
            {wishlist.length > 0 && (
              <div className="hidden sm:flex items-center gap-1 text-xs text-rose-600 px-2 py-1 bg-rose-50 rounded-lg">
                <Heart className="w-3.5 h-3.5 fill-rose-600" />
                <span className="font-semibold tabular-nums">{wishlist.length}</span>
              </div>
            )}

            {/* Shopping Cart button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative hidden md:flex items-center gap-2 px-3.5 py-2 min-h-[44px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-all shadow-xs cursor-pointer group"
              aria-label={`கூடை (${cartCount} பொருட்கள்)`}
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="text-xs font-semibold whitespace-nowrap">கூடை</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-slate-900 text-xs font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin entry point */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg transition-colors cursor-pointer ${
                isAdminAuthenticated
                  ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  : 'text-slate-500 hover:text-slate-800 active:bg-slate-100'
              }`}
              title={isAdminAuthenticated ? 'நிர்வாகி டாஷ்போர்டு (Admin Active)' : 'கடை நிர்வாகி உள்நுழைவு (Admin Login)'}
              aria-label="கடை நிர்வாகி"
            >
              <Shield className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {isSearchExpanded && (
          <div className="pb-3 pt-1 md:hidden">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="டிவி, மிக்ஸி, வாஷிங் மெஷின் தேட..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-3 py-2.5 text-base bg-slate-100 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-500"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
