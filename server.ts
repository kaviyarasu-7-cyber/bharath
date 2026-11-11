import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS } from './src/data/initialData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isDev = process.env.NODE_ENV !== 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database persistence setup
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

interface DatabaseSchema {
  products: typeof INITIAL_PRODUCTS;
  categories: typeof INITIAL_CATEGORIES;
  orders: any[];
  settings: typeof INITIAL_SETTINGS;
  reviews: any[];
}

function loadDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      orders: [
        {
          id: 'BE-2026-1001',
          customer: {
            name: 'சுரேஷ் குமார்',
            phone: '98421 55678',
            address: '12/4, காமராஜர் வீதி',
            villageOrTown: 'வடசித்தூர்',
            pincode: '641202',
            notes: 'மாலையில் விநியோகம் செய்யவும்',
          },
          items: [
            {
              productId: 'prod-1',
              productName: '32-இன்ச் ஸ்மார்ட் பிரேம்லெஸ் எல்இடி டிவி',
              model: 'BH-32SMART-HD',
              price: 10999,
              quantity: 1,
              image: '/src/assets/images/promo_tv_festival_display_1794210842998.jpg',
            },
          ],
          subtotal: 10999,
          deliveryFee: 0,
          totalAmount: 10999,
          paymentMethod: 'cod',
          paymentStatus: 'சரிபார்க்கப்பட்டது',
          status: 'வழங்கப்பட்டது',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          statusHistory: [
            { status: 'புதிய ஆர்டர்', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
            { status: 'உறுதிப்படுத்தப்பட்டது', timestamp: new Date(Date.now() - 86400000 * 1.8).toISOString() },
            { status: 'அனுப்பப்பட்டது', timestamp: new Date(Date.now() - 86400000 * 1.2).toISOString() },
            { status: 'வழங்கப்பட்டது', timestamp: new Date(Date.now() - 86400000).toISOString() },
          ],
        },
      ],
      settings: INITIAL_SETTINGS,
      reviews: [
        {
          id: 'rev-1',
          productId: 'prod-1',
          customerName: 'முருகேசன்',
          rating: 5,
          comment: 'வடசித்தூர் பாரத் எண்டர்பிரைசஸில் வாங்கிய 32 இன்ச் டிவி படம் மிக அருமையாக உள்ளது! சிறந்த விலை.',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          isApproved: true,
        },
        {
          id: 'rev-2',
          productId: 'prod-8',
          customerName: 'செல்வி',
          rating: 5,
          comment: 'ப்ரீத்தி மிக்ஸி மிக விரைவாக அரைக்கிறது. பஜாஜ் இ.எம்.ஐ வசதி உதவியாக இருந்தது.',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          isApproved: true,
        },
      ],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file, resetting to initial', err);
    return {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      orders: [],
      settings: INITIAL_SETTINGS,
      reviews: [],
    };
  }
}

let db = loadDatabase();

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database file', err);
  }
}

// Security: Simple Admin Token Auth
const ADMIN_TOKEN = 'bharath-admin-secure-token-2026';
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'bharath',
};

// Rate limiting state for admin login: 3 attempts -> 1 minute lockout
const adminLoginRateLimit = {
  failedAttempts: 0,
  lockUntil: 0,
};

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
    return next();
  }
  return res.status(401).json({ error: 'அங்கீகரிக்கப்படாத அணுகல் (Unauthorized access)' });
}

// ---------------- API ROUTES ----------------

