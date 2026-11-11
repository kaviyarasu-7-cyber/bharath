import React, { useState } from 'react';
import { CreditCard, CheckCircle2, FileText, Clock, Percent, Calculator, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const BajajEmiSection: React.FC = () => {
  const { settings } = useCart();
  const [purchaseAmount, setPurchaseAmount] = useState(25000);
  const [tenure, setTenure] = useState(6); // months

  // 0% interest scheme calculation
  const monthlyEmi = Math.round(purchaseAmount / tenure);

  return (
    <section id="bajaj-emi" className="py-16 bg-gradient-to-b from-white to-blue-50/50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <CreditCard className="w-3.5 h-3.5 text-blue-700" />
            <span>பஜாஜ் பின்சர்வ் சுலப தவணை முறை வசதி</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            0% வட்டியில் உங்கள் விருப்பமான வீட்டு உபயோகப் பொருட்கள்!
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            பாரத் எண்டர்பிரைசஸ் வடசித்தூர் ஷோரூமில் உடனடி பஜாஜ் பின்சர்வ் இ.எம்.ஐ வசதி உள்ளது. எளிய தவணைகளில் எலக்ட்ரானிக்ஸ் பொருட்களை உடனே வீட்டிற்கு கொண்டு செல்லுங்கள்.
          </p>
        </div>

        {/* 2-Column: Features on Left, Interactive Calculator on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Features Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Percent className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">0% வட்டி வீதம்</h3>
                <p className="text-xs text-slate-600">
                  கூடுதல் வட்டி எதுவும் இன்றி, பொருளின் அசல் விலையை மட்டுமே சம தவணைகளில் செலுத்துங்கள்.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">உடனடி ஒப்புதல்</h3>
                <p className="text-xs text-slate-600">
                  வெறும் 10 நிமிடங்களில் ஆவணங்களை சரிபார்த்து உடனடி இ.எம்.ஐ ஒப்புதல் வழங்கப்படுகிறது.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">குறைந்தபட்ச ஆவணங்கள்</h3>
                <p className="text-xs text-slate-600">
                  ஆதார் கார்டு, பான் கார்டு மற்றும் வங்கி கணக்கு புத்தகம் மட்டுமே போதுமானது.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">அனைத்து முன்னணி பொருட்களுக்கும்</h3>
                <p className="text-xs text-slate-600">
                  டிவி, பிரிட்ஜ், வாஷிங் மெஷின், கிரைண்டர் போன்ற அனைத்து சாதனங்களுக்கும் தவணை வசதி உண்டு.
                </p>
              </div>
            </div>

            {/* Document Checklist */}
            <div className="p-4 bg-blue-900 text-white rounded-xl space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                தேவையான ஆவணங்கள் (கடைக்கு கொண்டு வர வேண்டியவை):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-200">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ஆதார் அட்டை (Aadhaar)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>பான் கார்டு (PAN Card)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>வங்கி பாஸ்புக் / செக்</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Column */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-blue-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">EMI கணக்கீடு (Calculator)</h3>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                0% வட்டி திட்டம்
              </span>
            </div>

            {/* Amount Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>பொருளின் தோராய மதிப்பு:</span>
                <span className="text-base font-extrabold text-blue-950 tabular-nums">
                  ₹{purchaseAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={100000}
                step={1000}
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 tabular-nums">
                <span>₹5,000</span>
                <span>₹50,000</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            {/* Tenure Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                தவணை காலம் (மாதங்கள்):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 6, 9, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => setTenure(m)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      tenure === m
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m} மாதங்கள்
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Installment Highlight */}
            <div className="p-4 bg-slate-900 text-white rounded-xl text-center space-y-1">
              <span className="text-xs text-blue-300 font-medium">தோராய மாதாந்திர தவணை:</span>
              <div className="text-3xl font-extrabold text-amber-400 tabular-nums">
                ₹{monthlyEmi.toLocaleString('en-IN')} <span className="text-xs text-slate-300 font-normal">/ மாதம்</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                (மொத்த தவணைகள்: {tenure} மாதங்கள் · முன்பணம் ₹0)
              </div>
            </div>

            {/* Direct enquiry button */}
            <a
              href={`https://wa.me/91${settings.whatsappNumber}?text=${encodeURIComponent(
                `வணக்கம் பாரத் எண்டர்பிரைசஸ், ₹${purchaseAmount} மதிப்புள்ள பொருளுக்கு ${tenure} மாத பஜாஜ் EMI வசதி பற்றி அறிய விரும்புகிறேன்.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>EMI தகுதி அறிய WhatsApp-ல் கேட்க</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
