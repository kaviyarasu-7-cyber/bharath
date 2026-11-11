import React from 'react';
import { MapPin, Phone, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  const { settings, setIsAdminOpen } = useCart();

  return (
    <footer id="contact" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                பா
              </div>
              <div>
                <span className="text-lg font-bold text-white block leading-tight">
                  பாரத் எண்டர்பிரைசஸ்
                </span>
                <span className="text-xs text-blue-400 font-medium">
                  Bharath Enterprises
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              வடசித்தூர் மற்றும் சுற்றியுள்ள கிராம மக்களின் நம்பகமான எலக்ட்ரானிக்ஸ் மற்றும் வீட்டு உபயோகப் பொருட்கள் ஷோரூம். தரமான பிராண்டுகள், சிறந்த விலை மற்றும் பஜாஜ் பின்சர்வ் சுலப தவணை முறை.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% அசல் பிராண்ட் உத்தரவாதம்</span>
            </div>
          </div>

          {/* Col 2: Showroom Address & Timings */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
              கடை முகவரி
            </h4>

            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                4/382, கிணத்துக்கடவு – கடம்பாடி மெயின் ரோடு,<br />
                வடசித்தூர் – 641202,<br />
                கோயம்புத்தூர் மாவட்டம், தமிழ்நாடு.
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-400 pt-1">
              <Clock className="w-4 h-4 text-blue-400 shrink-0" />
              <span>காலை 9:00 - இரவு 9:00 (அனைத்து நாட்களும்)</span>
            </div>

            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Vadasithur,Coimbatore,TamilNadu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>கூகுள் வரைபடத்தில் பார்க்க (Google Maps) →</span>
              </a>
            </div>
          </div>

          {/* Col 3: Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
              வாடிக்கையாளர் உதவி
            </h4>

            <p className="text-xs text-slate-400">
              பொருட்களின் இருப்பு, விலை அல்லது விநியோகம் குறித்த விபரங்களுக்கு எங்களை தொடர்பு கொள்ளவும்:
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <a
                href={`tel:${settings.phone1.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-sm tabular-nums">{settings.phone1}</span>
                <span className="text-[11px] text-blue-400">(முதன்மை எண்)</span>
              </a>

              <a
                href={`tel:${settings.phone2.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-sm tabular-nums">{settings.phone2}</span>
              </a>
            </div>
          </div>

          {/* Col 4: Finance & Payment */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
              தவணை & கட்டணம்
            </h4>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <CreditCard className="w-4 h-4" />
                <span>பஜாஜ் பின்சர்வ் EMI</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                0% வட்டி, உடனடி அப்ரூவல். ஆதார் மற்றும் பான் கார்டு கொண்டு வந்து சுலப தவணையில் வாங்கலாம்.
              </p>
            </div>

            <div className="text-xs text-slate-400 space-y-1 pt-1">
              <div>✓ பொருளைப் பெற்றவுடன் ரொக்கம் (COD)</div>
              <div>✓ நேரடி UPI (PhonePe / GPay)</div>
              <div>✓ வடசித்தூர் பகுதியில் இலவச விநியோகம்</div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                நிர்வாகி உள்நுழைவு (Admin Portal)
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright only */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2026 பாரத் எண்டர்பிரைசஸ் (Bharath Enterprises). அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigateSection('hero')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              மேலே செல்ல
            </button>
            <span>·</span>
            <span>வடசித்தூர், கோயம்புத்தூர்</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
