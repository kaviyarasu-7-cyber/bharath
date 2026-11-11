import React from 'react';
import { Home, Tag, LayoutGrid, CreditCard, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface MobileBottomNavProps {
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSection,
  onNavigateSection,
}) => {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="grid grid-cols-5 items-center h-16 px-1 max-w-md mx-auto">
        {/* Tab 1: Home */}
        <button
          onClick={() => onNavigateSection('hero')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] py-1 cursor-pointer transition-colors ${
            activeSection === 'hero' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1 leading-none tracking-tight">முகப்பு</span>
        </button>

        {/* Tab 2: Ad Offers */}
        <button
          onClick={() => onNavigateSection('ad-offers')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] py-1 cursor-pointer transition-colors ${
            activeSection === 'ad-offers' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          <Tag className="w-5 h-5 text-amber-600" />
          <span className="text-[10px] mt-1 leading-none tracking-tight">சலுகைகள்</span>
        </button>

        {/* Tab 3: Products */}
        <button
          onClick={() => onNavigateSection('products')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] py-1 cursor-pointer transition-colors ${
            activeSection === 'products' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] mt-1 leading-none tracking-tight">பொருட்கள்</span>
        </button>

        {/* Tab 4: Bajaj EMI */}
        <button
          onClick={() => onNavigateSection('bajaj-emi')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] py-1 cursor-pointer transition-colors ${
            activeSection === 'bajaj-emi' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          <CreditCard className="w-5 h-5 text-blue-600" />
          <span className="text-[10px] mt-1 leading-none tracking-tight">பஜாஜ் EMI</span>
        </button>

        {/* Tab 5: Cart Drawer Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] py-1 text-slate-700 hover:text-blue-600 cursor-pointer transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 leading-none tracking-tight font-semibold">கூடை</span>
        </button>
      </div>
    </nav>
  );
};
