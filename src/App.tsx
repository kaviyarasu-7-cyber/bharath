import React, { useState, useEffect, useCallback } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { TopAnnouncement } from './components/TopAnnouncement';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryNav } from './components/CategoryNav';
import { AdOffersSection } from './components/AdOffersSection';
import { ProductGrid } from './components/ProductGrid';
import { BajajEmiSection } from './components/BajajEmiSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminDashboard } from './components/AdminDashboard';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { Product, Category, Order } from './types';
import { api } from './services/api';

const MainShop: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    setIsCartOpen,
    setIsCheckoutOpen,
    isAdminOpen,
    setIsAdminOpen,
    addToCart,
    toastMessage,
  } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');

  const loadData = useCallback(async () => {
    try {
      const [prods, cats] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Error fetching data from API, using fallback data', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product, 1);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setSuccessOrder(order);
  };

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      p.categoryId === selectedCategory ||
      p.categoryName === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white pb-20 md:pb-0">
      {/* Showroom Top Announcement */}
      <TopAnnouncement />

      {/* Header with Top Bar Contract */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigateSection={handleNavigateSection}
      />

      {/* Hero Banner */}
      <div id="hero">
        <HeroBanner
          onExploreOffers={() => handleNavigateSection('ad-offers')}
          onExploreEmi={() => handleNavigateSection('bajaj-emi')}
        />
      </div>

      {/* Category Navigation */}
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(id) => {
          setSelectedCategory(id);
          handleNavigateSection('products');
        }}
      />

      {/* Ad Offers Section (32" and 24" LED TVs visible in shop's ad) */}
      <AdOffersSection
        products={products}
        onOpenProduct={(p) => setSelectedProduct(p)}
        onBuyNow={handleBuyNow}
      />

      {/* Product Catalog Grid */}
      <ProductGrid
        products={filteredProducts}
        selectedCategoryName={selectedCategoryObj?.name || 'அனைத்துப் பொருட்கள்'}
        searchQuery={searchQuery}
        onClearFilters={() => {
          setSelectedCategory('all');
          setSearchQuery('');
        }}
        onOpenDetail={(p) => setSelectedProduct(p)}
        onBuyNow={handleBuyNow}
      />

      {/* Bajaj Finserv EMI Dedicated Feature & Calculator */}
      <BajajEmiSection />

      {/* Footer */}
      <Footer onNavigateSection={handleNavigateSection} />

      {/* WhatsApp Floating Button */}
      <WhatsAppFloatingButton />

      {/* Mobile Bottom Navigation Bar (5 touch tabs) */}
      <MobileBottomNav
        activeSection={activeSection}
        onNavigateSection={handleNavigateSection}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={handleBuyNow}
      />

      <CartDrawer />

      <CheckoutModal onSuccess={handleOrderSuccess} />

      <OrderSuccessModal
        order={successOrder}
        onClose={() => setSuccessOrder(null)}
      />

      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
          onRefreshData={loadData}
          categories={categories}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <MainShop />
    </CartProvider>
  );
}
