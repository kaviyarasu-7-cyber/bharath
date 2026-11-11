import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalAmount,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              உங்கள் கூடை ({cart.length} வகைகள்)
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="கூடையை மூடு"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">
                உங்கள் கூடை காலியாக உள்ளது
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                பாரத் எண்டர்பிரைசஸின் தரமான எலக்ட்ரானிக்ஸ் மற்றும் வீட்டு உபயோகப் பொருட்களை பார்வையிடுங்கள்.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                பொருட்களைப் பார்க்க
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        aria-label="நீக்கு"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                      மாடல்: {item.product.model}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-slate-100 text-slate-600 cursor-pointer"
                        aria-label="குறைக்க"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-bold tabular-nums text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 hover:bg-slate-100 text-slate-600 cursor-pointer disabled:opacity-40"
                        aria-label="அதிகரிக்க"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* Delivery notice */}
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>வடசித்தூர் & சுற்றுவட்டார பகுதிகளுக்கு இலவச நேரடி விநியோகம்!</span>
            </div>

            {/* Subtotal & Total */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>பொருட்களின் மதிப்பு (Subtotal):</span>
                <span className="font-semibold tabular-nums text-slate-800">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>விநியோக கட்டணம் (Delivery):</span>
                <span className="font-semibold text-emerald-600">இலவசம் (Free)</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>மொத்த தொகை (Total):</span>
                <span className="text-xl font-extrabold text-blue-900 tabular-nums">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setIsCartOpen(false)}
                className="py-2.5 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-center"
              >
                ஷாப்பிங் தொடர்க
              </button>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="py-2.5 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>ஆர்டர் செய்ய</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
