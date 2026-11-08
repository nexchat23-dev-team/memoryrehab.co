const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');
const { randomUUID } = crypto;
let put = null;
try {
  put = require('@vercel/blob').put;
} catch (_) {
  put = async (filename) => ({ url: `https://blob.memoryrehab.co/${filename}` });
}
require('dotenv').config();

const PORT = Number(process.env.PORT) || 3000;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store-data.json');
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || (process.env.NODE_ENV === 'production' ? '' : 'lab2026');

const SHIPPO_API_KEY = process.env.SHIPPO_API_KEY || process.env.EASYPOST_API_KEY || '';
const SHIPPING_PROVIDER = (process.env.SHIPPING_PROVIDER || 'shippo').toLowerCase();

const pendingOrders = new Map(); // txRef -> { amount, currency, email, items, createdAt }

function calculateOrderTotal(items, shippingCountry = 'NG') {
  const store = readStore();
  let subtotal = 0;
  for (const item of (Array.isArray(items) ? items : [])) {
    const prod = store.products.find(p => String(p.id) === String(item.id));
    if (prod && prod.price) {
      const qty = Math.max(1, Math.min(50, parseInt(item.quantity, 10) || 1));
      subtotal += Number(prod.price) * qty;
    }
  }
  const freeThreshold = Number(store.settings?.freeShippingThreshold || process.env.FREE_SHIPPING_THRESHOLD || 70000);
  const shipping = subtotal >= freeThreshold ? 0 : calculateFallbackShipping(subtotal, shippingCountry);
  return { subtotal, shipping, total: Number((subtotal + shipping).toFixed(2)) };
}

function calculateFallbackShipping(subtotal, countryCode) {
  const total = Number(subtotal || 0);
  const freeThreshold = Number(process.env.FREE_SHIPPING_THRESHOLD || 70000);
  if (total >= freeThreshold) return 0.0;
  const country = (countryCode || 'NG').toUpperCase();

  if (country === 'NG') return 800.0;
  if (country === 'US' || country === 'GB') return Math.max(1200, Number(((total * 0.05) || 0).toFixed(2)));
  return 2500.0;
}

