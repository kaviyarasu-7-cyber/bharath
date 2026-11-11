import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Heart, Check, Phone, MessageCircle, Star, AlertCircle, ShieldCheck } from 'lucide-react';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow,
}) => {
  const { addToCart, isInWishlist, toggleWishlist, settings, showToast } = useCart();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      api.getReviews(product.id).then(setReviews).catch(() => setReviews([]));
    }
  }, [product]);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const savings = product.originalPrice - product.price;

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast('பெயர் மற்றும் கருத்து தேவை');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const newRev = await api.addReview({
        productId: product.id,
        customerName: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviews([newRev, ...reviews]);
      setReviewName('');
      setReviewComment('');
      showToast('உங்கள் மதிப்பாய்வு வெற்றிகரமாக சேர்க்கப்பட்டது!');
    } catch {
      showToast('மதிப்பாய்வு சேர்ப்பதில் பிழை ஏற்பட்டது');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const whatsappMessage = `வணக்கம் பாரத் எண்டர்பிரைசஸ், ${product.name} (மாடல்: ${product.model}, விலை: ₹${product.price}) பற்றி விசாரிக்க விரும்புகிறேன். கடையில் நேரில் வந்து பார்க்கலாமா?`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div
        className="bg-white rounded-t-3xl sm:rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-0 sm:my-8 animate-in fade-in slide-in-from-bottom-6 duration-200 max-h-[92vh] sm:max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-10 h-1.5 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 hover:text-slate-800 bg-white/90 rounded-full shadow-xs transition-colors cursor-pointer"
          aria-label="மூடு"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto flex-1">
          {/* Left Column: Image & Gallery */}
          <div className="p-6 sm:p-8 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div>
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-2xs">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {product.discountPercentage > 0 && (
                  <span className="absolute top-3 left-3 bg-blue-700 text-white text-xs font-bold px-2.5 py-1 rounded-sm tabular-nums">
                    {product.discountPercentage}% தள்ளுபடி
                  </span>
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-6 space-y-2 text-xs text-slate-600 bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-slate-800">100% அசல் பிராண்ட் & நேரடி கடையின் உத்திரவாதம்</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>வடசித்தூர் & கிணத்துக்கடவு சுற்றியுள்ள பகுதிகளுக்கு இலவச நேரடி விநியோகம்</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>கடைக்கு நேரில் வந்தும் சாதனங்களை பார்வையிட்டு வாங்கலாம்</span>
                </div>
              </div>
            </div>

            {/* Quick Contact & WhatsApp */}
            <div className="pt-6 mt-6 border-t border-slate-200 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/91${settings.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>வாட்ஸ்அப் உதவி</span>
              </a>

              <a
                href={`tel:${settings.phone1.replace(/\s+/g, '')}`}
                className="flex-1 min-w-[140px] py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="tabular-nums">நேரடி அழைப்பு</span>
              </a>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category & Brand Metadata */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-700 uppercase tracking-wide">{product.brand}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.categoryName}</span>
                </div>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="flex items-center gap-1 text-slate-500 hover:text-rose-600 cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span className="text-[11px]">{inWishlist ? 'விருப்பத்தில் உள்ளது' : 'விருப்பத்தில் சேர்'}</span>
                </button>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h2>

              <div className="text-xs text-slate-500">
                மாடல் எண்: <span className="font-semibold text-slate-700">{product.model}</span>
              </div>

              {/* Ad notice disclaimer if applicable */}
              {product.isAdOffer && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">விளம்பரச் சலுகை:</strong> {product.adOfferNotice}
                  </div>
                </div>
              )}

              {/* Price Block */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-slate-950 tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through tabular-nums">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
                    {savings > 0 && `ரூ. ${savings.toLocaleString('en-IN')} சேமிப்பு`}
                  </span>
                </div>

                {/* Stock status */}
                <div className="mt-2 text-xs flex items-center justify-between">
                  <span className="text-slate-600">
                    கையிருப்பு நிலை:
                  </span>
                  {product.inStock ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> கையிருப்பில் உள்ளது ({product.stock} எண்கள்)
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold">கையிருப்பு தீர்ந்துவிட்டது</span>
                  )}
                </div>

                {/* Bajaj Finserv EMI */}
                {product.emiAvailable && product.monthlyEmiStarting && (
                  <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-blue-900">
                    <div className="font-semibold text-blue-950">
                      பஜாஜ் பின்சர்வ் சுலப தவணை: மாதம் ₹{product.monthlyEmiStarting} முதல்
                    </div>
                    <div className="text-[11px] text-blue-700 mt-0.5">
                      0% வட்டி · சுலபமான ஆவணங்கள் · கடையில் உடனடி ஒப்புதல்
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {product.description}
              </div>

              {/* Technical Specifications */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  முக்கிய விவரக்குறிப்புகள்
                </h4>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">{spec.label}</span>
                      <span className="font-semibold text-slate-800 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-semibold text-slate-700">தேவையான அளவு:</span>
                <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-bold tabular-nums text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Customer Reviews & Form */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  வாடிக்கையாளர் கருத்துக்கள் ({reviews.length})
                </h4>

                {reviews.length > 0 ? (
                  <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-1">
                    {reviews.map((r) => (
                      <div key={r.id} className="p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{r.customerName}</span>
                          <div className="flex items-center text-amber-500">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 mt-1">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mb-3">முதல் மதிப்பாய்வை நீங்கள் பதிவு செய்யுங்கள்.</p>
                )}

                {/* Add Review Form */}
                <form onSubmit={handleAddReview} className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-xs font-semibold text-slate-700">மதிப்பாய்வு எழுதுக:</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="உங்கள் பெயர்"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-1/2 p-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-1/2 p-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5/5 மிக நன்று)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5 நன்று)</option>
                      <option value="3">⭐⭐⭐ (3/5 சராசரி)</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="பொருளைப் பற்றிய உங்கள் கருத்து..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full py-1.5 text-xs font-semibold text-blue-700 bg-white border border-blue-300 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                  >
                    {isSubmittingReview ? 'பதிவாகிறது...' : 'கருத்தை பதிவிடுக'}
                  </button>
                </form>
              </div>
            </div>

            {/* Sticky Action Buttons */}
            <div className="pt-4 mt-6 border-t border-slate-200 grid grid-cols-2 gap-3 sticky bottom-0 bg-white z-10 pb-2">
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  onClose();
                }}
                disabled={!product.inStock}
                className="min-h-[48px] py-3 px-4 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4 text-blue-600 shrink-0" />
                <span>கூடையில் சேர்</span>
              </button>

              <button
                onClick={() => {
                  onBuyNow(product);
                  onClose();
                }}
                disabled={!product.inStock}
                className="min-h-[48px] py-3 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-colors flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-50"
              >
                இப்போதே வாங்க
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
