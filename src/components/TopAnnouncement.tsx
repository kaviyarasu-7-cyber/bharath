import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const TopAnnouncement: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { settings } = useCart();

  if (dismissed) return null;

  return (
    <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="font-semibold text-amber-400">சிறப்பு அறிவிப்பு:</span>
          <span className="truncate">{settings.announcement}</span>
        </div>

        <div className="flex items-center gap-4 text-slate-300 shrink-0">
          <a
            href={`tel:${settings.phone1.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-blue-400" />
            <span className="tabular-nums font-medium">{settings.phone1}</span>
          </a>
          <span className="text-slate-600">|</span>
          <a
            href={`tel:${settings.phone2.replace(/\s+/g, '')}`}
            className="hover:text-white transition-colors tabular-nums font-medium hidden sm:inline"
          >
            {settings.phone2}
          </a>
          <button
            onClick={() => setDismissed(true)}
            aria-label="அறிவிப்பை மூடு"
            className="p-1 hover:text-white text-slate-400 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