async function getShippingRate({ amount, countryCode, postalCode, address }) {
  const subtotal = Number(amount || 0);
  const country = (countryCode || 'NG').toUpperCase();
  const fallback = calculateFallbackShipping(subtotal, country);

  if (!SHIPPO_API_KEY) {
    return { amount: fallback, currency: 'NGN', provider: 'fallback', fallback: true };
  }

  try {
    const destination = {
      country: country || 'NG',
      zip: (postalCode || '').trim() || undefined,
      state: undefined,
      city: undefined,
      street1: (address || '').trim() || undefined
    };

    const payload = {
      address_from: {
        country: 'NG',
        zip: '100001',
        state: 'Lagos',
        city: 'Lagos',
        street1: 'Memory Rehab Lab'
      },
      address_to: destination,
      parcels: [{
        length: '8',
        width: '6',
        height: '4',
        weight: '2.5',
        mass_unit: 'lb',
        distance_unit: 'in'
      }],
      async: false
    };

    let resp, data, rates = [];

    if (SHIPPING_PROVIDER === 'easypost') {
      // EasyPost expects a shipments create call
      const epPayload = {
        to_address: {
          country: destination.country,
          zip: destination.zip,
          state: destination.state,
          city: destination.city,
          street1: destination.street1
        },
        from_address: {
          country: 'NG',
          zip: '100001',
          state: 'Lagos',
          city: 'Lagos',
          street1: 'Memory Rehab Lab'
        },
        parcel: {
          length: '8',
          width: '6',
          height: '4',
          weight: '2.5',
          mass_unit: 'lb',
          distance_unit: 'in'
        }
      };

      resp = await fetch('https://api.easypost.com/v2/shipments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SHIPPO_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(epPayload)
      });

      data = await resp.json();
      rates = Array.isArray(data?.rates) ? data.rates : Array.isArray(data?.shipment?.rates) ? data.shipment.rates : [];
    } else {
      // default: Shippo
      resp = await fetch('https://api.goshippo.com/shipments/', {
        method: 'POST',
        headers: {
          'Authorization': `ShippoToken ${SHIPPO_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      data = await resp.json();
      const results = Array.isArray(data?.results) ? data.results : [];
      rates = results.flatMap(item => Array.isArray(item?.rates) ? item.rates : []);
    }

    const selected = rates
      .filter(rate => Number(rate?.amount || rate?.rate || 0) > 0)
      .sort((a, b) => Number((a.amount || a.rate || 0)) - Number((b.amount || b.rate || 0)))[0];

    if (!selected) {
      return { amount: fallback, currency: 'NGN', provider: SHIPPING_PROVIDER, fallback: true };
    }

    const amountValue = Number(selected.amount || selected.rate || fallback);
    const currencyValue = (selected.currency || selected.currency_code || process.env.SHIPPING_CURRENCY || 'NGN').toUpperCase();
    const labelValue = selected.servicelevel_name || selected.servicelevel?.name || selected.service || `${selected.carrier || ''} ${selected.service || ''}`.trim() || 'Carrier rate';

    return {
      amount: Number(amountValue.toFixed(2)),
      currency: currencyValue,
      provider: SHIPPING_PROVIDER,
      fallback: false,
      label: labelValue
    };
  } catch (err) {
    console.warn('Shipping quote fetch failed:', err.message);
    return { amount: fallback, currency: 'NGN', provider: 'fallback', fallback: true };
  }
}

const defaultStore = {
  settings: {
    storeName: process.env.STORE_NAME || 'Memory Rehab Lab',
    storeTagline: process.env.STORE_TAGLINE || 'Botanical Skincare',
    promoCode: process.env.STORE_PROMO_CODE || 'GLOW15',
    promoDiscount: Number(process.env.STORE_PROMO_DISCOUNT || 15),
    freeShippingThreshold: Number(process.env.FREE_SHIPPING_THRESHOLD || 70000),
    announcement: process.env.STORE_ANNOUNCEMENT || 'Free Express Shipping On Orders ₦70,000+ • 100% Clean Biocompatible Actives',
    heroEyebrow: process.env.HERO_EYEBROW || 'Step-by-Step Clinical Care',
    heroHeadline: process.env.HERO_HEADLINE || 'Healthy skin starts with a rehabilitated barrier.',
    heroDescription: process.env.HERO_DESCRIPTION || 'No complicated million-step routines. Memory Rehab simplifies barrier repair into a targeted 3-product routine designed to soothe inflammation, replenish and lock in hydration, and support the repair of your skin barrier.',
    heroPrimaryCta: process.env.HERO_PRIMARY_CTA || 'Shop 3-Step Routine',
    heroSecondaryCta: process.env.HERO_SECONDARY_CTA || 'Build Routine & Save 15%',
    welcomeEyebrow: process.env.WELCOME_EYEBROW || 'Apothecary Welcome',
    welcomeTitle: process.env.WELCOME_TITLE || 'Your skin barrier, restored with pure botanicals.',
    welcomeDescription: process.env.WELCOME_DESCRIPTION || 'Welcome to Memory Rehab. Join our skincare collective today to unlock personalized routine recommendations and save on your first clinical care order.',
    themeAccentColor: process.env.THEME_ACCENT_COLOR || '#f48bb3',
    darkTheme: process.env.DARK_THEME || 'obsidian-rose',
    maintenanceMode: false,
    maintenanceTitle: process.env.MAINTENANCE_TITLE || 'Laboratory Restock & Routine Formulation Update',
    maintenanceMessage: process.env.MAINTENANCE_MESSAGE || 'Our apothecary lab is currently restocking fresh botanical batches and calibrating clinical formulations. We will return shortly with freshly compounded barrier care.',
    maintenanceEstimatedReturn: process.env.MAINTENANCE_RETURN || '',
    maintenanceAllowWhatsAppOrders: true,
    maintenanceBypassKey: process.env.MAINTENANCE_BYPASS_KEY || 'lab2026'
  },
  products: [
    {
      id: '1',
      name: 'Faerie Dew™ Barrier Face Cream',
      step: 'Step 3: Hydrate & Lock',
      badge: 'Best Seller',
      price: 42000,
      originalPrice: 52000,
      image: 'photo_2026-09-09_17-33-58.jpg',
      rating: 4.9,
      reviews: 168,
      size: '30ml / 1.0 fl. oz',
      skinType: 'For: Dry / Compromised Barrier',
      summary: 'Deeply restorative lipid cream formulated with botanical ceramides, cold-pressed raspberry seed, and soothing plant sterols to rebuild compromised skin barriers.',
      ingredients: ['Ceramides NP & AP', 'Raspberry Seed Oil', 'Soothe Complex', 'Bio-Squalane'],
      inStock: true
    },
    {
      id: '2',
      name: 'For The Love Of Sun™ Vitamin C Serum',
      step: 'Step 2: Target & Treat',
      badge: 'Award Winner',
      price: 48000,
      originalPrice: 58000,
      image: 'photo_2026-09-09_17-33-54.jpg',
      rating: 4.9,
      reviews: 214,
      size: '30ml / 1.0 fl. oz',
      skinType: 'For: Dull / Uneven Skin Tone',
      summary: 'High-potency antioxidant serum blending stabilized Vitamin C, Japanese green tea extract, and low-molecular hyaluronic acid to brighten dullness and even tone.',
      ingredients: ['Vitamin C 15%', 'Green Tea Extract', 'Triple Hyaluronic', 'Ferulic Acid'],
      inStock: true
    },
    {
      id: '3',
      name: 'Exile™ Acne Fix Treatment Cream',
      step: 'Step 2: Target & Treat',
      badge: 'Clinical Grade',
      price: 39000,
      originalPrice: 49000,
      image: 'photo_2026-09-09_17-34-01.jpg',
      rating: 4.8,
      reviews: 142,
      size: '30ml / 1.0 fl. oz',
      skinType: 'For: Acne-Prone & Sensitive',
      summary: 'Targeted blemish-clearing restorative cream with Azelaic Acid, Resveratrol, and purifying botanical extracts to target stubborn breakouts without peeling.',
      ingredients: ['Azelaic Acid 10%', 'Resveratrol', 'Niacinamide 4%', 'Centella Asiatica'],
      inStock: true
    }
  ]
};

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultStore, null, 2));
  }
}

function readStore() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      settings: { ...defaultStore.settings, ...(parsed.settings || {}) },
      products: Array.isArray(parsed.products) && parsed.products.length ? parsed.products : defaultStore.products
    };
  } catch (err) {
    return JSON.parse(JSON.stringify(defaultStore));
  }
}

function writeStore(store) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  return new Promise((resolve) => {
    if (!req.on) return resolve(req.body || {});
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : (req.body || {}));
      } catch (e) {
        resolve(req.body || {});
      }
    });
  });
}

let _security = null;
let _cloudDefense = null;
let _swarmOs = null;

async function loadSecurity() {
  if (!_security) {
    _security = await import('./api/_security.js');
  }
  return _security;
}

async function loadCloudDefense() {
  if (!_cloudDefense) {
    const mod = await import('./api/_cloud-defense.js');
    _cloudDefense = mod.default;
  }
  return _cloudDefense;
}

async function loadSwarmOs() {
  if (!_swarmOs) {
    const mod = await import('./api/_swarm-os.js');
    _swarmOs = mod.default;
  }
  return _swarmOs;
}

function shimHttpObjects(req, res) {
  if (!res.status) {
    res.status = function(code) {
      this.statusCode = code;
      return this;
    };
  }
  if (!res.json) {
    res.json = function(obj) {
      this.setHeader('Content-Type', 'application/json; charset=utf-8');
      this.writeHead(this.statusCode || 200);
      this.end(JSON.stringify(obj));
      return this;
    };
  }
  if (!res.send) {
    res.send = function(data) {
      this.writeHead(this.statusCode || 200);
      this.end(typeof data === 'object' ? JSON.stringify(data) : String(data));
      return this;
    };
  }
}

async function handleRequest(req, res) {
  shimHttpObjects(req, res);
  const sec = await loadSecurity();

  function checkAdminAuth(r) {
    const adminKey = r.headers['x-admin-key'] || r.headers['x-vault-key'] || r.headers['authorization'] || '';
    const clean = String(adminKey || '').replace(/^Bearer\s+/i, '').trim();
    if (!clean || !ADMIN_PASSKEY) return false;

    // Support signed JWT session tokens: mr_adm.<payload>.<sig>
    if (clean.startsWith('mr_adm.')) {
      const parts = clean.split('.');
      if (parts.length === 3) {
        const expectedSig = crypto.createHmac('sha256', ADMIN_PASSKEY).update(parts[1]).digest('base64url');
        if (sec.constantTimeSafeEqual(parts[2], expectedSig)) {
          try {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
            if (payload.exp && payload.exp > Math.floor(Date.now() / 1000) && payload.sub === 'admin') {
              return true;
            }
          } catch (_) {}
        }
      }
    }

    return sec.constantTimeSafeEqual(clean, ADMIN_PASSKEY);
  }

  // 1. CORS Preflight & Security Headers
  if (sec.handleCors(req, res)) return;
  sec.applySecurityHeaders(res);

  const parsedUrl = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsedUrl.pathname);
  req.query = parsedUrl.query || {};

  // 2. Parse JSON body for mutation requests (except upload stream)
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (!req.body && pathname !== '/api/upload') {
      req.body = await parseJsonBody(req);
    }
  }

  // 3. Sliding-window rate limit
  if (!sec.enforceRateLimit(req, res, 60)) return;

  // 4. WAF Active Defense & ASM Shellcode Trap
  if (!sec.enforceWaf(req, res)) return;

  // ── LAYER 34: CLOUD DEFENSE SENTINEL ──
  if (pathname === '/api/cloud-defense' || pathname.startsWith('/api/cloud-defense/')) {
    const cd = await loadCloudDefense();
    return cd(req, res);
  }

  // ── LAYER 35: POLYMORPHIC OS SWARM ──
  if (pathname === '/api/os-swarm' || pathname.startsWith('/api/os-swarm/')) {
    const sw = await loadSwarmOs();
    return sw(req, res);
  }


  // ── REST API ROUTES ──
  if (pathname === '/api/upload' && req.method === 'POST') {
    if (!checkAdminAuth(req)) {
      return sendJson(res, 401, { error: 'ADMIN_AUTHORIZATION_REQUIRED' });
    }
    try {
      const rawFilename = (parsedUrl.query && parsedUrl.query.filename) || req.headers['x-filename'] || 'upload.jpg';
      const baseName = path.basename(rawFilename);

      const ALLOWED_UPLOAD_EXTS = /\.(jpe?g|png|webp|mp4|mov)$/i;
      if (!ALLOWED_UPLOAD_EXTS.test(baseName)) {
        return sendJson(res, 400, { error: 'Prohibited file type. SVG and executables are disallowed.' });
      }

      const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50MB
      let totalBytes = 0;
      const chunks = [];
      for await (const chunk of req) {
        totalBytes += chunk.length;
        if (totalBytes > MAX_UPLOAD_BYTES) {
          return sendJson(res, 413, { error: 'Payload Too Large. Max allowed upload is 50MB.' });
        }
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      if (!buffer || buffer.length === 0) {
        return sendJson(res, 400, { error: 'Empty file body' });
      }

      const isJpeg = buffer.length > 3 && buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
      const isPng = buffer.length > 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
      const isWebp = buffer.length > 12 && buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
      const isMp4 = buffer.length > 8 && buffer.slice(4, 8).toString('ascii') === 'ftyp';

      if (!isJpeg && !isPng && !isWebp && !isMp4) {
        return sendJson(res, 400, { error: 'Invalid file signature: Content does not match expected image/video format.' });
      }

      const cleanFilename = `products/${Date.now()}_${baseName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-\.]/g, '')}`;
      const contentType = req.headers['content-type'] || (isJpeg ? 'image/jpeg' : isPng ? 'image/png' : isWebp ? 'image/webp' : 'video/mp4');

      const blob = await put(cleanFilename, buffer, {
        access: 'public',
        contentType: contentType,
        token: process.env.BLOB_READ_WRITE_TOKEN
      });

      return sendJson(res, 200, { ok: true, url: blob.url });
    } catch (err) {
      console.error('Blob upload error:', err);
      return sendJson(res, 500, { error: err.message });
    }
  }

  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, { ok: true, service: 'memory-rehab-backend', timestamp: new Date().toISOString() });
  }

  if (pathname === '/api/config' && req.method === 'GET') {
    const store = readStore();
    return sendJson(res, 200, {
      storeName: store.settings.storeName,
      storeTagline: store.settings.storeTagline,
      promoCode: store.settings.promoCode,
      promoDiscount: store.settings.promoDiscount,
      freeShippingThreshold: store.settings.freeShippingThreshold,
      announcement: store.settings.announcement,
      heroEyebrow: store.settings.heroEyebrow,
      heroHeadline: store.settings.heroHeadline,
      heroDescription: store.settings.heroDescription,
      heroPrimaryCta: store.settings.heroPrimaryCta,
      heroSecondaryCta: store.settings.heroSecondaryCta,
      welcomeEyebrow: store.settings.welcomeEyebrow,
      welcomeTitle: store.settings.welcomeTitle,
      welcomeDescription: store.settings.welcomeDescription,
      themeAccentColor: store.settings.themeAccentColor,
      darkTheme: store.settings.darkTheme
    });
  }

  

  if (pathname === '/api/settings') {
    if (req.method === 'GET') {
      const store = readStore();
      return sendJson(res, 200, store.settings);
    }
    if (req.method === 'PUT') {
      if (!checkAdminAuth(req)) {
        return sendJson(res, 401, { error: 'ADMIN_AUTHORIZATION_REQUIRED' });
      }
      const body = req.body || await parseJsonBody(req);
      const store = readStore();
      const updated = { ...store.settings, ...body, updatedAt: new Date().toISOString() };
      writeStore({ ...store, settings: updated });
      return sendJson(res, 200, updated);
    }
  }

  if (pathname === '/api/products') {
    if (req.method === 'GET') {
      const store = readStore();
      return sendJson(res, 200, store.products);
    }
    if (req.method === 'POST') {
      if (!checkAdminAuth(req)) {
        return sendJson(res, 401, { error: 'ADMIN_AUTHORIZATION_REQUIRED' });
      }
      const body = req.body || await parseJsonBody(req);
      const store = readStore();
      const newProduct = {
        id: String(body.id || 'prod_' + Date.now()),
        name: body.name || 'New Botanical Formulation',
        step: body.step || 'Step 2: Target & Treat',
        badge: body.badge || 'New Arrival',
        price: Number(body.price || 0),
        originalPrice: Number(body.originalPrice || body.price || 0),
        image: body.image || 'photo_2026-09-09_17-33-58.jpg',
        rating: Number(body.rating || 5),
        reviews: Number(body.reviews || 0),
        size: body.size || '30ml / 1.0 fl. oz',
        skinType: body.skinType || 'For: All Skin Types',
        summary: body.summary || '',
        ingredients: Array.isArray(body.ingredients) ? body.ingredients : [],
        inStock: body.inStock !== false,
        createdAt: new Date().toISOString()
      };

      const existingIdx = store.products.findIndex(p => p.id === newProduct.id);
      if (existingIdx !== -1) {
        store.products[existingIdx] = { ...store.products[existingIdx], ...newProduct };
      } else {
        store.products.push(newProduct);
      }

      writeStore(store);
      return sendJson(res, 201, newProduct);
    }
  }

  if (pathname.startsWith('/api/products/')) {
    const id = pathname.replace('/api/products/', '');
    const store = readStore();

    if (req.method === 'GET') {
      const p = store.products.find(item => item.id === id);
      return p ? sendJson(res, 200, p) : sendJson(res, 404, { error: 'Not found' });
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      if (!checkAdminAuth(req)) {
        return sendJson(res, 401, { error: 'ADMIN_AUTHORIZATION_REQUIRED' });
      }
      const body = req.body || await parseJsonBody(req);
      const existingIdx = store.products.findIndex(item => item.id === id);
      if (existingIdx !== -1) {
        store.products[existingIdx] = { ...store.products[existingIdx], ...body, id, updatedAt: new Date().toISOString() };
      } else {
        store.products.push({ id, ...body, createdAt: new Date().toISOString() });
      }
      writeStore(store);
      return sendJson(res, 200, { ok: true, id });
    }

    if (req.method === 'DELETE') {
      if (!checkAdminAuth(req)) {
        return sendJson(res, 401, { error: 'ADMIN_AUTHORIZATION_REQUIRED' });
      }
      store.products = store.products.filter(item => item.id !== id);
      writeStore(store);
      return sendJson(res, 200, { ok: true, id });
    }
  }

  if (pathname === '/api/admin/login' && req.method === 'POST') {
    const body = req.body || await parseJsonBody(req);
    const candidate = String(body?.passkey || '').trim();
    if (!candidate || !ADMIN_PASSKEY || !sec.constantTimeSafeEqual(candidate, ADMIN_PASSKEY)) {
      return sendJson(res, 401, { ok: false, error: 'Invalid passkey' });
    }
    const tokenPayload = {
      sub: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      nonce: crypto.randomBytes(16).toString('hex')
    };
    const tokenData = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
    const tokenSig = crypto.createHmac('sha256', ADMIN_PASSKEY).update(tokenData).digest('base64url');
    const sessionToken = `mr_adm.${tokenData}.${tokenSig}`;
    return sendJson(res, 200, { ok: true, role: 'admin', token: sessionToken, expiresIn: 3600 });
  }

  // ── Flutterwave Payment Endpoints ──
  if (pathname === '/api/shipping/rates' && req.method === 'POST') {
    const body = await parseJsonBody(req);
    const subtotal = Number(body.amount || body.subtotal || 0);
    const country = (body.country || 'NG').toUpperCase();
    const address = body.address || '';
    const postalCode = body.postalCode || body.postal_code || '';

    const quote = await getShippingRate({
      amount: subtotal,
      countryCode: country,
      postalCode,
      address
    });

    return sendJson(res, 200, {
      ok: true,
      ...quote,
      subtotal,
      total: Number((subtotal + Number(quote.amount || 0)).toFixed(2))
    });
  }

  if (pathname === '/api/payments/flutterwave/initiate' && req.method === 'POST') {
    const body = req.body || await parseJsonBody(req);
    const email = (body.email || '').trim();

    let amount = Number(body.amount || 0);
    // Server-side calculation if items are provided
    if (Array.isArray(body.items) && body.items.length > 0) {
      const calc = calculateOrderTotal(body.items, body.country || 'NG');
      if (calc.total > 0) {
        amount = calc.total;
      }
    }

    if (!amount || !Number.isFinite(amount) || amount < 1 || !email) {
      return sendJson(res, 400, { ok: false, error: 'Invalid payment amount or email' });
    }

    const flutterwaveSecret = process.env.FLW_SECRET_KEY || process.env.FLUTTERWAVE_SECRET_KEY;
    if (!flutterwaveSecret) return sendJson(res, 500, { ok: false, error: 'Payment gateway not configured' });

    try {
      const currency = (process.env.FLW_CURRENCY || 'NGN').toUpperCase();
      const forwardedProtocol = req.headers['x-forwarded-proto'];
      const protocol = forwardedProtocol
        ? forwardedProtocol.split(',')[0].trim()
        : ((req.headers.host || '').startsWith('localhost') ? 'http' : 'https');
      const callbackUrl = process.env.FLW_CALLBACK_URL || `${protocol}://${req.headers.host}/api/payments/flutterwave/callback`;
      const txRef = `mrl-${randomUUID()}`;

      // Save pending order for callback amount verification
      pendingOrders.set(txRef, {
        amount,
        currency,
        email,
        items: body.items || [],
        createdAt: Date.now()
      });

      const resp = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${flutterwaveSecret}`
        },
        body: JSON.stringify({
          tx_ref: txRef,
          amount,
          currency,
          redirect_url: callbackUrl,
          customer: { email },
          customizations: { title: defaultStore.settings.storeName }
        })
      });
      const data = await resp.json();
      const paymentLink = data?.data?.link;
      if (!resp.ok || data?.status !== 'success' || !paymentLink) {
        console.warn('Flutterwave init rejected:', data?.message || resp.statusText);
        return sendJson(res, 502, { ok: false, error: 'Could not start payment' });
      }
      return sendJson(res, 200, { ok: true, data: { authorization_url: paymentLink, tx_ref: txRef } });
    } catch (err) {
      console.warn('Flutterwave init error:', err.message);
      return sendJson(res, 502, { ok: false, error: 'Payment gateway error' });
    }
  }

  if (pathname === '/api/payments/flutterwave/callback' && req.method === 'GET') {
    const transactionId = parsedUrl.query.transaction_id;
    const txRef = parsedUrl.query.tx_ref;
    const status = parsedUrl.query.status;
    const flutterwaveSecret = process.env.FLW_SECRET_KEY || process.env.FLUTTERWAVE_SECRET_KEY;
    if (!transactionId || !txRef || status !== 'successful' || !flutterwaveSecret) {
      res.writeHead(302, { Location: '/?payment=failed' });
      return res.end();
    }

    try {
      const resp = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`, {
        headers: { 'Authorization': `Bearer ${flutterwaveSecret}` }
      });
      const result = await resp.json();
      const transaction = result?.data;
      const currency = (process.env.FLW_CURRENCY || 'NGN').toUpperCase();

      const expectedOrder = pendingOrders.get(txRef);
      let amountValid = true;
      if (expectedOrder) {
        if (Number(transaction?.amount) !== Number(expectedOrder.amount)) {
          amountValid = false;
          console.error(`[PAYMENT FRAUD BLOCKED] tx_ref ${txRef}: expected ${expectedOrder.amount}, received ${transaction?.amount}`);
        }
      }

      const verified = resp.ok && result?.status === 'success'
        && transaction?.status === 'successful'
        && transaction?.tx_ref === txRef
        && String(transaction?.currency || '').toUpperCase() === currency
        && amountValid;

      if (verified && expectedOrder) {
        pendingOrders.delete(txRef);
      }

      const paymentStatus = verified ? 'success' : 'failed';
      const failReason = !amountValid ? '&reason=price_tampering_detected' : '';
      res.writeHead(302, { Location: `/?payment=${paymentStatus}&reference=${encodeURIComponent(txRef)}${failReason}` });
      return res.end();
    } catch (err) {
      console.warn('Flutterwave callback verify error:', err.message);
      res.writeHead(302, { Location: '/?payment=failed' });
      return res.end();
    }
  }

  if (pathname === '/api/payments/initiate' && req.method === 'POST') {
    const body = req.body || await parseJsonBody(req);
    const amount = Number(body.amount || 0);
    const email = (body.email || '').trim();

    if (!amount || !Number.isFinite(amount) || amount < 1 || !email) {
      return sendJson(res, 400, { ok: false, error: 'Invalid amount or email' });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET;
    if (!paystackSecret) return sendJson(res, 500, { ok: false, error: 'Payment gateway not configured' });

    try {
      const currency = (process.env.PAYSTACK_CURRENCY || 'NGN').toUpperCase();
      const smallestUnitAmount = Math.round(amount * 100); // cents for USD, kobo for NGN
      const resp = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${paystackSecret}`
        },
        body: JSON.stringify({
          email,
          amount: smallestUnitAmount,
          currency,
          callback_url: process.env.PAYSTACK_CALLBACK_URL || undefined
        })
      });
      const data = await resp.json();
      return sendJson(res, resp.ok ? 200 : 502, data);
    } catch (err) {
      console.warn('Paystack init error:', err.message);
      return sendJson(res, 502, { ok: false, error: 'Payment gateway error' });
    }
  }

  if (pathname === '/api/payments/verify' && req.method === 'GET') {
    const reference = parsedUrl.query.reference;
    if (!reference) return sendJson(res, 400, { ok: false, error: 'Missing reference' });
    const paystackSecret = process.env.PAYSTACK_SECRET;
    if (!paystackSecret) return sendJson(res, 500, { ok: false, error: 'Payment gateway not configured' });

    try {
      const resp = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${paystackSecret}` }
      });
      const data = await resp.json();
      return sendJson(res, resp.ok ? 200 : 502, data);
    } catch (err) {
      console.warn('Paystack verify error:', err.message);
      return sendJson(res, 502, { ok: false, error: 'Payment gateway error' });
    }
  }

  // Paystack redirect callback (redirects customer back here after payment)
  if (pathname === '/paystack-callback' && req.method === 'GET') {
    const reference = parsedUrl.query.reference;
    if (!reference) {
      res.writeHead(302, { Location: '/?payment=failed' });
      return res.end();
    }
    const paystackSecret = process.env.PAYSTACK_SECRET;
    if (!paystackSecret) {
      res.writeHead(302, { Location: '/?payment=failed' });
      return res.end();
    }

    try {
      const resp = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${paystackSecret}` }
      });
      const data = await resp.json();
      if (data && data.status === 'success' || (data.data && data.data.status === 'success')) {
        res.writeHead(302, { Location: `/?payment=success&reference=${encodeURIComponent(reference)}` });
        return res.end();
      } else {
        res.writeHead(302, { Location: `/?payment=failed&reference=${encodeURIComponent(reference)}` });
        return res.end();
      }
    } catch (err) {
      console.warn('Paystack callback verify error:', err.message);
      res.writeHead(302, { Location: '/?payment=failed' });
      return res.end();
    }
  }

  // ── MIME TYPES DICTIONARY ──
  const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
  };

  // ── STATIC FILE SERVING WITH RANGE / STREAMING (MP4 videos) ──
  let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');

  if (relativePath === 'admin') relativePath = 'admin.html';
  if (relativePath === 'product') relativePath = 'product.html';
  if (relativePath === 'auth') relativePath = 'auth.html';
  if (relativePath === 'about') relativePath = 'about.html';

  const PUBLIC_EXTENSIONS = new Set(['.html', '.css', '.js', '.mjs', '.jpg', '.jpeg', '.png', '.webp', '.svg', '.ico', '.mp4', '.mov', '.woff', '.woff2', '.ttf']);
  const PROHIBITED_PATHS = /^\.(env|git|vercel)|(^|[\/\\])(package\.json|package-lock\.json|server\.js|data|api|rust|asm|sandbox|test-)/i;

  if (PROHIBITED_PATHS.test(relativePath) || (!PUBLIC_EXTENSIONS.has(path.extname(relativePath).toLowerCase()) && relativePath !== '' && !['admin', 'product', 'auth', 'about'].includes(relativePath))) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Access Denied: Prohibited resource or extension');
  }

  let filePath = path.join(ROOT_DIR, relativePath);
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(ROOT_DIR + path.sep) && resolvedPath !== ROOT_DIR && resolvedPath !== path.join(ROOT_DIR, 'index.html')) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Denied: Path Traversal Detected');
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(ROOT_DIR, 'index.html');
  }

  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  const range = req.headers.range;
  if (ext === '.mp4' && range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    file.pipe(res);
    return;
  }

  res.writeHead(200, {
    'Content-Length': stat.size,
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
  });

  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(handleRequest);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Memory Rehab standalone server running at http://localhost:${PORT}`);
  });
}

module.exports = handleRequest;

