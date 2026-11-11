import React from 'react';
import { Tv, Refrigerator, Disc, Fan, Blend, Utensils, Zap, Speaker, LayoutGrid } from 'lucide-react';
import { Category } from '../types';

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'tv':
      return Tv;
    case 'refrigerator':
      return Refrigerator;
    case 'washingmachine':
      return Disc;
    case 'fan':
      return Fan;
    case 'blender':
      return Blend;
    case 'utensils':
      return Utensils;
    case 'zap':
      return Zap;
    case 'speaker':
      return Speaker;
    default:
      return LayoutGrid;
  }
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="bg-white border-b border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              பொருட்களின் பிரிவுகள்
            </h2>
            <p className="text-xs text-slate-500">
              உங்கள் தேவைக்கேற்ற மின்சாதனங்களை தேர்வு செய்யுங்கள்
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            அனைத்துப் பொருட்கள்
          </button>
        </div>

        {/* Responsive category row: horizontal swipe on mobile, 8-column grid on desktop */}
        <div className="flex overflow-x-auto pb-2 scrollbar-none md:grid md:grid-cols-8 gap-2.5 sm:gap-3 snap-x">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.iconName);
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all cursor-pointer group shrink-0 w-28 md:w-auto min-h-[44px] snap-start ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-medium line-clamp-2 leading-snug ${
                    isSelected ? 'text-blue-900 font-bold' : 'text-slate-800'
                  }`}
                >
                  {cat.name}
                </span>
                {cat.productCount !== undefined && (
                  <span className="text-[10px] text-slate-400 mt-1 tabular-nums">
                    {cat.productCount} பொருட்கள்
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
