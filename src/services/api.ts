import { Category, Order, OrderStatus, Product, Review, StoreSettings } from '../types';

const API_BASE = '/api';

export const api = {
  // Products
  async getProducts(params?: { category?: string; search?: string; adOffers?: boolean; featured?: boolean }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.adOffers) query.append('adOffers', 'true');
    if (params?.featured) query.append('featured', 'true');

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('பொருட்களைப் பெற முடியவில்லை');
    return res.json();
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('பொருள் கிடைக்கவில்லை');
    return res.json();
  },

  async createProduct(product: Partial<Product>, token: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('பொருளை சேர்க்க முடியவில்லை');
    return res.json();
  },

  async updateProduct(id: string, product: Partial<Product>, token: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('பொருளை மாற்ற முடியவில்லை');
    return res.json();
  },

  async deleteProduct(id: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('பொருளை நீக்க முடியவில்லை');
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('பிரிவுகளைப் பெற முடியவில்லை');
    return res.json();
  },

  async createCategory(category: { name: string; description?: string; iconName?: string }, token: string): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error('பிரிவை சேர்க்க முடியவில்லை');
    return res.json();
  },

  async deleteCategory(id: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('பிரிவை நீக்க முடியவில்லை');
  },

  // Orders
  async createOrder(orderData: any): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'ஆர்டர் செய்ய முடியவில்லை');
    }
    return res.json();
  },

  async getOrders(token: string): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('ஆர்டர்களைப் பெற முடியவில்லை');
    return res.json();
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    paymentStatus?: string,
    note?: string,
    token?: string
  ): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, paymentStatus, note }),
    });
    if (!res.ok) throw new Error('ஆர்டர் நிலையை மாற்ற முடியவில்லை');
    return res.json();
  },

  // Settings
  async getSettings(): Promise<StoreSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('அமைப்புகளைப் பெற முடியவில்லை');
    return res.json();
  },

  async updateSettings(settings: Partial<StoreSettings>, token: string): Promise<StoreSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('அமைப்புகளை சேமிக்க முடியவில்லை');
    return res.json();
  },

  // Reviews
  async getReviews(productId: string): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/reviews/${productId}`);
    if (!res.ok) return [];
    return res.json();
  },

  async addReview(review: { productId: string; customerName: string; rating: number; comment: string }): Promise<Review> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    if (!res.ok) throw new Error('கருத்தை பதிவு செய்ய முடியவில்லை');
    return res.json();
  },

  async adminLogin(username: string, password: string): Promise<{ success: boolean; token: string; user: any }> {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const errorObj = new Error(err.error || 'தவறான பயனர் பெயர் அல்லது கடவுச்சொல்') as any;
      errorObj.remainingSeconds = err.remainingSeconds;
      errorObj.isLocked = err.isLocked;
      errorObj.attemptsLeft = err.attemptsLeft;
      throw errorObj;
    }
    return res.json();
  },
};
