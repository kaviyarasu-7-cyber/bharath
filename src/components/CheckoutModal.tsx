import React, { useState } from 'react';
import { X, ShieldCheck, Truck, QrCode, CreditCard, Banknote, AlertCircle } from 'lucide-react';
import { PaymentMethod, Order } from '../types';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

interface CheckoutModalProps {
  onSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onSuccess }) => {
  const {
    cart,
    subtotal,
    totalAmount,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    settings,
    showToast,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [villageOrTown, setVillageOrTown] = useState('வடசித்தூர்');
  const [pincode, setPincode] = useState('641202');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!customerName.trim()) {
      setErrorMsg('தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('சரியான 10 இலக்க கைபேசி எண்ணை உள்ளிடவும்.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('விநியோக முகவரியை உள்ளிடவும்.');
      return;
    }
    if (!villageOrTown.trim()) {
      setErrorMsg('கிராமம் அல்லது நகரத்தின் பெயரை உள்ளிடவும்.');
      return;
    }
    if (!pincode.trim() || pincode.length !== 6) {
      setErrorMsg('சரியான 6 இலக்க அஞ்சல் குறியீட்டை (PIN Code) உள்ளிடவும்.');
      return;
    }

    try {
      setIsSubmitting(true);
      const orderPayload = {
        customer: {
          name: customerName.trim(),
          phone: cleanPhone,
          address: address.trim(),
          villageOrTown: villageOrTown.trim(),
          pincode: pincode.trim(),
          notes: notes.trim(),
        },
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          model: item.product.model,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        subtotal,
        deliveryFee: 0,
        totalAmount,
        paymentMethod,
      };

      const savedOrder = await api.createOrder(orderPayload);
      clearCart();
      setIsCheckoutOpen(false);
      onSuccess(savedOrder);
      showToast('உங்கள் ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது!');
    } catch (err: any) {
      setErrorMsg(err.message || 'ஆர்டர் செய்வதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="bg-white rounded-t-3xl sm:rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-0 sm:my-6 animate-in fade-in slide-in-from-bottom-6 duration-200 max-h-[92vh] sm:max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-10 h-1.5 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold">ஆர்டர் விவரங்கள் மற்றும் முகவரி</h2>
            <p className="text-[11px] sm:text-xs text-slate-300">
              பாரத் எண்டர்பிரைசஸ் · வடசித்தூர் நேரடி ஷோரூம்
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="மூடு"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
              1. வாடிக்கையாளர் விவரங்கள்
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  வாடிக்கையாளர் பெயர் <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="எ.கா: சுந்தர்ராஜ்"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  கைபேசி எண் (WhatsApp தொடர்பு) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="எ.கா: 99426 16243"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                முழு விநியோக முகவரி <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="கதவு எண், வீதி பெயர், அடையாளக் குறிப்பு..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  கிராமம் / நகரம் <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="எ.கா: வடசித்தூர், கிணத்துக்கடவு, பொள்ளாச்சி"
                  value={villageOrTown}
                  onChange={(e) => setVillageOrTown(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  அஞ்சல் குறியீடு (PIN Code) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="641202"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                கூடுதல் குறிப்புகள் (விருப்பத்தேர்வு)
              </label>
              <input
                type="text"
                placeholder="எ.கா: மாலையில் டெலிவரி செய்யவும் அல்லது போன் செய்துவிட்டு வரவும்"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
              2. கட்டண முறை (Payment Method)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: COD */}
              <label
                className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-blue-600 bg-blue-50/80 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 text-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-1 font-bold text-xs text-slate-900">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>நேரில் பணம்</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      பொருளைப் பெற்றவுடன் ரொக்கம் செலுத்துதல் (Cash on Delivery)
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 2: UPI */}
              <label
                className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-blue-600 bg-blue-50/80 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="mt-0.5 text-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-1 font-bold text-xs text-slate-900">
                      <QrCode className="w-4 h-4 text-blue-600" />
                      <span>நேரடி UPI</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Google Pay / PhonePe மூலம் கடைக்கு அனுப்புதல்
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 3: Bajaj EMI */}
              <label
                className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'bajaj_emi'
                    ? 'border-blue-600 bg-blue-50/80 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="bajaj_emi"
                    checked={paymentMethod === 'bajaj_emi'}
                    onChange={() => setPaymentMethod('bajaj_emi')}
                    className="mt-0.5 text-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-1 font-bold text-xs text-slate-900">
                      <CreditCard className="w-4 h-4 text-amber-600" />
                      <span>பஜாஜ் EMI</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      சுலப தவணை முறை (0% வட்டி, ஆவண உதவி)
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* UPI Instruction Box */}
            {paymentMethod === 'upi' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
                <div className="font-semibold">கடையின் UPI விபரம்:</div>
                <div className="text-slate-700">
                  PhonePe / Google Pay எண்:{' '}
                  <strong className="text-blue-900 tabular-nums">{settings.phone1}</strong>
                </div>
                <div className="text-[11px] text-slate-600">
                  ஆர்டர் பதிவு செய்த பின், கடையின் ஊழியர் உங்களை அழைத்து சரிபார்ப்பார்.
                </div>
              </div>
            )}

            {/* Bajaj EMI Instruction Box */}
            {paymentMethod === 'bajaj_emi' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
                <div className="font-semibold">பஜாஜ் பின்சர்வ் EMI வசதி:</div>
                <div className="text-[11px] text-amber-800">
                  ஆர்டர் செய்ததும், எங்கள் கடை நிதி ஆலோசகர் உங்களை அழைத்து சுலப தவணை ஆவணங்களை (ஆதார் & பான்) சரிபார்த்து உடனே அப்ரூவல் செய்வார்.
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>மொத்த பொருட்கள்:</span>
              <span className="font-semibold text-slate-800 tabular-nums">{cart.length} பொருட்கள்</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>விநியோக கட்டணம்:</span>
              <span className="font-semibold text-emerald-700">இலவசம்</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>செலுத்த வேண்டிய மொத்த தொகை:</span>
              <span className="text-lg font-extrabold text-blue-900 tabular-nums">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full min-h-[48px] py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-5 h-5 text-blue-200" />
              <span>{isSubmitting ? 'ஆர்டர் பதிவாகிறது...' : 'ஆர்டரை உறுதிப்படுத்துக'}</span>
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2">
              ஆர்டர் பதிவு செய்ததும் உங்களுக்கு பிரத்தியேக ஆர்டர் எண் உருவாக்கப்படும்.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
