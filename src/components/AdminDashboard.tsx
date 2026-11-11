import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  Package,
  ShoppingCart,
  Layers,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Eye,
  LogOut,
  Upload,
  Clock,
} from 'lucide-react';
import { Product, Order, OrderStatus, Category, StoreSettings } from '../types';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

const ORDER_STATUS_LIST: OrderStatus[] = [
  'புதிய ஆர்டர்',
  'உறுதிப்படுத்தப்பட்டது',
  'தயாராகிறது',
  'அனுப்பப்பட்டது',
  'வழங்கப்பட்டது',
  'ரத்து செய்யப்பட்டது',
];

interface AdminDashboardProps {
  onClose: () => void;
  onRefreshData: () => Promise<void>;
  categories: Category[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onRefreshData,
  categories,
}) => {
  const {
    adminToken,
    setAdminToken,
    isAdminAuthenticated,
    logoutAdmin,
    settings,
    refreshSettings,
    showToast,
  } = useCart();

  // Auth State
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setLoginError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  // Swipe down and up gestures for admin login bottom sheet
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);
  const currentDragY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY > 0) {
      // Swiping downwards
      currentDragY.current = deltaY;
      setDragY(deltaY);
    } else {
      // Swiping upwards (snap back)
      const newY = Math.max(0, currentDragY.current + deltaY);
      setDragY(newY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (currentDragY.current > 90) {
      // Swiped down past threshold: slide out and close
      setDragY(450);
      setTimeout(() => {
        onClose();
        setDragY(0);
        currentDragY.current = 0;
      }, 200);
    } else {
      // Snap back up
      setDragY(0);
      currentDragY.current = 0;
    }
  };

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'settings'>('overview');

  // Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Product Editing / Adding State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Delete Product Confirmation State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'success' | 'failure'>('idle');

  // New Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);

  // Selected Order for detail view
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchAdminData = async () => {
    if (!adminToken) return;
    try {
      setIsLoadingData(true);
      const [allOrders, allProducts] = await Promise.all([
        api.getOrders(adminToken),
        api.getProducts(),
      ]);
      setOrders(allOrders);
      setProducts(allProducts);
      setSettingsForm(settings);
    } catch {
      showToast('நிர்வாக தரவுகளைப் பெற முடியவில்லை');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAdminData();
    }
  }, [isAdminAuthenticated]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await api.adminLogin(username.trim(), password);
      if (res.token) {
        setAdminToken(res.token);
        setLockoutRemaining(0);
        showToast('நிர்வாகி வெற்றிகரமாக உள்நுழைந்தார்!');
      }
    } catch (err: any) {
      setLoginError(err.message || 'தவறான பயனர் பெயர் அல்லது கடவுச்சொல்');
      if (err.remainingSeconds) {
        setLockoutRemaining(Number(err.remainingSeconds));
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!adminToken) return;
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, undefined, undefined, adminToken);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
      showToast(`ஆர்டர் நிலை "${newStatus}" என மாற்றப்பட்டது!`);
    } catch {
      showToast('ஆர்டர் நிலையை மாற்றுவதில் பிழை');
    }
  };

  // Trigger Delete Confirmation Modal
  const promptDeleteProduct = (product: Product) => {
    setProductToDelete(product);
  };

  // Confirm and Execute Product Deletion
  const confirmDeleteProduct = async () => {
    if (!adminToken || !productToDelete) return;
    try {
      setIsDeleting(true);
      await api.deleteProduct(productToDelete.id, adminToken);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      if (editingProduct?.id === productToDelete.id) {
        setIsProductModalOpen(false);
        setEditingProduct(null);
      }
      setProductToDelete(null);
      await onRefreshData();
      setDeleteStatus('success');
      showToast('பொருள் வெற்றிகரமாக நீக்கப்பட்டது!');
    } catch {
      setDeleteStatus('failure');
      showToast('பொருளை நீக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Save Product (Create or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !editingProduct) return;

    try {
      const payload = {
        ...editingProduct,
        price: Number(editingProduct.price) || 0,
        originalPrice: Number(editingProduct.originalPrice) || Number(editingProduct.price) || 0,
        stock: Number(editingProduct.stock) || 0,
        discountPercentage:
          editingProduct.originalPrice && editingProduct.price
            ? Math.round(((editingProduct.originalPrice - editingProduct.price) / editingProduct.originalPrice) * 100)
            : 0,
        specs: editingProduct.specs || [],
      };

      if (editingProduct.id) {
        // Update
        const updated = await api.updateProduct(editingProduct.id, payload, adminToken);
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)));
        showToast('பொருள் வெற்றிகரமாக திருத்தப்பட்டது');
      } else {
        // Create
        const created = await api.createProduct(payload, adminToken);
        setProducts([created, ...products]);
        showToast('புதிய பொருள் வெற்றிகரமாக சேர்க்கப்பட்டது');
      }

      setIsProductModalOpen(false);
      setEditingProduct(null);
      await onRefreshData();
    } catch {
      showToast('பொருளை சேமிக்க முடியவில்லை');
    }
  };

  // Handle Image Upload File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingProduct) {
          setEditingProduct({
            ...editingProduct,
            image: reader.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !newCatName.trim()) return;

    try {
      await api.createCategory({ name: newCatName.trim(), description: newCatDesc.trim() }, adminToken);
      setNewCatName('');
      setNewCatDesc('');
      await onRefreshData();
      showToast('புதிய பிரிவு சேர்க்கப்பட்டது');
    } catch {
      showToast('பிரிவை சேர்க்க முடியவில்லை');
    }
  };

  // Handle Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    try {
      await api.updateSettings(settingsForm, adminToken);
      await refreshSettings();
      showToast('கடை அமைப்புகள் சேமிக்கப்பட்டன');
    } catch {
      showToast('அமைப்புகளை சேமிக்க முடியவில்லை');
    }
  };

  // Calculations for overview
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'ரத்து செய்யப்பட்டது' ? sum + o.totalAmount : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === 'புதிய ஆர்டர்' || o.status === 'உறுதிப்படுத்தப்பட்டது').length;

  // If not authenticated, render swipe-down / swipe-up admin login bottom sheet
  if (!isAdminAuthenticated) {
    return (
      <div
        className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full max-h-[92vh] sm:max-h-[85vh] overflow-hidden shadow-2xl border-t sm:border border-slate-200 flex flex-col will-change-transform animate-in slide-in-from-bottom duration-250"
          style={{
            transform: `translateY(${dragY}px)`,
            transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Swipe Handle Bar for Up & Down Gestures */}
          <div
            className="w-full flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none select-none border-b border-slate-100 bg-slate-50 transition-colors hover:bg-slate-100"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mb-1 hover:bg-slate-400 transition-colors" />
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <span className="text-blue-600 font-bold">↕</span>
              <span className="sm:hidden">கீழே இழுத்து மூடலாம் / மேலே இழுக்கலாம்</span>
              <span className="hidden sm:inline">நிர்வாகி உள்நுழைவு (Admin Login)</span>
            </div>
          </div>

          {/* Top Header */}
          <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">கடை நிர்வாகி உள்நுழைவு</h3>
                <p className="text-[11px] text-slate-400">Bharath Enterprises Admin Panel</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="மூடு"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Login Form Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
            <div className="text-center space-y-1">
              <p className="text-xs text-slate-500">
                பொருட்கள், விலைகள் மற்றும் ஆர்டர்களை நிர்வகிக்க உங்கள் சான்றுகளை உள்ளிடவும்.
              </p>
            </div>

            {lockoutRemaining > 0 ? (
              <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-900 text-xs rounded-xl flex items-start gap-2.5 animate-pulse">
                <Clock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-800">
                    பாதுகாப்பு தடை அமலில் உள்ளது (1 நிமிடம்)
                  </div>
                  <div className="mt-0.5 text-rose-700">
                    கடவுச்சொல் 3 முறை தவறாக உள்ளிடப்பட்டது. மீண்டும் முயற்சிக்க இன்னும்{' '}
                    <strong className="text-rose-950 font-mono text-sm tabular-nums">
                      {lockoutRemaining}
                    </strong>{' '}
                    வினாடிகள் காத்திருக்கவும்.
                  </div>
                </div>
              </div>
            ) : (
              loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  பயனர் பெயர் (Username)
                </label>
                <input
                  type="text"
                  required
                  disabled={lockoutRemaining > 0}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2.5 text-base sm:text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  கடவுச்சொல் (Password)
                </label>
                <input
                  type="password"
                  required
                  disabled={lockoutRemaining > 0}
                  placeholder="கடவுச்சொல்..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 text-base sm:text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-900 space-y-1">
                <div className="text-[10px] text-blue-700">
                  * பாதுகாப்பு கட்டுப்பாடு: கடவுச்சொல் 3 முறை தவறாக உள்ளிடப்பட்டால் கணக்கு 1 நிமிடம் தற்காலிகமாக முடக்கப்படும்.
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn || lockoutRemaining > 0}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-xs rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                {lockoutRemaining > 0
                  ? `காத்திருக்கவும் (${lockoutRemaining} வினாடிகள்)`
                  : isLoggingIn
                  ? 'சரிபார்க்கப்படுகிறது...'
                  : 'உள்நுழைக'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div
        className="bg-white rounded-2xl max-w-6xl w-full h-[90vh] shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                பாரத் எண்டர்பிரைசஸ் · நிர்வாகி கட்டுப்பாட்டு அறை
              </h2>
              <span className="text-xs text-slate-400">
                Showroom Administration & Inventory Management
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 rounded-lg transition-colors cursor-pointer min-h-[44px]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>வெளியேறு</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="மூடு"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATED DASHBOARD */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-56 bg-white border-r border-slate-200 p-3 space-y-1 shrink-0 overflow-x-auto md:overflow-visible flex md:flex-col">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-left ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="whitespace-nowrap">கண்ணோட்டம் & விற்பனை</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-left ${
                  activeTab === 'orders'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="whitespace-nowrap">ஆர்டர்கள்</span>
                </div>
                {pendingOrders > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${
                      activeTab === 'orders' ? 'bg-white text-blue-900' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {pendingOrders}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-left ${
                  activeTab === 'products'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span className="whitespace-nowrap">பொருட்கள் மேலாண்மை</span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-left ${
                  activeTab === 'categories'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="whitespace-nowrap">பிரிவுகள்</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-left ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
                <span className="whitespace-nowrap">கடை அமைப்புகள்</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              {isLoadingData ? (
                <div className="py-20 text-center text-xs text-slate-500">விவரங்கள் ஏற்றப்படுகின்றன...</div>
              ) : (
                <>
                  {/* TAB 1: OVERVIEW */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* KPI cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                          <span className="text-xs text-slate-500 font-medium">மொத்த விற்பனை மதிப்பு</span>
                          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                            ₹{totalRevenue.toLocaleString('en-IN')}
                          </div>
                          <span className="text-[11px] text-emerald-600 font-medium">அனைத்து ஆர்டர்கள்</span>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                          <span className="text-xs text-slate-500 font-medium">மொத்த ஆர்டர்கள்</span>
                          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                            {orders.length}
                          </div>
                          <span className="text-[11px] text-blue-600 font-medium">பதிவானவை</span>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                          <span className="text-xs text-slate-500 font-medium">நிலுவை ஆர்டர்கள்</span>
                          <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
                            {pendingOrders}
                          </div>
                          <span className="text-[11px] text-amber-700 font-medium">கவனிக்க வேண்டியவை</span>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                          <span className="text-xs text-slate-500 font-medium">மொத்த சாதன வகைகள்</span>
                          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                            {products.length}
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">கையிருப்பில் உள்ளவை</span>
                        </div>
                      </div>

                      {/* Recent Orders Preview */}
                      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-900">சமீபத்திய ஆர்டர்கள்</h3>
                          <button
                            onClick={() => setActiveTab('orders')}
                            className="text-xs text-blue-600 font-semibold hover:underline"
                          >
                            அனைத்தையும் பார்க்க ({orders.length})
                          </button>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                              <tr>
                                <th className="p-3">ஆர்டர் எண்</th>
                                <th className="p-3">வாடிக்கையாளர்</th>
                                <th className="p-3">ஊர்</th>
                                <th className="p-3">தொகை</th>
                                <th className="p-3">கட்டண முறை</th>
                                <th className="p-3">தற்போதைய நிலை</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {orders.slice(0, 5).map((o) => (
                                <tr key={o.id} className="hover:bg-slate-50">
                                  <td className="p-3 font-mono font-bold text-blue-900">{o.id}</td>
                                  <td className="p-3 font-medium text-slate-900">{o.customer.name}</td>
                                  <td className="p-3 text-slate-600">{o.customer.villageOrTown}</td>
                                  <td className="p-3 font-bold tabular-nums">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                                  <td className="p-3 uppercase text-slate-500">{o.paymentMethod}</td>
                                  <td className="p-3">
                                    <span className="px-2 py-0.5 rounded-sm text-[11px] font-semibold bg-blue-50 text-blue-800">
                                      {o.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: ORDERS MANAGEMENT */}
                  {activeTab === 'orders' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">
                          அனைத்து வாடிக்கையாளர் ஆர்டர்கள் ({orders.length})
                        </h3>
                        <span className="text-xs text-slate-500">
                          ஆர்டர் நிலையை மாற்ற கீழ்தோன்றும் பட்டியலை பயன்படுத்தவும்
                        </span>
                      </div>

                      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                              <tr>
                                <th className="p-3">ஆர்டர் எண்</th>
                                <th className="p-3">தேதி</th>
                                <th className="p-3">வாடிக்கையாளர் & கைபேசி</th>
                                <th className="p-3">முகவரி</th>
                                <th className="p-3">பொருட்கள்</th>
                                <th className="p-3">மொத்த தொகை</th>
                                <th className="p-3">கட்டண முறை</th>
                                <th className="p-3">நிலை மாற்றம்</th>
                                <th className="p-3 text-center">விபரம்</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {orders.map((o) => (
                                <tr key={o.id} className="hover:bg-slate-50">
                                  <td className="p-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                                    {o.id}
                                  </td>
                                  <td className="p-3 text-slate-500 whitespace-nowrap">
                                    {new Date(o.createdAt).toLocaleDateString('ta-IN')}
                                  </td>
                                  <td className="p-3">
                                    <div className="font-semibold text-slate-900">{o.customer.name}</div>
                                    <div className="text-blue-700 tabular-nums">{o.customer.phone}</div>
                                  </td>
                                  <td className="p-3 max-w-xs truncate text-slate-600">
                                    {o.customer.address}, {o.customer.villageOrTown} - {o.customer.pincode}
                                  </td>
                                  <td className="p-3 text-slate-800">
                                    {o.items.map((it) => `${it.productName} (x${it.quantity})`).join(', ')}
                                  </td>
                                  <td className="p-3 font-extrabold text-blue-950 tabular-nums whitespace-nowrap">
                                    ₹{o.totalAmount.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 uppercase text-slate-600 text-[11px]">
                                    {o.paymentMethod === 'cod' ? 'நேரில் ரொக்கம்' : o.paymentMethod === 'upi' ? 'UPI' : 'Bajaj EMI'}
                                  </td>
                                  <td className="p-3">
                                    <select
                                      value={o.status}
                                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                                      className="p-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                                    >
                                      {ORDER_STATUS_LIST.map((st) => (
                                        <option key={st} value={st}>
                                          {st}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="p-3 text-center">
                                    <button
                                      onClick={() => setSelectedOrder(o)}
                                      className="p-1 text-slate-500 hover:text-blue-600 rounded transition-colors cursor-pointer"
                                      title="முழு விவரம்"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PRODUCTS MANAGEMENT */}
                  {activeTab === 'products' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            பொருட்கள் மற்றும் விலைப்பட்டியல் ({products.length})
                          </h3>
                          <span className="text-xs text-slate-500">
                            விலை, தள்ளுபடி, மற்றும் கையிருப்புகளை எளிதாக மாற்றலாம்.
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setEditingProduct({
                              name: '',
                              brand: 'Bharath Select',
                              model: '',
                              categoryId: categories[0]?.id || 'cat-1',
                              categoryName: categories[0]?.name || 'LED தொலைக்காட்சிகள்',
                              price: 9999,
                              originalPrice: 14999,
                              stock: 5,
                              image: '/src/assets/images/promo_tv_festival_display_1794210842998.jpg',
                              description: '',
                              specs: [{ label: 'உத்தரவாதம்', value: '1 வருடம்' }],
                              isAdOffer: false,
                              emiAvailable: true,
                              monthlyEmiStarting: 999,
                            });
                            setIsProductModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>புதிய பொருள் சேர்க்க</span>
                        </button>
                      </div>

                      {/* Mobile Cards (Visible on screens < md) */}
                      <div className="grid grid-cols-1 gap-3 md:hidden">
                        {products.map((p) => (
                          <div key={p.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                            <div className="flex items-start gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-16 h-16 rounded-lg object-cover border border-slate-200 bg-white shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-xs text-slate-900 leading-tight line-clamp-2">{p.name}</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">{p.brand} · மாடல்: {p.model}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="font-extrabold text-blue-900 text-sm tabular-nums">
                                    ₹{p.price.toLocaleString('en-IN')}
                                  </span>
                                  {p.originalPrice > p.price && (
                                    <span className="text-[11px] text-slate-400 line-through tabular-nums">
                                      ₹{p.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span
                                    className={`px-1.5 py-0.5 rounded-sm text-[10px] font-semibold tabular-nums ${
                                      p.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                    }`}
                                  >
                                    கையிருப்பு: {p.stock}
                                  </span>
                                  {p.isAdOffer && (
                                    <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded-sm text-[10px]">
                                      விளம்பர விலை
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setIsProductModalOpen(true);
                                }}
                                className="w-full py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
                              >
                                <Edit2 className="w-4 h-4" />
                                <span>திருத்து</span>
                              </button>
                              <button
                                onClick={() => promptDeleteProduct(p)}
                                className="w-full py-2 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>நீக்கு</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Table (Hidden on screens < md) */}
                      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                              <tr>
                                <th className="p-3">படம்</th>
                                <th className="p-3">பொருள் பெயர் & பிராண்ட்</th>
                                <th className="p-3">பிரிவு</th>
                                <th className="p-3">விற்பனை விலை</th>
                                <th className="p-3">அசல் விலை (MRP)</th>
                                <th className="p-3">கையிருப்பு</th>
                                <th className="p-3">விளம்பரச் சலுகை?</th>
                                <th className="p-3 text-right">நடவடிக்கைகள்</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {products.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50">
                                  <td className="p-3">
                                    <img
                                      src={p.image}
                                      alt={p.name}
                                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-white"
                                      referrerPolicy="no-referrer"
                                    />
                                  </td>
                                  <td className="p-3 max-w-xs">
                                    <div className="font-bold text-slate-900">{p.name}</div>
                                    <div className="text-[11px] text-slate-500">
                                      {p.brand} · மாடல்: {p.model}
                                    </div>
                                  </td>
                                  <td className="p-3 text-slate-700">{p.categoryName}</td>
                                  <td className="p-3 font-bold text-blue-900 tabular-nums">
                                    ₹{p.price.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3 text-slate-400 line-through tabular-nums">
                                    ₹{p.originalPrice.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3">
                                    <span
                                      className={`px-2 py-0.5 rounded-sm text-[11px] font-semibold tabular-nums ${
                                        p.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                      }`}
                                    >
                                      {p.stock} எண்கள்
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    {p.isAdOffer ? (
                                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-sm text-[11px]">
                                        விளம்பர விலை (₹{p.price})
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 text-[11px]">சாதாரண விலை</span>
                                    )}
                                  </td>
                                  <td className="p-3 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => {
                                          setEditingProduct(p);
                                          setIsProductModalOpen(true);
                                        }}
                                        className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 min-h-[36px]"
                                        title="பொருளைத் திருத்த"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        <span>திருத்து</span>
                                      </button>
                                      <button
                                        onClick={() => promptDeleteProduct(p)}
                                        className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 min-h-[36px]"
                                        title="பொருளை நீக்க"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>நீக்கு</span>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: CATEGORIES MANAGEMENT */}
                  {activeTab === 'categories' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Existing Categories */}
                      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                        <h3 className="text-sm font-bold text-slate-900">
                          தற்போதைய பொருட்கள் பிரிவுகள் ({categories.length})
                        </h3>

                        <div className="space-y-2">
                          {categories.map((cat) => (
                            <div
                              key={cat.id}
                              className="p-3 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50"
                            >
                              <div>
                                <div className="font-bold text-xs text-slate-900">{cat.name}</div>
                                <div className="text-[11px] text-slate-500">{cat.description}</div>
                              </div>
                              <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm font-medium tabular-nums">
                                {cat.productCount || 0} பொருட்கள்
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add Category Form */}
                      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                        <h3 className="text-sm font-bold text-slate-900">புதிய பிரிவு சேர்க்க</h3>

                        <form onSubmit={handleAddCategory} className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              பிரிவின் தமிழ் பெயர் <span className="text-rose-600">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="எ.கா: வாட்டர் பியூரிபையர்"
                              value={newCatName}
                              onChange={(e) => setNewCatName(e.target.value)}
                              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              விளக்கம்
                            </label>
                            <input
                              type="text"
                              placeholder="சுருக்கமான விளக்கம்..."
                              value={newCatDesc}
                              onChange={(e) => setNewCatDesc(e.target.value)}
                              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                          >
                            பிரிவைச் சேர்
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: STORE SETTINGS */}
                  {activeTab === 'settings' && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs max-w-3xl space-y-5">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">கடை பொது அமைப்புகள்</h3>
                        <p className="text-xs text-slate-500">
                          கட்டண முறைகள், முகவரி மற்றும் தொலைபேசி எண்களை மாற்றவும்.
                        </p>
                      </div>

                      <form onSubmit={handleSaveSettings} className="space-y-4">
                        {/* Payment Toggles */}
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            கட்டண முறைகள் இயக்கம் (Payment Methods)
                          </div>

                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settingsForm.enableCod}
                              onChange={(e) => setSettingsForm({ ...settingsForm, enableCod: e.target.checked })}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <div>
                              <div className="text-xs font-semibold text-slate-800">நேரில் பணம் செலுத்துதல் (Cash on Delivery)</div>
                              <div className="text-[11px] text-slate-500">வாடிக்கையாளர்கள் பொருள் வந்ததும் பணம் செலுத்த அனுமதிக்கவும்</div>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settingsForm.enableUpi}
                              onChange={(e) => setSettingsForm({ ...settingsForm, enableUpi: e.target.checked })}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <div>
                              <div className="text-xs font-semibold text-slate-800">நேரடி UPI பரிவர்த்தனை (PhonePe / GPay)</div>
                              <div className="text-[11px] text-slate-500">கடையின் தொலைபேசி எண்ணிற்கு UPI மூலம் பணம் பெற</div>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settingsForm.enableBajajEmi}
                              onChange={(e) => setSettingsForm({ ...settingsForm, enableBajajEmi: e.target.checked })}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <div>
                              <div className="text-xs font-semibold text-slate-800">பஜாஜ் பின்சர்வ் 0% EMI வசதி</div>
                              <div className="text-[11px] text-slate-500">சுலப தவணை திட்டத்தில் பொருட்களை வாங்க அனுமதிக்க</div>
                            </div>
                          </label>
                        </div>

                        {/* Contact details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              தொலைபேசி எண் 1 (WhatsApp)
                            </label>
                            <input
                              type="text"
                              value={settingsForm.phone1}
                              onChange={(e) => setSettingsForm({ ...settingsForm, phone1: e.target.value })}
                              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              தொலைபேசி எண் 2
                            </label>
                            <input
                              type="text"
                              value={settingsForm.phone2}
                              onChange={(e) => setSettingsForm({ ...settingsForm, phone2: e.target.value })}
                              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            முழு கடை முகவரி
                          </label>
                          <textarea
                            rows={2}
                            value={settingsForm.address}
                            onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            டாப் பேனர் அறிவிப்பு உரை
                          </label>
                          <input
                            type="text"
                            value={settingsForm.announcement}
                            onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>

                        <button
                          type="submit"
                          className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          அமைப்புகளை சேமிக்க
                        </button>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        {/* Product Add / Edit Modal */}
        {isProductModalOpen && editingProduct && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  {editingProduct.id ? 'பொருள் விவரங்களை திருத்து' : 'புதிய பொருள் சேர்க்க'}
                </h3>
                <button
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">பொருள் பெயர் (தமிழ்) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">பிராண்ட் *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.brand || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">மாடல் எண் *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.model || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, model: e.target.value })}
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">பிரிவு *</label>
                    <select
                      value={editingProduct.categoryId}
                      onChange={(e) => {
                        const cat = categories.find((c) => c.id === e.target.value);
                        setEditingProduct({
                          ...editingProduct,
                          categoryId: e.target.value,
                          categoryName: cat?.name || '',
                        });
                      }}
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">கையிருப்பு (Stock) *</label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={editingProduct.stock || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">விற்பனை விலை (₹) *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">அசல் விலை / MRP (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.originalPrice || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Ad Offer Toggle */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isAdOffer || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isAdOffer: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-xs font-bold text-amber-900">
                      நேரடி விளம்பரச் சிறப்பு சலுகை என குறிக்கவும் (32" / 24" TV போல)
                    </span>
                  </label>
                  {editingProduct.isAdOffer && (
                    <input
                      type="text"
                      placeholder="விளம்பர விலை குறிப்பு (எ.கா: ₹10,999 விளம்பர விலை)"
                      value={editingProduct.adOfferNotice || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, adOfferNotice: e.target.value })}
                      className="w-full p-1.5 text-xs bg-white border border-amber-300 rounded mt-1"
                    />
                  )}
                </div>

                {/* Image upload / URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">பொருள் படம் (Image)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={editingProduct.image || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="பட URL அல்லது கீழே கோப்பை பதிவேற்றவும்"
                      className="flex-1 p-2 text-xs border border-slate-300 rounded-lg"
                    />
                    <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 border border-slate-300">
                      <Upload className="w-3.5 h-3.5" />
                      <span>கோப்பு</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">விளக்கம் (தமிழ்)</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200">
                  {editingProduct.id ? (
                    <button
                      type="button"
                      onClick={() => {
                        const prod = products.find((p) => p.id === editingProduct.id);
                        if (prod) {
                          promptDeleteProduct(prod);
                        } else {
                          promptDeleteProduct(editingProduct as Product);
                        }
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px]"
                      title="இந்த பொருளை நிரந்தரமாக நீக்க"
                    >
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      <span>பொருளை நீக்கு</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProductModalOpen(false);
                        setEditingProduct(null);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg min-h-[40px]"
                    >
                      ரத்து
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs min-h-[40px]"
                    >
                      சேமிக்க
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Single Order View Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    ஆர்டர் விவரம்: {selectedOrder.id}
                  </h3>
                  <span className="text-xs text-slate-500">
                    தேதி: {new Date(selectedOrder.createdAt).toLocaleString('ta-IN')}
                  </span>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-1 text-slate-400 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-700">
                <div><strong>பெயர்:</strong> {selectedOrder.customer.name}</div>
                <div><strong>கைபேசி:</strong> {selectedOrder.customer.phone}</div>
                <div><strong>முகவரி:</strong> {selectedOrder.customer.address}, {selectedOrder.customer.villageOrTown} - {selectedOrder.customer.pincode}</div>
                {selectedOrder.customer.notes && (
                  <div><strong>குறிப்பு:</strong> {selectedOrder.customer.notes}</div>
                )}
                <div><strong>கட்டணம்:</strong> {selectedOrder.paymentMethod.toUpperCase()} (மொத்தம்: ₹{selectedOrder.totalAmount.toLocaleString('en-IN')})</div>
                <div><strong>தற்போதைய நிலை:</strong> <span className="font-bold text-blue-700">{selectedOrder.status}</span></div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-900 mb-2">பொருட்கள்:</div>
                <div className="space-y-1 text-xs">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between p-2 bg-slate-50 rounded border border-slate-100">
                      <span>{it.productName} (x{it.quantity})</span>
                      <span className="font-bold tabular-nums">₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
                >
                  மூடு
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Product Confirmation Modal */}
        {productToDelete && (
          <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-slate-900">பொருளை நீக்க விரும்புகிறீர்களா?</h3>
                <p className="text-xs text-slate-500">
                  இந்த பொருளை நிர்வாக பட்டியலிலிருந்தும் வாடிக்கையாளர் பார்வையிலிருந்தும் நிரந்தரமாக நீக்க வேண்டுமா?
                </p>
              </div>

              {/* Product Preview Card */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <img
                  src={productToDelete.image}
                  alt={productToDelete.name}
                  className="w-14 h-14 object-cover rounded-lg border border-slate-200 bg-white shrink-0"
                />
                <div className="min-w-0 flex-1 text-left">
                  <div className="text-xs font-bold text-slate-900 truncate">{productToDelete.name}</div>
                  <div className="text-[11px] text-slate-500">{productToDelete.brand} · மாடல்: {productToDelete.model}</div>
                  <div className="text-xs font-bold text-blue-900 tabular-nums mt-0.5">
                    ₹{productToDelete.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>எச்சரிக்கை: இந்த நடவடிக்கை நிரந்தரமானது. நீக்கப்பட்ட பொருளை மீண்டும் மீட்டெடுக்க இயலாது.</span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setProductToDelete(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer min-h-[44px]"
                >
                  ரத்து செய்க
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDeleteProduct}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs min-h-[44px] disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeleting ? 'நீக்கப்படுகிறது...' : 'ஆம், பொருளை நீக்கு'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Status Result Popup */}
        {deleteStatus !== 'idle' && (
          <div className="fixed inset-0 z-80 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center space-y-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${deleteStatus === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {deleteStatus === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {deleteStatus === 'success' ? 'நீக்கப்பட்டது!' : 'நீக்குவதில் பிழை'}
              </h3>
              <p className="text-xs text-slate-500">
                {deleteStatus === 'success' ? 'பொருள் வெற்றிகரமாக நீக்கப்பட்டது.' : 'மன்னிக்கவும், பொருளை நீக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'}
              </p>
              <button
                onClick={() => setDeleteStatus('idle')}
                className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-800"
              >
                சரி
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
