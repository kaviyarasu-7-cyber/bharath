import React, { useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, Sparkles, TrendingUp, Tag } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  selectedCategoryName: string;
  searchQuery: string;
  onClearFilters: () => void;
  onOpenDetail: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

type TabFilter = 'all' | 'bestseller' | 'new' | 'offers';
type SortOrder = 'default' | 'price-asc' | 'price-desc';

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategoryName,
  searchQuery,
  onClearFilters,
  onOpenDetail,
  onBuyNow,
}) => {
  const [tabFilter, setTabFilter] = useState<TabFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');

  // Filter based on tab
  let filtered = [...products];

  if (tabFilter === 'bestseller') {
    filtered = filtered.filter((p) => p.isBestSeller);
  } else if (tabFilter === 'new') {
    filtered = filtered.filter((p) => p.isNewArrival);
  } else if (tabFilter === 'offers') {
    filtered = filtered.filter((p) => p.discountPercentage >= 25 || p.isAdOffer);
  }

  // Sort
  if (sortOrder === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  return (
    <section id="products" className="py-12 bg-slate-50 min-h-[500px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
              <span>{selectedCategoryName || 'அனைத்துப் பொருட்கள்'}</span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span className="text-slate-500 tabular-nums">{filtered.length} பொருட்கள் கிடைக்கின்றன</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {searchQuery ? `"${searchQuery}" பற்றிய தேடல் முடிவுகள்` : 'நம்பகமான வீட்டு உபயோக சாதனங்கள்'}
            </h2>
          </div>

          {/* Interactive filter tabs + sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg max-w-full overflow-x-auto shrink-0 scrollbar-none">
              <button
                onClick={() => setTabFilter('all')}
                className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  tabFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                அனைத்தும்
              </button>
              <button
                onClick={() => setTabFilter('bestseller')}
                className={`min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  tabFilter === 'bestseller'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                <span>பிரபலமானவை</span>
              </button>
              <button
                onClick={() => setTabFilter('new')}
                className={`min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  tabFilter === 'new'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>புதிய வரவுகள்</span>
              </button>
              <button
                onClick={() => setTabFilter('offers')}
                className={`min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  tabFilter === 'offers'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-rose-600" />
                <span>சிறப்பு தள்ளுபடி</span>
              </button>
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-1 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="bg-white border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">வரிசைப்படுத்துதல்</option>
                <option value="price-asc">விலை: குறைந்தது முதல்</option>
                <option value="price-desc">விலை: அதிகமானது முதல்</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={onOpenDetail}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-xl border border-slate-200 mt-8">
            <p className="text-base font-semibold text-slate-700">
              தேடலுக்குரிய பொருட்கள் எதுவும் கிடைக்கவில்லை.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              தயவுசெய்து வேறு பெயர் அல்லது பிரிவை தேர்வு செய்து பார்க்கவும்.
            </p>
            <button
              onClick={onClearFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              அனைத்துப் பொருட்களையும் பார்க்க
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
