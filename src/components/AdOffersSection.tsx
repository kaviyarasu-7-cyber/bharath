import React from 'react';
import { ShoppingBag, Zap, Check, AlertCircle, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface AdOffersSectionProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const AdOffersSection: React.FC<AdOffersSectionProps> = ({
  products,
  onOpenProduct,
  onBuyNow,
}) => {
  const { addToCart, settings } = useCart();
  const adProducts = products.filter((p) => p.isAdOffer);

  if (adProducts.length === 0) return null;

  return (
    <section id="ad-offers" className="py-12 bg-gradient-to-b from-blue-50/60 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
              <span>பாரத் எண்டர்பிரைசஸ் நேரடி விளம்பரம்</span>
              <span aria-hidden="true">·</span>
              <span>வடசித்தூர் ஷோரூம்</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              இன்றைய சிறப்பு சலுகைகள்
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              கடையின் நேரடி விளம்பரத்தில் இடம்பெற்ற சிறப்பு விலையிலான எல்இடி தொலைக்காட்சிகள்.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>விளம்பர விலை — நிர்வாகி உறுதிப்படுத்தலுக்கு உட்பட்டது</span>
          </div>
        </div>

        {/* 2-Column Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {adProducts.map((tv) => {
            const savings = tv.originalPrice - tv.price;

            return (
              <div
                key={tv.id}
                className="bg-white rounded-2xl border border-blue-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with brand and Ad Tag */}
                  <div className="bg-blue-900 text-white px-5 py-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold block">
                        விளம்பரச் சிறப்பு சலுகை
                      </span>
                      <span className="text-sm font-bold text-white">
                        {tv.name}
                      </span>
                    </div>
                    <span className="bg-amber-400 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-sm tabular-nums">
                      {tv.discountPercentage}% தள்ளுபடி
                    </span>
                  </div>

                  {/* Product visual & details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                      <div
                        className="relative cursor-pointer group overflow-hidden rounded-xl bg-slate-100 aspect-4/3 flex items-center justify-center"
                        onClick={() => onOpenProduct(tv)}
                      >
                        <img
                          src={tv.image}
                          alt={tv.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                        <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[11px] px-2 py-0.5 rounded-sm">
                          விவரங்களை பார்க்க
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="text-xs text-slate-500">
                          <span>மாடல்: {tv.model}</span>
                          <span className="mx-1.5">·</span>
                          <span className="text-emerald-700 font-medium">கையிருப்பில் உள்ளது ({tv.stock} எண்கள்)</span>
                        </div>

                        {/* Price Area */}
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-blue-900 tabular-nums">
                              ₹{tv.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-sm text-slate-400 line-through tabular-nums">
                              ₹{tv.originalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                            உங்கள் நேரடி சேமிப்பு: ₹{savings.toLocaleString('en-IN')}
                          </div>
                        </div>

                        {/* EMI highlight */}
                        {tv.emiAvailable && (
                          <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-blue-900">
                            <div className="font-semibold flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5 text-blue-600" />
                              <span>பஜாஜ் பின்சர்வ் EMI: ₹{tv.monthlyEmiStarting}/மாதம்</span>
                            </div>
                            <span className="text-[11px] text-blue-700">0% வட்டி · உடனடி அப்ரூவல்</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Key Specs Preview */}
                    <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      {tv.specs.slice(0, 4).map((spec, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">
                            <strong className="text-slate-800 font-medium">{spec.label}:</strong> {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={`https://wa.me/91${settings.whatsappNumber}?text=${encodeURIComponent(
                      `வணக்கம் பாரத் எண்டர்பிரைசஸ், ${tv.name} (விலை: ₹${tv.price}) பற்றி விசாரிக்க விரும்புகிறேன்.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-emerald-50 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>வாட்ஸ்அப் விசாரணை</span>
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addToCart(tv)}
                      className="px-3.5 py-2 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-white border border-blue-300 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>கூடையில் சேர்க்க</span>
                    </button>

                    <button
                      onClick={() => onBuyNow(tv)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      இப்போதே வாங்க
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
