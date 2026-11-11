import React from 'react';
import { Phone, ArrowRight, CheckCircle2, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeroBannerProps {
  onExploreOffers: () => void;
  onExploreEmi: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreOffers, onExploreEmi }) => {
  const { settings } = useCart();

  return (
    <section className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_showroom_appliances_1794210840737.jpg"
          alt="பாரத் எண்டர்பிரைசஸ் வடசித்தூர் ஷோரூம்"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-102"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="max-w-2xl space-y-6">
          {/* Unboxed natural kicker */}
          <div className="text-xs sm:text-sm font-semibold tracking-wider text-blue-400">
            <span>எங்கள் கடைக்கு வரவேற்கிறோம்</span>
            <span className="mx-2 text-slate-500">·</span>
            <span className="text-slate-300">வடசித்தூர், கோயம்புத்தூர்</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            சிறந்த வீட்டு உபயோகப் பொருட்கள்,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
              சிறந்த விலையில்!
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            ஸ்மார்ட் எல்இடி டிவிகள், குளிர்சாதனப் பெட்டிகள், சலவை இயந்திரங்கள் மற்றும் மிக்ஸி கிரைண்டர்கள் அனைத்தும் ஒரே இடத்தில். பஜாஜ் பின்சர்வ் சுலப தவணை முறை வசதியுடன் உங்கள் கனவு இல்லத்தை அழகாக்குங்கள்.
          </p>

          {/* Trust points list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% அசல் பிராண்ட் சாதனங்கள்</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>பஜாஜ் 0% வட்டி சுலப தவணை</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>வடசித்தூர் பகுதியில் இலவச விநியோகம்</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>நேரடி கடையின் வாடிக்கையாளர் சேவை</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onExploreOffers}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>இன்றைய சிறப்பு சலுகைகள்</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreEmi}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-sm rounded-lg border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>பஜாஜ் EMI பற்றி அறிய</span>
            </button>

            <a
              href={`tel:${settings.phone1.replace(/\s+/g, '')}`}
              className="px-4 py-3 text-slate-300 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-blue-400" />
              <span className="tabular-nums">அழைக்க: {settings.phone1}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
