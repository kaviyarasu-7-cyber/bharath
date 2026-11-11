import React from 'react';
import { CheckCircle2, Printer, MessageCircle, ArrowRight, MapPin, Phone } from 'lucide-react';
import { Order } from '../types';
import { useCart } from '../context/CartContext';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
}) => {
  const { settings } = useCart();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const getPaymentMethodTamil = (m: string) => {
    switch (m) {
      case 'cod':
        return 'நேரில் பணம் செலுத்துதல் (Cash on Delivery)';
      case 'upi':
        return 'நேரடி UPI பரிவர்த்தனை (PhonePe / GPay)';
      case 'bajaj_emi':
        return 'பஜாஜ் பின்சர்வ் சுலப தவணை முறை (Bajaj Finserv 0% EMI)';
      default:
        return m;
    }
  };

  const orderWhatsappText = `வணக்கம் பாரத் எண்டர்பிரைசஸ்! நான் ஒரு புதிய ஆர்டர் செய்துள்ளேன்.\n\nஆர்டர் எண்: ${order.id}\nபெயர்: ${order.customer.name}\nகைபேசி: ${order.customer.phone}\nஊர்: ${order.customer.villageOrTown}\nமொத்த தொகை: ₹${order.totalAmount}\nகட்டண முறை: ${getPaymentMethodTamil(order.paymentMethod)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Printable Area */}
        <div id="printable-receipt" className="p-6 sm:p-8 space-y-6">
          {/* Success Banner */}
          <div className="text-center space-y-2 pb-4 border-b border-slate-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              உங்கள் ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது!
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              பாரத் எண்டர்பிரைசஸை தேர்ந்தெடுத்ததற்கு நன்றி. எங்கள் கடை ஊழியர் உங்களை விரைவில் தொலைபேசியில் தொடர்பு கொள்வார்.
            </p>

            <div className="pt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-900">
              <span>ஆர்டர் எண் (Order ID):</span>
              <span className="text-sm font-extrabold text-blue-800 tracking-wider font-mono tabular-nums">
                {order.id}
              </span>
            </div>
          </div>

          {/* Shop & Customer details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">விற்பனையகம்:</div>
              <div className="text-slate-800 font-semibold">{settings.shopName}</div>
              <div className="text-slate-600 mt-1 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="text-slate-600 mt-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="tabular-nums">{settings.phone1} / {settings.phone2}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">விநியோக முகவரி:</div>
              <div className="text-slate-800 font-semibold">{order.customer.name}</div>
              <div className="text-slate-600 mt-0.5">{order.customer.address}</div>
              <div className="text-slate-600">
                {order.customer.villageOrTown} - {order.customer.pincode}
              </div>
              <div className="text-blue-700 font-medium mt-1 tabular-nums">
                கைபேசி: {order.customer.phone}
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              ஆர்டர் செய்யப்பட்ட பொருட்கள்
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">பொருள் விவரம்</th>
                    <th className="p-3 font-semibold text-center">அளவு</th>
                    <th className="p-3 font-semibold text-right">விலை</th>
                    <th className="p-3 font-semibold text-right">மொத்தம்</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">{item.productName}</div>
                        <div className="text-[11px] text-slate-500">மாடல்: {item.model}</div>
                      </td>
                      <td className="p-3 text-center tabular-nums font-semibold">{item.quantity}</td>
                      <td className="p-3 text-right tabular-nums">₹{item.price.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right tabular-nums font-bold text-slate-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200 font-semibold">
                  <tr>
                    <td colSpan={3} className="p-3 text-right text-slate-600">பொருட்கள் மதிப்பு:</td>
                    <td className="p-3 text-right tabular-nums">₹{order.subtotal.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="p-3 text-right text-slate-600">விநியோக கட்டணம்:</td>
                    <td className="p-3 text-right text-emerald-600 font-bold">இலவசம்</td>
                  </tr>
                  <tr className="border-t border-slate-300 bg-blue-50/50">
                    <td colSpan={3} className="p-3 text-right text-sm font-bold text-blue-950">மொத்த கட்டணம்:</td>
                    <td className="p-3 text-right text-base font-extrabold text-blue-900 tabular-nums">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment & Next Steps */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
            <div>
              <strong>தேர்வு செய்யப்பட்ட கட்டண முறை:</strong> {getPaymentMethodTamil(order.paymentMethod)}
            </div>
            <div>
              <strong>ஆர்டர் நிலை:</strong>{' '}
              <span className="font-bold text-blue-700">{order.status}</span>
            </div>
            <div className="text-slate-500 text-[11px] pt-1">
              எங்கள் கடை ஊழியர் உங்கள் ஆர்டரை உறுதி செய்ய மற்றும் விநியோக நேரத்தை தெரிவிக்க உங்களை தொலைபேசியில் அழைப்பார்.
            </div>
          </div>
        </div>

        {/* Action Buttons in Modal footer (hidden on print) */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-2 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>ரசீது அச்சிட (Print)</span>
            </button>

            <a
              href={`https://wa.me/91${settings.whatsappNumber}?text=${encodeURIComponent(orderWhatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp-ல் உறுதி செய்க</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2 px-5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>முடிந்தது</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
