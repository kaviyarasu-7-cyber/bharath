export interface Product {
  id: string;
  name: string; // Tamil product name
  brand: string; // Brand name (e.g. Samsung, LG, Preethi)
  model: string; // Model number
  categoryId: string; // e.g. cat-1
  categoryName: string; // e.g. LED தொலைக்காட்சிகள்
  price: number; // Selling price in INR
  originalPrice: number; // MRP in INR
  discountPercentage: number;
  stock: number;
  inStock: boolean;
  image: string;
  description: string; // Tamil description
  specs: { label: string; value: string }[];
  isAdOffer?: boolean; // Promotional price from shop advertisement (e.g. 32" TV ₹10,999)
  adOfferNotice?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  emiAvailable?: boolean;
  monthlyEmiStarting?: number;
  rating?: number;
  reviewCount?: number;
}

export interface Category {
  id: string;
  name: string; // Tamil name
  iconName: string;
  description: string;
  productCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'cod' | 'upi' | 'bajaj_emi';

export type OrderStatus =
  | 'புதிய ஆர்டர்'
  | 'உறுதிப்படுத்தப்பட்டது'
  | 'தயாராகிறது'
  | 'அனுப்பப்பட்டது'
  | 'வழங்கப்பட்டது'
  | 'ரத்து செய்யப்பட்டது';

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
  villageOrTown: string;
  pincode: string;
  notes?: string;
}

export interface Order {
  id: string;
  customer: OrderCustomer;
  items: {
    productId: string;
    productName: string;
    model: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'நிலுவையில்' | 'சரிபார்க்கப்பட்டது' | 'நேரில் பெறப்பட்டது';
  status: OrderStatus;
  createdAt: string;
  statusHistory?: { status: OrderStatus; timestamp: string; note?: string }[];
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isApproved: boolean;
}

export interface StoreSettings {
  shopName: string;
  address: string;
  phone1: string;
  phone2: string;
  whatsappNumber: string;
  enableCod: boolean;
  enableUpi: boolean;
  upiId: string;
  enableBajajEmi: boolean;
  announcement: string;
  bannerImage: string;
}
