import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight, Phone, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useCart();

  const quickMessages = [
    {
      title: 'நேரடி இருப்பு மற்றும் விலை அறிய',
      text: 'வணக்கம் பாரத் எண்டர்பிரைசஸ், கடையில் உள்ள எலக்ட்ரானிக்ஸ் பொருட்களின் தற்போதைய விலை மற்றும் சலுகைகள் பற்றி அறிய விரும்புகிறேன்.',
    },
    {
      title: 'பஜாஜ் பின்சர்வ் 0% EMI வசதி பற்றி',
      text: 'வணக்கம், பஜாஜ் பின்சர்வ் சுலப தவணை முறைக்கு தேவையான ஆவணங்கள் மற்றும் தகுதிகள் பற்றி அறிய விரும்புகிறேன்.',
    },
    {
      title: '32-இன்ச் / 24-இன்ச் எல்இடி டிவி சலுகை',
      text: 'வணக்கம், விளம்பரத்தில் பார்த்த 32-இன்ச் (₹10,999) / 24-இன்ச் (₹9,500) எல்இடி தொலைக்காட்சி இருப்பு பற்றி விசாரிக்க விரும்புகிறேன்.',
    },
    {
      title: 'கடை அமைவிடம் மற்றும் வேலை நேரம்',
      text: 'வணக்கம், வடசித்தூரில் உங்கள் கடை உள்ள இடம் மற்றும் இன்று கடை திறந்திருக்கும் நேரத்தை தெரிவிக்கவும்.',
    },
  ];

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end">
      {/* Quick message popup card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">பாரத் எண்டர்பிரைசஸ் உதவி</h4>
                <span className="text-[10px] text-emerald-200">நேரடி WhatsApp சேவை</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
              aria-label="மூடு"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-2 max-h-72 overflow-y-auto">
            <p className="text-xs text-slate-600 mb-2 font-medium">
              விரைவான விசாரணைக்கு கீழே உள்ளதில் ஒன்றை தேர்வு செய்யவும்:
            </p>

            {quickMessages.map((msg, index) => (
              <a
                key={index}
                href={`https://wa.me/91${settings.whatsappNumber}?text=${encodeURIComponent(msg.text)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="p-2.5 bg-white hover:bg-emerald-50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between group block text-left"
              >
                <div className="pr-2">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">
                    {msg.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[240px]">
                    {msg.text}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 shrink-0" />
              </a>
            ))}

            {/* Direct Phone call fallback */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span className="tabular-nums font-semibold">{settings.phone1}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>வடசித்தூர்</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group scale-100 active:scale-95"
        aria-label="வாட்ஸ்அப் உதவி"
      >
        <MessageCircle className="w-6 h-6 transition-transform group-hover:rotate-12" />
        <span className="text-xs font-bold pr-1 hidden sm:inline">
          {isOpen ? 'மூடுக' : 'WhatsApp உதவி'}
        </span>
      </button>
    </div>
  );
};