// Admin Login with 3-attempt 1-minute restriction
app.post('/api/auth/admin/login', (req, res) => {
  const { username, password } = req.body;
  const now = Date.now();

  // 1. Check if currently locked out
  if (now < adminLoginRateLimit.lockUntil) {
    const remainingSeconds = Math.ceil((adminLoginRateLimit.lockUntil - now) / 1000);
    return res.status(429).json({
      error: `கடவுச்சொல் 3 முறை தவறாக உள்ளிடப்பட்டது. பாதுகாப்பு கருதி 1 நிமிடம் கணக்கு முடக்கப்பட்டுள்ளது. மீண்டும் முயற்சிக்க இன்னும் ${remainingSeconds} வினாடிகள் காத்திருக்கவும்.`,
      isLocked: true,
      remainingSeconds,
    });
  }

  // Reset lockout if time has passed
  if (adminLoginRateLimit.lockUntil > 0 && now >= adminLoginRateLimit.lockUntil) {
    adminLoginRateLimit.failedAttempts = 0;
    adminLoginRateLimit.lockUntil = 0;
  }

  // 2. Validate credentials (username: admin, password: bharath)
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // Reset failed count on successful login
    adminLoginRateLimit.failedAttempts = 0;
    adminLoginRateLimit.lockUntil = 0;

    return res.json({
      success: true,
      token: ADMIN_TOKEN,
      user: { username: 'admin', role: 'administrator', name: 'பாரத் எண்டர்பிரைசஸ் நிர்வாகி' },
    });
  }

  // 3. Failed attempt handling
  adminLoginRateLimit.failedAttempts += 1;

  if (adminLoginRateLimit.failedAttempts >= 3) {
    // Lock for 60 seconds (1 minute)
    adminLoginRateLimit.lockUntil = now + 60 * 1000;
    adminLoginRateLimit.failedAttempts = 0;

    return res.status(429).json({
      error: 'கடவுச்சொல் 3 முறை தவறாக உள்ளிடப்பட்டது! பாதுகாப்பு கருதி 1 நிமிடம் கணக்கு முடக்கப்பட்டுள்ளது.',
      isLocked: true,
      remainingSeconds: 60,
    });
  }

  const attemptsLeft = 3 - adminLoginRateLimit.failedAttempts;
  return res.status(401).json({
    error: `தவறான கடவுச்சொல். இன்னும் ${attemptsLeft} வாய்ப்புகள் மட்டுமே உள்ளன. (Incorrect credentials. ${attemptsLeft} attempts remaining)`,
    attemptsLeft,
  });
});

// Admin Verify Token
app.get('/api/auth/admin/verify', requireAdmin, (_req, res) => {
  res.json({ valid: true, user: { username: 'admin', role: 'administrator' } });
});

// Products: List & Filter
app.get('/api/products', (req, res) => {
  let result = [...db.products];
  const { category, search, adOffers, featured } = req.query;

  if (category && typeof category === 'string' && category !== 'all') {
    result = result.filter(
      (p) => p.categoryId === category || p.categoryName === category
    );
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
    );
  }

  if (adOffers === 'true') {
    result = result.filter((p) => p.isAdOffer);
  }

  if (featured === 'true') {
    result = result.filter((p) => p.isFeatured);
  }

  res.json(result);
});

// Products: Get by ID
app.get('/api/products/:id', (req, res) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'பொருள் கிடைக்கவில்லை (Product not found)' });
  }
  res.json(product);
});

// Products: Create (Admin)
app.post('/api/products', requireAdmin, (req, res) => {
  const newProduct = {
    ...req.body,
    id: `prod-${Date.now()}`,
    inStock: req.body.stock > 0,
    rating: req.body.rating || 5.0,
    reviewCount: req.body.reviewCount || 0,
  };
  db.products.unshift(newProduct);
  saveDatabase();
  res.status(201).json(newProduct);
});

// Products: Update (Admin)
app.put('/api/products/:id', requireAdmin, (req, res) => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'பொருள் கிடைக்கவில்லை' });
  }
  db.products[index] = {
    ...db.products[index],
    ...req.body,
    inStock: req.body.stock !== undefined ? req.body.stock > 0 : db.products[index].inStock,
  };
  saveDatabase();
  res.json(db.products[index]);
});

// Products: Delete (Admin)
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  db.products = db.products.filter((p) => p.id !== req.params.id);
  saveDatabase();
  res.json({ success: true, message: 'பொருள் நீக்கப்பட்டது' });
});

// Categories: List
app.get('/api/categories', (_req, res) => {
  const categoriesWithCount = db.categories.map((c) => ({
    ...c,
    productCount: db.products.filter((p) => p.categoryId === c.id || p.categoryName === c.name).length,
  }));
  res.json(categoriesWithCount);
});

// Categories: Create (Admin)
app.post('/api/categories', requireAdmin, (req, res) => {
  const newCategory = {
    id: `cat-${Date.now()}`,
    name: req.body.name,
    iconName: req.body.iconName || 'Package',
    description: req.body.description || '',
  };
  db.categories.push(newCategory);
  saveDatabase();
  res.status(201).json(newCategory);
});

// Categories: Delete (Admin)
app.delete('/api/categories/:id', requireAdmin, (req, res) => {
  db.categories = db.categories.filter((c) => c.id !== req.params.id);
  saveDatabase();
  res.json({ success: true, message: 'பிரிவு நீக்கப்பட்டது' });
});

