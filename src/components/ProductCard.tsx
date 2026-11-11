import React from 'react';
import { ShoppingBag, Heart, Check, CreditCard } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onBuyNow,
}) => {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const inWishlist = isInWishlist(product.id);
  const savings = product.originalPrice - product.price;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Image Container */}
        <div className="relative aspect-4/3 bg-slate-50 overflow-hidden cursor-pointer" onClick={() => onOpenDetail(product)}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label={inWishlist ? 'விருப்பப்பட்டியலில் இருந்து நீக்கு' : 'விருப்பப்பட்டியலில் சேர்'}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-slate-500 hover:text-rose-600 shadow-xs transition-colors cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>

          {/* Discount badge if significant */}
          {product.discountPercentage > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-blue-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-sm tabular-nums shadow-xs">
              {product.discountPercentage}% தள்ளுபடி
            </span>
          )}

          {/* Quick view text overlay */}
          <div className="absolute inset-x-0 bottom-0 py-1.5 bg-gradient-to-t from-slate-900/60 to-transparent text-white text-[11px] text-center font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            முழு விவரங்களை பார்க்க கிளிக் செய்க
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 space-y-2">
          {/* Unboxed Metadata */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="font-semibold text-blue-700 truncate">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.categoryName}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onOpenDetail(product)}
            className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer leading-snug min-h-[2.5rem]"
          >
            {product.name}
          </h3>

          {/* Price Block */}
          <div className="pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-950 tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-emerald-700 font-medium mt-0.5">
              <span>சேமிப்பு: ₹{savings.toLocaleString('en-IN')}</span>
              {product.inStock ? (
                <span className="flex items-center gap-0.5 text-emerald-700">
                  <Check className="w-3 h-3" /> கையிருப்பு உள்ளது
                </span>
              ) : (
                <span className="text-rose-600 font-semibold">தற்போது இல்லை</span>
              )}
            </div>
          </div>

          {/* Bajaj Finserv EMI clue */}
          {product.emiAvailable && product.monthlyEmiStarting && (
            <div className="pt-1 flex items-center gap-1 text-[11px] text-blue-800 font-medium">
              <CreditCard className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>EMI: ₹{product.monthlyEmiStarting}/மாதம்</span>
            </div>
          )}
        </div>
      </div>

      {/* Button Actions */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
          className="w-full min-h-[44px] py-2 px-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span className="truncate">கூடையில் சேர்</span>
        </button>

        <button
          onClick={() => onBuyNow(product)}
          disabled={!product.inStock}
          className="w-full min-h-[44px] py-2 px-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="truncate">உடனே வாங்க</span>
        </button>
      </div>
    </div>
  );
};
