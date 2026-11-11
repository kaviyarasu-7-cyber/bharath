import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, StoreSettings } from '../types';
import { INITIAL_SETTINGS } from '../data/initialData';
import { api } from '../services/api';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  totalAmount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Modals & Active Views
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  // Admin Auth
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
  isAdminAuthenticated: boolean;
  logoutAdmin: () => void;

  // Toast notification
  toastMessage: string | null;
  showToast: (message: string) => void;

  // Settings
  settings: StoreSettings;
  refreshSettings: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bharath_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bharath_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('bharath_admin_token');
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);

  useEffect(() => {
    localStorage.setItem('bharath_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bharath_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem('bharath_admin_token', adminToken);
    } else {
      localStorage.removeItem('bharath_admin_token');
    }
  }, [adminToken]);

  const refreshSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch {
      // Fallback to initial
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`"${product.name}" கூடையில் சேர்க்கப்பட்டது!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('பொருள் கூடையிலிருந்து நீக்கப்பட்டது');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('விருப்பப்பட்டியலிலிருந்து நீக்கப்பட்டது');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('விருப்பப்பட்டியலில் சேர்க்கப்பட்டது');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const logoutAdmin = () => {
    setAdminToken(null);
    showToast('நிர்வாகி அமர்வு முடிந்தது');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  // Free local delivery
  const totalAmount = subtotal;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        totalAmount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminOpen,
        setIsAdminOpen,
        selectedProduct,
        setSelectedProduct,
        adminToken,
        setAdminToken,
        isAdminAuthenticated: !!adminToken,
        logoutAdmin,
        toastMessage,
        showToast,
        settings,
        refreshSettings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