// Orders: Create (Public Checkout)
app.post('/api/orders', (req, res) => {
  const { customer, items, subtotal, deliveryFee, totalAmount, paymentMethod } = req.body;

  if (!customer?.name || !customer?.phone || !customer?.address || !items || items.length === 0) {
    return res.status(400).json({ error: 'தயவுசெய்து அனைத்து விவரங்களையும் பூர்த்தி செய்யவும்' });
  }

  // Generate unique order ID format: BE-2026-XXXX
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `BE-2026-${randomSuffix}`;

  const nowIso = new Date().toISOString();
  const newOrder = {
    id: orderId,
    customer,
    items,
    subtotal: subtotal || 0,
    deliveryFee: deliveryFee || 0,
    totalAmount: totalAmount || 0,
    paymentMethod: paymentMethod || 'cod',
    paymentStatus: 'நிலுவையில்',
    status: 'புதிய ஆர்டர்',
    createdAt: nowIso,
    statusHistory: [
      {
        status: 'புதிய ஆர்டர்',
        timestamp: nowIso,
        note: 'வாடிக்கையாளர் மூலம் ஆர்டர் பெறப்பட்டது',
      },
    ],
  };

  db.orders.unshift(newOrder);

  // Update stock counts
  items.forEach((item: any) => {
    const prod = db.products.find((p) => p.id === item.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
      prod.inStock = prod.stock > 0;
    }
  });

  saveDatabase();
  res.status(201).json(newOrder);
});

// Orders: Get All (Admin)
app.get('/api/orders', requireAdmin, (_req, res) => {
  res.json(db.orders);
});

// Orders: Get Single (Lookup for Tracking)
app.get('/api/orders/:id', (req, res) => {
  const { phone } = req.query;
  const order = db.orders.find((o) => o.id.toUpperCase() === req.params.id.toUpperCase());

  if (!order) {
    return res.status(404).json({ error: 'ஆர்டர் எண் காணப்படவில்லை' });
  }

  // If phone is provided, verify match for customer privacy
  if (phone && typeof phone === 'string') {
    const cleanPhone = phone.replace(/\D/g, '');
    const orderPhone = order.customer.phone.replace(/\D/g, '');
    if (!orderPhone.includes(cleanPhone) && !cleanPhone.includes(orderPhone)) {
      return res.status(403).json({ error: 'கைபேசி எண் பொருந்தவில்லை' });
    }
  }

  res.json(order);
});

// Orders: Update Status (Admin)
app.patch('/api/orders/:id/status', requireAdmin, (req, res) => {
  const { status, note, paymentStatus } = req.body;
  const order = db.orders.find((o) => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'ஆர்டர் காணப்படவில்லை' });
  }

  if (status) {
    order.status = status;
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `நிலை மாற்றப்பட்டது: ${status}`,
    });
  }

  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }

  saveDatabase();
  res.json(order);
});

// Store Settings: Get
app.get('/api/settings', (_req, res) => {
  res.json(db.settings);
});

// Store Settings: Update (Admin)
app.put('/api/settings', requireAdmin, (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  saveDatabase();
  res.json(db.settings);
});

// Reviews: Get for Product
app.get('/api/reviews/:productId', (req, res) => {
  const reviews = db.reviews.filter((r) => r.productId === req.params.productId && r.isApproved);
  res.json(reviews);
});

// Reviews: Create
app.post('/api/reviews', (req, res) => {
  const { productId, customerName, rating, comment } = req.body;
  if (!productId || !customerName || !rating || !comment) {
    return res.status(400).json({ error: 'விவரங்கள் முழுமையாக இல்லை' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    productId,
    customerName,
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString(),
    isApproved: true, // auto approve in local store or toggle
  };

  db.reviews.unshift(newReview);
  saveDatabase();
  res.status(201).json(newReview);
});

// Image Upload Endpoint (handles data URL storage or base64)
app.post('/api/upload', requireAdmin, (req, res) => {
  const { imageBase64, filename } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'படம் பதிவேற்றம் செய்யப்படவில்லை' });
  }
  // Data URL is returned as persistent storage URL
  res.json({ url: imageBase64, filename: filename || 'uploaded_image.jpg' });
});

// ---------------- DEV & PROD VITE INTEGRATION ----------------

async function setupServer() {
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath) && fs.existsSync(path.join(distPath, 'index.html'));

  if (isDev || !hasDist) {
    console.log('Starting Vite development middleware...');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    console.log('Serving production static files from dist...');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 பாரத் எண்டர்பிரைசஸ் சர்வர் இயங்குகிறது: http://0.0.0.0:${PORT}`);
  });
}

setupServer();
