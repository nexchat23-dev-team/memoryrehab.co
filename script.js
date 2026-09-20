/**
 * MEMORY REHAB LAB - CLIENT INTERACTION SCRIPT
 * Glassmorphic UI/UX, Dual Theme Controller, Memory Rehab System Architecture,
 * Interactive Card Click Glow-Up, Face User Welcome Popup, Authentication & PDP
 */

// --- GLOBAL CATALOG DATABASE ---
// The catalog is defined in products-config.js and exposed on window.
// Do not redeclare it here; the browser will throw a duplicate declaration error
// and the storefront will fail to initialize.
window.MEMORY_REHAB_CATALOG = window.MEMORY_REHAB_CATALOG || {};

// --- OFFICIAL CONTACT & SOCIAL MEDIA CONFIGURATION ---
window.MEMORY_REHAB_CONTACT = {
  whatsappNumber: '+2349112488271',
  whatsappDisplay: '+234 911 248 8271',
  whatsappUrl: 'https://wa.me/2349112488271',
  instagramHandle: 'memoryrehab.co',
  instagramUrl: 'https://instagram.com/memoryrehab.co',
  tiktokHandle: 'memoryrehab.co',
  tiktokUrl: 'https://www.tiktok.com/@memoryrehab.co'
};

// ═══════════════════════════════════════════════════════════════
//  GLOBAL THEME HELPERS (called by Firestore sync + admin page)
// ═══════════════════════════════════════════════════════════════

/**
 * Apply a hex accent colour to the entire page in light mode.
 * Derives hover, soft-alpha, and glow variants automatically.
 */
function applyStorefrontThemeColor(hex) {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const isLightShade = brightness > 190;

  const darken = (v, a) => Math.min(255, Math.max(0, v + a)).toString(16).padStart(2, '0');
  const hover = isLightShade
    ? '#' + darken(r, -22) + darken(g, -22) + darken(b, -22)
    : '#' + darken(r, -15) + darken(g, -15) + darken(b, -15);

  const root = document.documentElement;
  root.style.setProperty('--primary', hex);
  root.style.setProperty('--primary-hover', hover);
  root.style.setProperty('--btn-primary-text', isLightShade ? '#0f172a' : '#ffffff');
  root.style.setProperty('--btn-primary-border', isLightShade ? 'rgba(15, 23, 42, 0.22)' : 'rgba(255, 255, 255, 0.35)');
  root.style.setProperty('--primary-soft', isLightShade ? 'rgba(15, 23, 42, 0.06)' : `rgba(${r},${g},${b},0.14)`);
  root.style.setProperty('--primary-glow', isLightShade ? 'rgba(15, 23, 42, 0.12)' : `rgba(${r},${g},${b},0.45)`);
  root.style.setProperty('--glass-border-subtle', isLightShade ? 'rgba(15, 23, 42, 0.18)' : `rgba(${r},${g},${b},0.25)`);
  localStorage.setItem('mr_light_accent', hex);
}

function applyStorefrontTextSettings(settings = {}) {
  if (!settings || typeof settings !== 'object') return;

  if (settings.storeName) {
    document.querySelectorAll('.brand-title').forEach((el) => {
      el.textContent = settings.storeName;
    });
    document.title = `${settings.storeName} | Clinical Botanical Barrier Skincare & Routine Apothecary`;
  }

  if (settings.storeTagline) {
    document.querySelectorAll('.brand-subtitle').forEach((el) => {
      el.textContent = settings.storeTagline;
    });
  }

  if (settings.heroEyebrow) {
    const heroEyebrow = document.querySelector('.eyebrow-badge');
    if (heroEyebrow) {
      const svgMarkup = heroEyebrow.querySelector('svg') ? heroEyebrow.querySelector('svg').outerHTML : '';
      heroEyebrow.innerHTML = `${svgMarkup}${settings.heroEyebrow}`;
    }
  }

  if (settings.heroHeadline) {
    const heroHeadline = document.querySelector('.hero-headline');
    if (heroHeadline) heroHeadline.innerHTML = settings.heroHeadline;
  }

  if (settings.heroDescription) {
    const heroDescription = document.querySelector('.hero-description, .hero-barrier-desc');
    if (heroDescription) heroDescription.textContent = settings.heroDescription;
  }

  if (settings.heroPrimaryCta) {
    const primaryCta = document.querySelector('.hero-cta-group .btn-primary');
    if (primaryCta) {
      const ctaSvg = primaryCta.querySelector('svg') ? primaryCta.querySelector('svg').outerHTML : '';
      primaryCta.innerHTML = `${settings.heroPrimaryCta}${ctaSvg}`;
    }
  }

  if (settings.heroSecondaryCta) {
    const secondaryCta = document.querySelector('.hero-cta-group .btn-secondary');
    if (secondaryCta) secondaryCta.textContent = settings.heroSecondaryCta;
  }

  if (settings.welcomeEyebrow) {
    document.querySelectorAll('.face-welcome-eyebrow').forEach((el) => {
      el.textContent = settings.welcomeEyebrow;
    });
  }

  if (settings.welcomeTitle) {
    document.querySelectorAll('.face-welcome-title').forEach((el) => {
      el.textContent = settings.welcomeTitle;
    });
  }

  if (settings.welcomeDescription) {
    document.querySelectorAll('.face-welcome-desc').forEach((el) => {
      el.textContent = settings.welcomeDescription;
    });
  }

  if (settings.heroImageUrl) {
    const heroImage = document.querySelector('.hero-image-wrap img');
    if (heroImage) heroImage.src = settings.heroImageUrl;
  }

  if (settings.welcomeImageUrl) {
    const welcomeImage = document.querySelector('.face-welcome-media img');
    if (welcomeImage) welcomeImage.src = settings.welcomeImageUrl;
  }

  if (settings.promoCode) {
    document.querySelectorAll('.face-welcome-code').forEach((el) => {
      el.textContent = settings.promoCode;
    });
  }

  if (settings.brandMonogram) {
    document.querySelectorAll('.brand-logo-icon').forEach((el) => {
      el.textContent = settings.brandMonogram;
    });
  }

  if (settings.footerBio) {
    document.querySelectorAll('.footer-brand-bio').forEach((el) => {
      el.textContent = settings.footerBio;
    });
  }

  if (settings.footerCopyright) {
    const year = new Date().getFullYear();
    const copyrightText = settings.footerCopyright.replace('{year}', year);
    document.querySelectorAll('.footer-copyright-text').forEach((el) => {
      el.textContent = copyrightText;
    });
  }

  if (settings.footerTagline) {
    document.querySelectorAll('.footer-tagline-text').forEach((el) => {
      el.textContent = settings.footerTagline;
    });
  }
}

// All supported dark mode palettes (name → CSS variable overrides)
const DARK_PALETTES = {
  'obsidian-rose': {
    label: '🌹 Obsidian Rose (Default)',
    bgBase: '#0a0c12',
    bgGrad: 'radial-gradient(circle at 15% 15%, rgba(147,51,114,0.28) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(99,102,241,0.2) 0%, transparent 50%), radial-gradient(circle at 50% 85%, rgba(236,72,153,0.18) 0%, transparent 55%), linear-gradient(150deg,#07090e 0%,#0d1019 40%,#121422 100%)',
    primary: '#f472b6', primaryHover: '#ec4899',
    primarySoft: 'rgba(244,114,182,0.18)', primaryGlow: 'rgba(244,114,182,0.55)',
    secondary: '#3b2034', accentBlush: '#1e1b2e',
    glassBg: 'rgba(18,22,34,0.74)', glassBgHover: 'rgba(25,31,48,0.88)',
    glassCard: 'rgba(18,23,36,0.78)', glassCardHover: 'rgba(25,32,51,0.92)',
    glassBorder: 'rgba(255,255,255,0.12)', glassBorderSubtle: 'rgba(244,114,182,0.3)',
    shadowGlow: '0 8px 35px rgba(244,114,182,0.42)',
    orb1: 'radial-gradient(circle, rgba(236,72,153,0.32) 0%, rgba(168,85,247,0.05) 70%)',
    orb2: 'radial-gradient(circle, rgba(147,51,234,0.28) 0%, rgba(59,130,246,0.05) 70%)',
    orb3: 'radial-gradient(circle, rgba(244,114,182,0.28) 0%, rgba(236,72,153,0.05) 70%)',
  },
  'midnight-sapphire': {
    label: '💎 Midnight Sapphire',
    bgBase: '#050810',
    bgGrad: 'radial-gradient(circle at 15% 15%, rgba(37,99,235,0.3) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(6,182,212,0.22) 0%, transparent 50%), radial-gradient(circle at 50% 85%, rgba(99,102,241,0.2) 0%, transparent 55%), linear-gradient(150deg,#030510 0%,#080c18 40%,#0a1022 100%)',
    primary: '#60a5fa', primaryHover: '#3b82f6',
    primarySoft: 'rgba(96,165,250,0.18)', primaryGlow: 'rgba(96,165,250,0.55)',
    secondary: '#1e2a4a', accentBlush: '#0f1a30',
    glassBg: 'rgba(10,18,40,0.74)', glassBgHover: 'rgba(15,25,55,0.88)',
    glassCard: 'rgba(10,18,42,0.78)', glassCardHover: 'rgba(14,26,58,0.92)',
    glassBorder: 'rgba(96,165,250,0.14)', glassBorderSubtle: 'rgba(96,165,250,0.3)',
    shadowGlow: '0 8px 35px rgba(96,165,250,0.38)',
    orb1: 'radial-gradient(circle, rgba(37,99,235,0.35) 0%, rgba(6,182,212,0.05) 70%)',
    orb2: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(59,130,246,0.05) 70%)',
    orb3: 'radial-gradient(circle, rgba(6,182,212,0.28) 0%, rgba(37,99,235,0.05) 70%)',
  },
  'forest-emerald': {
    label: '🌿 Forest Emerald',
    bgBase: '#030f09',
    bgGrad: 'radial-gradient(circle at 15% 15%, rgba(16,185,129,0.28) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(5,150,105,0.22) 0%, transparent 50%), radial-gradient(circle at 50% 85%, rgba(52,211,153,0.15) 0%, transparent 55%), linear-gradient(150deg,#020908 0%,#070f0c 40%,#0a1510 100%)',
    primary: '#34d399', primaryHover: '#10b981',
    primarySoft: 'rgba(52,211,153,0.18)', primaryGlow: 'rgba(52,211,153,0.5)',
    secondary: '#0d2a1e', accentBlush: '#081810',
    glassBg: 'rgba(5,20,12,0.74)', glassBgHover: 'rgba(8,28,18,0.88)',
    glassCard: 'rgba(5,20,14,0.78)', glassCardHover: 'rgba(9,30,20,0.92)',
    glassBorder: 'rgba(52,211,153,0.14)', glassBorderSubtle: 'rgba(52,211,153,0.3)',
    shadowGlow: '0 8px 35px rgba(52,211,153,0.35)',
    orb1: 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(5,150,105,0.05) 70%)',
    orb2: 'radial-gradient(circle, rgba(5,150,105,0.28) 0%, rgba(52,211,153,0.05) 70%)',
    orb3: 'radial-gradient(circle, rgba(52,211,153,0.28) 0%, rgba(16,185,129,0.05) 70%)',
  },
  'amethyst-galaxy': {
    label: '✨ Amethyst Galaxy',
    bgBase: '#080510',
    bgGrad: 'radial-gradient(circle at 15% 15%, rgba(168,85,247,0.32) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(139,92,246,0.25) 0%, transparent 50%), radial-gradient(circle at 50% 85%, rgba(196,181,253,0.12) 0%, transparent 55%), linear-gradient(150deg,#05030e 0%,#0c0818 40%,#100a20 100%)',
    primary: '#c084fc', primaryHover: '#a855f7',
    primarySoft: 'rgba(192,132,252,0.18)', primaryGlow: 'rgba(192,132,252,0.55)',
    secondary: '#1e0e38', accentBlush: '#120820',
    glassBg: 'rgba(14,8,30,0.74)', glassBgHover: 'rgba(20,12,42,0.88)',
    glassCard: 'rgba(14,8,32,0.78)', glassCardHover: 'rgba(20,14,48,0.92)',
    glassBorder: 'rgba(192,132,252,0.14)', glassBorderSubtle: 'rgba(192,132,252,0.3)',
    shadowGlow: '0 8px 35px rgba(192,132,252,0.42)',
    orb1: 'radial-gradient(circle, rgba(168,85,247,0.38) 0%, rgba(139,92,246,0.05) 70%)',
    orb2: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(168,85,247,0.05) 70%)',
    orb3: 'radial-gradient(circle, rgba(192,132,252,0.28) 0%, rgba(168,85,247,0.05) 70%)',
  },
  'volcanic-amber': {
    label: '🔥 Volcanic Amber',
    bgBase: '#0f0700',
    bgGrad: 'radial-gradient(circle at 15% 15%, rgba(217,119,6,0.3) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(234,88,12,0.22) 0%, transparent 50%), radial-gradient(circle at 50% 85%, rgba(251,191,36,0.12) 0%, transparent 55%), linear-gradient(150deg,#0c0600 0%,#141000 40%,#1a1200 100%)',
    primary: '#fbbf24', primaryHover: '#f59e0b',
    primarySoft: 'rgba(251,191,36,0.18)', primaryGlow: 'rgba(251,191,36,0.5)',
    secondary: '#2d1a00', accentBlush: '#1a0f00',
    glassBg: 'rgba(22,14,0,0.74)', glassBgHover: 'rgba(30,18,0,0.88)',
    glassCard: 'rgba(22,14,0,0.78)', glassCardHover: 'rgba(32,20,0,0.92)',
    glassBorder: 'rgba(251,191,36,0.14)', glassBorderSubtle: 'rgba(251,191,36,0.3)',
    shadowGlow: '0 8px 35px rgba(251,191,36,0.38)',
    orb1: 'radial-gradient(circle, rgba(234,88,12,0.38) 0%, rgba(217,119,6,0.05) 70%)',
    orb2: 'radial-gradient(circle, rgba(217,119,6,0.3) 0%, rgba(251,191,36,0.05) 70%)',
    orb3: 'radial-gradient(circle, rgba(251,191,36,0.28) 0%, rgba(234,88,12,0.05) 70%)',
  },
  'aurora-coral': {
    label: '🌅 Aurora Coral',
    bgBase: '#0f0609',
    bgGrad: 'radial-gradient(circle at 15% 15%, rgba(244,63,94,0.28) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(251,113,133,0.2) 0%, transparent 50%), radial-gradient(circle at 50% 85%, rgba(248,113,113,0.18) 0%, transparent 55%), linear-gradient(150deg,#0c040a 0%,#140810 40%,#1a0c14 100%)',
    primary: '#fb7185', primaryHover: '#f43f5e',
    primarySoft: 'rgba(251,113,133,0.18)', primaryGlow: 'rgba(251,113,133,0.5)',
    secondary: '#3d0a16', accentBlush: '#220610',
    glassBg: 'rgba(22,5,10,0.74)', glassBgHover: 'rgba(30,8,14,0.88)',
    glassCard: 'rgba(22,5,12,0.78)', glassCardHover: 'rgba(32,10,18,0.92)',
    glassBorder: 'rgba(251,113,133,0.14)', glassBorderSubtle: 'rgba(251,113,133,0.3)',
    shadowGlow: '0 8px 35px rgba(251,113,133,0.38)',
    orb1: 'radial-gradient(circle, rgba(244,63,94,0.38) 0%, rgba(251,113,133,0.05) 70%)',
    orb2: 'radial-gradient(circle, rgba(251,113,133,0.3) 0%, rgba(248,113,113,0.05) 70%)',
    orb3: 'radial-gradient(circle, rgba(248,113,113,0.28) 0%, rgba(244,63,94,0.05) 70%)',
  },
  'pure-obsidian': {
    label: '🌑 Pure Obsidian (Platinum Noir)',
    bgBase: '#060608',
    bgGrad: 'radial-gradient(circle at 15% 15%, rgba(255,255,255,0.08) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(148,163,184,0.12) 0%, transparent 50%), radial-gradient(circle at 50% 85%, rgba(203,213,225,0.06) 0%, transparent 55%), linear-gradient(150deg,#030304 0%,#08080c 40%,#0f1117 100%)',
    primary: '#f1f5f9', primaryHover: '#e2e8f0',
    primarySoft: 'rgba(241,245,249,0.12)', primaryGlow: 'rgba(241,245,249,0.45)',
    secondary: '#1a1b22', accentBlush: '#111218',
    glassBg: 'rgba(15,17,23,0.8)', glassBgHover: 'rgba(22,25,34,0.92)',
    glassCard: 'rgba(14,16,22,0.82)', glassCardHover: 'rgba(21,24,33,0.94)',
    glassBorder: 'rgba(255,255,255,0.15)', glassBorderSubtle: 'rgba(241,245,249,0.25)',
    shadowGlow: '0 8px 35px rgba(241,245,249,0.25)',
    orb1: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(148,163,184,0.03) 70%)',
    orb2: 'radial-gradient(circle, rgba(148,163,184,0.18) 0%, rgba(255,255,255,0.02) 70%)',
    orb3: 'radial-gradient(circle, rgba(203,213,225,0.2) 0%, rgba(148,163,184,0.03) 70%)',
  },
  'burgundy-noir': {
    label: '🍷 Burgundy Velvet Noir',
    bgBase: '#0c0407',
    bgGrad: 'radial-gradient(circle at 15% 15%, rgba(159,18,57,0.35) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(190,24,93,0.25) 0%, transparent 50%), radial-gradient(circle at 50% 85%, rgba(225,29,72,0.18) 0%, transparent 55%), linear-gradient(150deg,#090205 0%,#13050b 40%,#1c0812 100%)',
    primary: '#fb7185', primaryHover: '#f43f5e',
    primarySoft: 'rgba(251,113,133,0.18)', primaryGlow: 'rgba(251,113,133,0.55)',
    secondary: '#2a0a16', accentBlush: '#1a040d',
    glassBg: 'rgba(20,5,12,0.76)', glassBgHover: 'rgba(28,8,18,0.9)',
    glassCard: 'rgba(22,6,14,0.8)', glassCardHover: 'rgba(32,10,22,0.94)',
    glassBorder: 'rgba(251,113,133,0.18)', glassBorderSubtle: 'rgba(251,113,133,0.32)',
    shadowGlow: '0 8px 35px rgba(225,29,72,0.42)',
    orb1: 'radial-gradient(circle, rgba(159,18,57,0.4) 0%, rgba(190,24,93,0.05) 70%)',
    orb2: 'radial-gradient(circle, rgba(190,24,93,0.32) 0%, rgba(159,18,57,0.05) 70%)',
    orb3: 'radial-gradient(circle, rgba(225,29,72,0.3) 0%, rgba(190,24,93,0.05) 70%)',
  },
  'twilight-aurora': {
    label: '🌌 Twilight Aurora',
    bgBase: '#060a14',
    bgGrad: 'radial-gradient(circle at 15% 15%, rgba(45,212,191,0.28) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(168,85,247,0.28) 0%, transparent 50%), radial-gradient(circle at 50% 85%, rgba(56,189,248,0.2) 0%, transparent 55%), linear-gradient(150deg,#04060d 0%,#0a1020 40%,#0f172a 100%)',
    primary: '#2dd4bf', primaryHover: '#14b8a6',
    primarySoft: 'rgba(45,212,191,0.18)', primaryGlow: 'rgba(45,212,191,0.55)',
    secondary: '#132a36', accentBlush: '#0a1722',
    glassBg: 'rgba(10,20,32,0.76)', glassBgHover: 'rgba(16,28,45,0.9)',
    glassCard: 'rgba(11,22,35,0.8)', glassCardHover: 'rgba(18,32,50,0.94)',
    glassBorder: 'rgba(45,212,191,0.16)', glassBorderSubtle: 'rgba(45,212,191,0.3)',
    shadowGlow: '0 8px 35px rgba(45,212,191,0.4)',
    orb1: 'radial-gradient(circle, rgba(45,212,191,0.36) 0%, rgba(56,189,248,0.05) 70%)',
    orb2: 'radial-gradient(circle, rgba(168,85,247,0.34) 0%, rgba(45,212,191,0.05) 70%)',
    orb3: 'radial-gradient(circle, rgba(56,189,248,0.3) 0%, rgba(168,85,247,0.05) 70%)',
  },
  'matcha-noir': {
    label: '🍵 Matcha Zen Noir',
    bgBase: '#060a07',
    bgGrad: 'radial-gradient(circle at 15% 15%, rgba(101,163,13,0.3) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(22,101,52,0.25) 0%, transparent 50%), radial-gradient(circle at 50% 85%, rgba(234,179,8,0.15) 0%, transparent 55%), linear-gradient(150deg,#040705 0%,#09110a 40%,#101c12 100%)',
    primary: '#a3e635', primaryHover: '#84cc16',
    primarySoft: 'rgba(163,230,53,0.18)', primaryGlow: 'rgba(163,230,53,0.5)',
    secondary: '#1a2916', accentBlush: '#0e180d',
    glassBg: 'rgba(9,19,12,0.76)', glassBgHover: 'rgba(14,28,18,0.9)',
    glassCard: 'rgba(10,21,13,0.8)', glassCardHover: 'rgba(16,32,20,0.94)',
    glassBorder: 'rgba(163,230,53,0.16)', glassBorderSubtle: 'rgba(163,230,53,0.3)',
    shadowGlow: '0 8px 35px rgba(163,230,53,0.38)',
    orb1: 'radial-gradient(circle, rgba(101,163,13,0.36) 0%, rgba(22,101,52,0.05) 70%)',
    orb2: 'radial-gradient(circle, rgba(234,179,8,0.25) 0%, rgba(101,163,13,0.05) 70%)',
    orb3: 'radial-gradient(circle, rgba(163,230,53,0.28) 0%, rgba(22,101,52,0.05) 70%)',
  },
  'cyber-titanium': {
    label: '🪐 Slate Titanium Noir',
    bgBase: '#080a0f',
    bgGrad: 'radial-gradient(circle at 15% 15%, rgba(71,85,105,0.35) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(14,165,233,0.2) 0%, transparent 50%), radial-gradient(circle at 50% 85%, rgba(100,116,139,0.2) 0%, transparent 55%), linear-gradient(150deg,#05070a 0%,#0b0f17 40%,#141a26 100%)',
    primary: '#38bdf8', primaryHover: '#0284c7',
    primarySoft: 'rgba(56,189,248,0.18)', primaryGlow: 'rgba(56,189,248,0.5)',
    secondary: '#1e293b', accentBlush: '#0f172a',
    glassBg: 'rgba(13,19,30,0.76)', glassBgHover: 'rgba(20,28,44,0.9)',
    glassCard: 'rgba(14,21,33,0.8)', glassCardHover: 'rgba(22,32,49,0.94)',
    glassBorder: 'rgba(56,189,248,0.15)', glassBorderSubtle: 'rgba(56,189,248,0.3)',
    shadowGlow: '0 8px 35px rgba(56,189,248,0.38)',
    orb1: 'radial-gradient(circle, rgba(71,85,105,0.38) 0%, rgba(14,165,233,0.05) 70%)',
    orb2: 'radial-gradient(circle, rgba(14,165,233,0.28) 0%, rgba(100,116,139,0.05) 70%)',
    orb3: 'radial-gradient(circle, rgba(56,189,248,0.28) 0%, rgba(71,85,105,0.05) 70%)',
  },
  'celestial-plum': {
    label: '🔮 Celestial Plum Noir',
    bgBase: '#09050d',
    bgGrad: 'radial-gradient(circle at 15% 15%, rgba(192,38,211,0.3) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(126,34,206,0.28) 0%, transparent 50%), radial-gradient(circle at 50% 85%, rgba(232,121,249,0.18) 0%, transparent 55%), linear-gradient(150deg,#060309 0%,#0f0717 40%,#180b24 100%)',
    primary: '#e879f9', primaryHover: '#d946ef',
    primarySoft: 'rgba(232,121,249,0.18)', primaryGlow: 'rgba(232,121,249,0.55)',
    secondary: '#280f38', accentBlush: '#160720',
    glassBg: 'rgba(16,8,26,0.76)', glassBgHover: 'rgba(24,12,38,0.9)',
    glassCard: 'rgba(18,9,29,0.8)', glassCardHover: 'rgba(27,14,43,0.94)',
    glassBorder: 'rgba(232,121,249,0.16)', glassBorderSubtle: 'rgba(232,121,249,0.3)',
    shadowGlow: '0 8px 35px rgba(232,121,249,0.4)',
    orb1: 'radial-gradient(circle, rgba(192,38,211,0.38) 0%, rgba(126,34,206,0.05) 70%)',
    orb2: 'radial-gradient(circle, rgba(126,34,206,0.32) 0%, rgba(232,121,249,0.05) 70%)',
    orb3: 'radial-gradient(circle, rgba(232,121,249,0.28) 0%, rgba(192,38,211,0.05) 70%)',
  },
};

/**
 * Curated list of high-luxury pastel accent hues for dynamic cycling
 */
const PASTEL_ROTATION_PALETTE = [
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Pearl Porcelain', hex: '#f8fafc' },
  { name: 'Silk Alabaster', hex: '#f1f5f9' },
  { name: 'Rose Pink', hex: '#f48bb3' },
  { name: 'Baby Pink', hex: '#f9a8d4' },
  { name: 'Blush Rose', hex: '#fda4af' },
  { name: 'Hot Coral', hex: '#fb7185' },
  { name: 'Rose Quartz', hex: '#fbcfe8' },
  { name: 'Lavender', hex: '#c084fc' },
  { name: 'Orchid', hex: '#e879f9' },
  { name: 'Amethyst', hex: '#a855f7' },
  { name: 'Lilac Mist', hex: '#d8b4fe' },
  { name: 'Periwinkle', hex: '#818cf8' },
  { name: 'Sky Blue', hex: '#60a5fa' },
  { name: 'Aqua Dream', hex: '#38bdf8' },
  { name: 'Teal Silk', hex: '#2dd4bf' },
  { name: 'Glacier Mist', hex: '#67e8f9' },
  { name: 'Mint Sage', hex: '#34d399' },
  { name: 'Spring Dew', hex: '#4ade80' },
  { name: 'Soft Green', hex: '#86efac' },
  { name: 'Pistachio Cream', hex: '#6ee7b7' },
  { name: 'Honey Gold', hex: '#fbbf24' },
  { name: 'Peach Blossom', hex: '#fb923c' },
  { name: 'Apricot Silk', hex: '#fed7aa' },
  { name: 'Buttercup', hex: '#fde68a' },
  { name: 'Caramel Velvet', hex: '#d6a77a' },
];

/**
 * Apply a full dark mode palette by palette key.
 * Works immediately on the current page regardless of theme.
 * Stored in localStorage so it persists across pages.
 */
function applyDarkThemePalette(key) {
  const palette = DARK_PALETTES[key];
  if (!palette) return;
  localStorage.setItem('mr_dark_palette', key);
  const root = document.documentElement;
  // Only apply CSS vars if currently in dark mode
  const isDark = root.getAttribute('data-theme') === 'dark' || document.body.classList.contains('dark-mode');
  if (isDark) {
    _injectDarkPalette(palette);
  }
  // Store reference so applyTheme can use it
  root.dataset.darkPalette = key;
}

function _injectDarkPalette(p) {
  const root = document.documentElement;
  root.style.setProperty('--bg-base', p.bgBase);
  root.style.setProperty('--bg-gradient', p.bgGrad);
  root.style.setProperty('--primary', p.primary);
  root.style.setProperty('--primary-hover', p.primaryHover);
  root.style.setProperty('--primary-soft', p.primarySoft);
  root.style.setProperty('--primary-glow', p.primaryGlow);
  root.style.setProperty('--secondary', p.secondary);
  root.style.setProperty('--accent-blush', p.accentBlush);
  root.style.setProperty('--glass-bg', p.glassBg);
  root.style.setProperty('--glass-bg-hover', p.glassBgHover);
  root.style.setProperty('--glass-card', p.glassCard);
  root.style.setProperty('--glass-card-hover', p.glassCardHover);
  root.style.setProperty('--glass-border', p.glassBorder);
  root.style.setProperty('--glass-border-subtle', p.glassBorderSubtle);
  root.style.setProperty('--shadow-glow', p.shadowGlow);
  // Orbs
  const orb1 = document.querySelector('.ambient-orb-1');
  const orb2 = document.querySelector('.ambient-orb-2');
  const orb3 = document.querySelector('.ambient-orb-3');
  if (orb1) orb1.style.background = p.orb1;
  if (orb2) orb2.style.background = p.orb2;
  if (orb3) orb3.style.background = p.orb3;
}

// ═══════════════════════════════════════════════════════════════
//  ⏰  AUTO-THEME SCHEDULER & DYNAMIC ROTATION ENGINE
// ═══════════════════════════════════════════════════════════════

let _autoThemeTimer = null;
let _autoThemePastelIdx = 0;
let _autoThemeDarkIdx = 0;
let _currentAutoThemeConfig = { enabled: false, interval: 30, mode: 'adaptive', smooth: true };

/**
 * Master controller for automated time-based theme rotation.
 * Called automatically by Firestore listener or admin manual trigger.
 */
function initAutoThemeScheduler(config) {
  if (_autoThemeTimer) {
    clearInterval(_autoThemeTimer);
    _autoThemeTimer = null;
  }

  if (!config) return;
  _currentAutoThemeConfig = Object.assign({}, _currentAutoThemeConfig, config);

  // Persist locally for instant resume
  try {
    localStorage.setItem('mr_autotheme_config', JSON.stringify(_currentAutoThemeConfig));
  } catch(e) {}

  // Apply smooth transition CSS flag to body
  if (_currentAutoThemeConfig.smooth) {
    document.body.classList.add('theme-morph-smooth');
  } else {
    document.body.classList.remove('theme-morph-smooth');
  }

  if (!_currentAutoThemeConfig.enabled) {
    return;
  }

  const intervalSec = Math.max(10, parseInt(_currentAutoThemeConfig.interval, 10) || 30);
  const intervalMs = intervalSec * 1000;

  _autoThemeTimer = setInterval(() => {
    triggerThemeCycleStep();
  }, intervalMs);
}

// ── Paystack Redirect Checkout Helper (client-side) ──
async function initiatePaystackRedirect(amount, email) {
  try {
    const resp = await fetch('/api/payments/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, email })
    });
    const data = await resp.json();
    if (!resp.ok || !data || !data.data || !data.data.authorization_url) {
      console.warn('Paystack init failed', data);
      alert('Payment initialization failed. Please try again.');
      return;
    }
    // Redirect customer to Paystack payment page
    window.location.href = data.data.authorization_url;
  } catch (err) {
    console.warn('Checkout error:', err);
    alert('Payment failed to start. Check your network and try again.');
  }
}

// Read payment status after redirect and show a basic message
function checkPaystackRedirect() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('payment');
  const reference = params.get('reference');
  if (!status) return;
  if (status === 'success') {
    alert('Payment successful! Reference: ' + (reference || '—'));
    // Optionally remove query params
    history.replaceState({}, document.title, window.location.pathname);
  } else if (status === 'failed') {
    alert('Payment failed or was cancelled.');
    history.replaceState({}, document.title, window.location.pathname);
  }
}

// Run on load to catch Paystack redirect
window.addEventListener('load', checkPaystackRedirect);

/**
 * Execute one cycle step according to active mode
 */
function triggerThemeCycleStep() {
  const root = document.documentElement;
  const isDark = root.getAttribute('data-theme') === 'dark' || document.body.classList.contains('dark-mode');
  const mode = _currentAutoThemeConfig.mode || 'adaptive';

  if (mode === 'daynight') {
    // Smart Circadian: Day = 06:00 to 18:00 (Pastel Light), Night = 18:00 to 06:00 (Obsidian Dark)
    const curHour = new Date().getHours();
    const isNightTime = curHour < 6 || curHour >= 18;

    if (isNightTime && !isDark) {
      if (typeof window.applyThemeGlobal === 'function') window.applyThemeGlobal('dark');
    } else if (!isNightTime && isDark) {
      if (typeof window.applyThemeGlobal === 'function') window.applyThemeGlobal('light');
    }

    // Now cycle subtle mood within current mode
    if (isNightTime) {
      _cycleNextDarkPalette();
    } else {
      _cycleNextPastel();
    }
    return;
  }

  if (mode === 'pastels') {
    // If not in light mode, switch to light mode or cycle pastels
    if (isDark && typeof window.applyThemeGlobal === 'function') window.applyThemeGlobal('light');
    _cycleNextPastel();
  } else if (mode === 'obsidian') {
    // If not in dark mode, switch to dark mode or cycle obsidian
    if (!isDark && typeof window.applyThemeGlobal === 'function') window.applyThemeGlobal('dark');
    _cycleNextDarkPalette();
  } else {
    // 'adaptive' or 'both': Respect user's active theme and cycle corresponding palette
    if (isDark) {
      _cycleNextDarkPalette();
    } else {
      _cycleNextPastel();
    }
  }
}

function _cycleNextPastel() {
  _autoThemePastelIdx = (_autoThemePastelIdx + 1) % PASTEL_ROTATION_PALETTE.length;
  const chosen = PASTEL_ROTATION_PALETTE[_autoThemePastelIdx];
  applyStorefrontThemeColor(chosen.hex);
}

function _cycleNextDarkPalette() {
  const darkKeys = Object.keys(DARK_PALETTES);
  _autoThemeDarkIdx = (_autoThemeDarkIdx + 1) % darkKeys.length;
  const chosenKey = darkKeys[_autoThemeDarkIdx];
  applyDarkThemePalette(chosenKey);
}

// Expose globally for cross-file and admin testing
window.initAutoThemeScheduler = initAutoThemeScheduler;
window.triggerThemeCycleStep = triggerThemeCycleStep;
window.DARK_PALETTES = DARK_PALETTES;
window.PASTEL_ROTATION_PALETTE = PASTEL_ROTATION_PALETTE;


// ═══════════════════════════════════════════════════════════════
//  CURRENCY FORMATTER (global — used by cart, PDP, and hydration)
// ═══════════════════════════════════════════════════════════════
function formatCurrency(value) {
  let amount = Number(value || 0);
  if (amount > 0 && amount <= 100) {
    amount = amount * 1000;
  }
  return `₦${amount.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

// ═══════════════════════════════════════════════════════════════
//  ROUTINE WISHLIST PERSISTENCE & STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════
const WISHLIST_STORAGE_KEY = 'mr_wishlist';

function loadPersistedWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => {
          if (Number(item.price) > 0 && Number(item.price) <= 100) {
            item.price = Number(item.price) * 1000;
          }
          if (Number(item.originalPrice) > 0 && Number(item.originalPrice) <= 100) {
            item.originalPrice = Number(item.originalPrice) * 1000;
          }
          return item;
        });
      }
    }
  } catch (e) {
    console.warn('Wishlist load notice:', e);
  }
  return [];
}

let wishlist = loadPersistedWishlist();

function saveWishlistLocally() {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  } catch (e) {
    console.warn('Wishlist storage notice:', e);
  }
  updateWishlistBadges();
  syncWishlistCloud();
}

function getWishlist() {
  return wishlist;
}

function isInWishlist(id) {
  if (!id) return false;
  return wishlist.some((item) => String(item.id) === String(id));
}

function updateWishlistBadges() {
  const totalCount = wishlist.length;
  const badgeElements = document.querySelectorAll('.wishlist-count-badge, #wishlistCount, #drawerWishlistCount, #mobWishlistCount');
  badgeElements.forEach((el) => {
    el.textContent = totalCount;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  });
}

function addToWishlist(product) {
  if (!product || !product.id) return;
  if (!isInWishlist(product.id)) {
    let price = Number(product.price) || 42000;
    if (price > 0 && price <= 100) price = price * 1000;
    let origPrice = Number(product.originalPrice) || Number((price * 1.2).toFixed(0));
    if (origPrice > 0 && origPrice <= 100) origPrice = origPrice * 1000;

    wishlist.push({
      id: String(product.id),
      name: product.name || 'Botanical Formulation',
      price: price,
      originalPrice: origPrice,
      image: product.image || 'photo_2026-09-09_17-33-58.jpg',
      size: product.size || '30ml / 1.0 fl. oz',
      step: product.step || 'Step 3: Hydrate & Lock',
      badge: product.badge || 'Curated Actives',
      skinType: product.skinType || 'Barrier Repair Care'
    });
    saveWishlistLocally();
    syncWishlistCardButtons();
    if (typeof window.showToast === 'function') {
      window.showToast(`Saved ${product.name} to routine wishlist`, '❤️');
    }
  }
}

function removeFromWishlist(id) {
  if (!id) return;
  const item = wishlist.find((i) => String(i.id) === String(id));
  const name = item ? item.name : 'Formulation';
  wishlist = wishlist.filter((i) => String(i.id) !== String(id));
  saveWishlistLocally();
  syncWishlistCardButtons();
  if (typeof window.showToast === 'function') {
    window.showToast(`Removed ${name} from wishlist`, '🤍');
  }
}

function toggleWishlist(product) {
  if (!product || !product.id) return false;
  if (isInWishlist(product.id)) {
    removeFromWishlist(product.id);
    return false;
  } else {
    addToWishlist(product);
    return true;
  }
}

function clearWishlist() {
  wishlist = [];
  saveWishlistLocally();
  syncWishlistCardButtons();
  if (typeof window.showToast === 'function') {
    window.showToast('Cleared your routine wishlist', '✨');
  }
}

async function syncWishlistCloud() {
  try {
    const userRaw = localStorage.getItem('mr_current_user');
    if (!userRaw) return;
    const user = JSON.parse(userRaw);
    if (!user || !user.email) return;

    if (typeof firebase !== 'undefined' && firebase.firestore) {
      const db = firebase.firestore();
      await db.collection('user_wishlists').doc(user.email.toLowerCase()).set({
        items: wishlist,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }
  } catch (e) {}
}

function syncWishlistCardButtons() {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach((card) => {
    const id = card.dataset.id || card.getAttribute('data-id');
    const wishBtn = card.querySelector('.card-wishlist-btn');
    if (wishBtn && id) {
      if (isInWishlist(id)) {
        wishBtn.classList.add('active');
        wishBtn.setAttribute('aria-label', 'Remove from routine wishlist');
      } else {
        wishBtn.classList.remove('active');
        wishBtn.setAttribute('aria-label', 'Save to routine wishlist');
      }
    }
  });

  const pdpBtn = document.getElementById('pdpWishlistBtn');
  if (pdpBtn) {
    const params = new URLSearchParams(window.location.search);
    const curId = params.get('id') || '1';
    if (isInWishlist(curId)) {
      pdpBtn.classList.add('active');
      pdpBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span>Saved to Routine Wishlist</span>
      `;
    } else {
      pdpBtn.classList.remove('active');
      pdpBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span>Save to Routine Wishlist</span>
      `;
    }
  }
}

// Wishlist Page Renderer (wishlist.html)
function initWishlistPage() {
  const grid = document.getElementById('wishlistGrid');
  const emptyState = document.getElementById('wishlistEmptyState');
  const toolbar = document.getElementById('wishlistToolbar');
  const statsPill = document.getElementById('wishlistStatsCount');
  const userBanner = document.getElementById('wishlistUserBanner');

  if (!grid && !emptyState) return;

  const currentItems = getWishlist();

  if (userBanner) {
    const userRaw = localStorage.getItem('mr_current_user');
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        userBanner.innerHTML = `
          <div class="wishlist-sync-info">
            <span style="font-size: 1.1rem;">✨</span>
            <span>Saved to Routine Profile for <strong>${user.name || user.email}</strong>. Synced in the cloud.</span>
          </div>
        `;
      } catch (e) {}
    }
  }

  if (statsPill) {
    statsPill.textContent = `${currentItems.length} Formulation${currentItems.length === 1 ? '' : 's'}`;
  }

  if (currentItems.length === 0) {
    if (grid) grid.style.display = 'none';
    if (toolbar) toolbar.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';

    const recsGrid = document.getElementById('wishlistRecsGrid');
    if (recsGrid) {
      const catalog = window.MEMORY_REHAB_CATALOG || {};
      const sampleIds = Object.keys(catalog).slice(0, 3);
      recsGrid.innerHTML = sampleIds.map((id) => {
        const p = catalog[id];
        if (!p) return '';
        const price = (Number(p.price) > 0 && Number(p.price) <= 100) ? Number(p.price) * 1000 : p.price;
        return `
          <article class="product-card" data-id="${p.id}" data-name="${p.name}" data-price="${price}" data-image="${p.image}">
            <div class="card-media-wrap">
              <span class="step-badge">${p.step || 'Routine Step'}</span>
              <button class="card-wishlist-btn" type="button" aria-label="Save to wishlist">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
              <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy" /></a>
            </div>
            <div class="card-content-wrap">
              <h3 class="card-title"><a href="product.html?id=${p.id}">${p.name}</a></h3>
              <div class="card-footer-row">
                <span class="current-price">${formatCurrency(price)}</span>
                <button class="card-add-cart-btn" type="button" onclick="if(window.addToCart){window.addToCart(window.MEMORY_REHAB_CATALOG['${p.id}']);}">Add</button>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (grid) {
    grid.style.display = 'grid';
    grid.innerHTML = currentItems.map((item) => {
      const price = (Number(item.price) > 0 && Number(item.price) <= 100) ? Number(item.price) * 1000 : Number(item.price);
      const origPrice = (Number(item.originalPrice) > 0 && Number(item.originalPrice) <= 100) ? Number(item.originalPrice) * 1000 : Number(item.originalPrice);
      const hasDiscount = origPrice && origPrice > price;
      const discountPercent = hasDiscount ? Math.round(((origPrice - price) / origPrice) * 100) : 0;
      const waMsg = encodeURIComponent(`Hi Memory Rehab! 🌿 I would like to order my wishlisted formulation: ${item.name} (${formatCurrency(price)}).`);

      return `
        <div class="wishlist-card" data-id="${item.id}">
          <div class="wishlist-card-media">
            <span class="wishlist-step-badge">${item.step || 'Routine Step'}</span>
            <button type="button" class="wishlist-card-remove-btn" data-id="${item.id}" aria-label="Remove ${item.name} from wishlist" title="Remove from wishlist">✕</button>
            ${hasDiscount ? `<span class="wishlist-discount-badge">SAVE ${discountPercent}%</span>` : ''}
            <a href="product.html?id=${item.id}">
              <img src="${item.image || 'photo_2026-09-09_17-33-58.jpg'}" alt="${item.name}" class="wishlist-card-img" />
            </a>
          </div>
          <div class="wishlist-card-body">
            <span class="wishlist-card-skin">
              <img src="favicon-32x32.png" width="14" height="14" alt="" />
              ${item.skinType || 'Barrier Rehabilitation Care'}
            </span>
            <h3 class="wishlist-card-title">
              <a href="product.html?id=${item.id}">${item.name}</a>
            </h3>
            <div class="wishlist-card-rating">
              ★★★★★ <span>4.9 (Verified Barrier Care)</span>
            </div>
            <div class="wishlist-price-row">
              <span class="wishlist-price">${formatCurrency(price)}</span>
              ${hasDiscount ? `<span class="wishlist-orig-price">${formatCurrency(origPrice)}</span>` : ''}
            </div>
            <div class="wishlist-card-actions">
              <button type="button" class="wishlist-move-bag-btn" data-id="${item.id}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Move to Routine Bag
              </button>
              <a href="https://wa.me/2349112488271?text=${waMsg}" target="_blank" rel="noopener noreferrer" class="wishlist-wa-btn">
                Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  if (toolbar) toolbar.style.display = 'flex';

  if (grid) {
    grid.onclick = (e) => {
      const removeBtn = e.target.closest('.wishlist-card-remove-btn');
      if (removeBtn) {
        const id = removeBtn.getAttribute('data-id');
        const card = removeBtn.closest('.wishlist-card');
        if (card) {
          card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            removeFromWishlist(id);
            initWishlistPage();
          }, 200);
        }
        return;
      }

      const moveBtn = e.target.closest('.wishlist-move-bag-btn');
      if (moveBtn) {
        const id = moveBtn.getAttribute('data-id');
        const item = currentItems.find((i) => String(i.id) === String(id));
        if (item && typeof window.addToCart === 'function') {
          window.addToCart(item, 1);
        }
        return;
      }
    };
  }

  const moveAllBtn = document.getElementById('wishlistMoveAllBtn');
  if (moveAllBtn) {
    moveAllBtn.onclick = () => {
      if (wishlist.length === 0) return;
      wishlist.forEach((it) => {
        if (typeof window.addToCart === 'function') {
          window.addToCart(it, 1);
        }
      });
      if (typeof window.showToast === 'function') {
        window.showToast(`Moved all ${wishlist.length} formulations to your routine bag!`, '🎉');
      }
      if (typeof window.triggerConfetti === 'function') {
        window.triggerConfetti();
      }
      if (typeof window.openCart === 'function') {
        window.openCart();
      }
    };
  }

  const clearBtn = document.getElementById('wishlistClearBtn');
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (wishlist.length === 0) return;
      if (confirm('Are you sure you want to clear all items from your routine wishlist?')) {
        clearWishlist();
        initWishlistPage();
      }
    };
  }

  const shareBtn = document.getElementById('wishlistShareBtn');
  if (shareBtn) {
    shareBtn.onclick = async () => {
      try {
        const shareUrl = window.location.href.split('?')[0];
        await navigator.clipboard.writeText(shareUrl);
        if (typeof window.showToast === 'function') {
          window.showToast('Wishlist link copied to clipboard!', '📋');
        }
      } catch (err) {
        if (typeof window.showToast === 'function') {
          window.showToast('Wishlist link ready to share!', '🔗');
        }
      }
    };
  }
}

window.getWishlist = getWishlist;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.toggleWishlist = toggleWishlist;
window.isInWishlist = isInWishlist;
window.clearWishlist = clearWishlist;
window.updateWishlistBadges = updateWishlistBadges;
window.syncWishlistCardButtons = syncWishlistCardButtons;
window.initWishlistPage = initWishlistPage;

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. DYNAMIC YEAR ---
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- WISHLIST INITIALIZATION ---
  updateWishlistBadges();
  syncWishlistCardButtons();
  if (typeof initWishlistPage === 'function') {
    initWishlistPage();
  }

  // --- 2. AUTHENTICATION & USER HEADER STATUS ---
  const userAuthPill = document.getElementById('userAuthPill');
  const userAuthText = document.getElementById('userAuthText');
  const userAuthDropdown = document.getElementById('userAuthDropdown');
  const dropdownAuthLink = document.getElementById('dropdownAuthLink');
  const logoutBtn = document.getElementById('logoutBtn');

  function updateAuthHeader() {
    const rawUser = localStorage.getItem('mr_current_user');
    if (!rawUser) {
      if (userAuthText) userAuthText.textContent = 'Sign In';
      if (dropdownAuthLink) {
        dropdownAuthLink.textContent = 'Sign In / Register';
        dropdownAuthLink.href = 'auth.html';
      }
      if (logoutBtn) logoutBtn.style.display = 'none';
      return;
    }

    try {
      const user = JSON.parse(rawUser);
      const firstName = user.name ? user.name.split(' ')[0] : 'Profile';
      if (userAuthText) userAuthText.textContent = `Hi, ${firstName} ▾`;
      if (dropdownAuthLink) {
        dropdownAuthLink.textContent = `Skin: ${user.skinType || 'Custom'}`;
        dropdownAuthLink.href = 'auth.html';
      }
      if (logoutBtn) logoutBtn.style.display = 'block';
    } catch (e) {
      console.error(e);
    }
  }

  updateAuthHeader();

  if (userAuthPill) {
    userAuthPill.addEventListener('click', (e) => {
      e.stopPropagation();
      const rawUser = localStorage.getItem('mr_current_user');
      if (!rawUser && !e.target.closest('.user-auth-dropdown')) {
        window.location.href = 'auth.html';
        return;
      }
      if (userAuthDropdown) {
        userAuthDropdown.classList.toggle('show');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      localStorage.removeItem('mr_current_user');
      if (window.firebase && typeof firebase.auth === 'function') {
        try { firebase.auth().signOut(); } catch (err) { console.warn(err); }
      }
      updateAuthHeader();
      if (userAuthDropdown) userAuthDropdown.classList.remove('show');
      showToast('Signed out of routine session', '👋');
    });
  }

  document.addEventListener('click', () => {
    if (userAuthDropdown) userAuthDropdown.classList.remove('show');
  });

  // --- 3. FACE USER WELCOME POPUP CONTROLLER ---
  const faceWelcomeModal = document.getElementById('faceWelcomeModal');
  const closeFaceWelcome = document.getElementById('closeFaceWelcome');
  const dismissWelcomeBtn = document.getElementById('dismissWelcomeBtn');
  const replayWelcomeBtn = document.getElementById('replayWelcomeBtn');

  function openFaceWelcome() {
    if (!faceWelcomeModal) return;
    faceWelcomeModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeFaceWelcomePopup() {
    if (!faceWelcomeModal) return;
    faceWelcomeModal.classList.remove('open');
    document.body.style.overflow = '';
    sessionStorage.setItem('mr_welcome_dismissed', 'true');
  }

  // Show on first visit
  const urlParams = new URLSearchParams(window.location.search);
  const welcomeDismissed = sessionStorage.getItem('mr_welcome_dismissed') || urlParams.has('nowelcome');
  if (!welcomeDismissed && faceWelcomeModal) {
    setTimeout(openFaceWelcome, 900);
  }

  if (closeFaceWelcome) closeFaceWelcome.addEventListener('click', closeFaceWelcomePopup);
  if (dismissWelcomeBtn) dismissWelcomeBtn.addEventListener('click', closeFaceWelcomePopup);
  if (faceWelcomeModal) {
    faceWelcomeModal.addEventListener('click', (e) => {
      if (e.target === faceWelcomeModal) closeFaceWelcomePopup();
    });
  }

  if (replayWelcomeBtn) {
    replayWelcomeBtn.addEventListener('click', openFaceWelcome);
  }

  // --- 4. DUAL THEME CONTROLLER (Dark / Light) ---
  const htmlRoot = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('mr_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const urlTheme = urlParams.get('theme');

  const initialTheme = urlTheme || (storedTheme ? storedTheme : systemPrefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlRoot.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
      if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to light mode');
      // Apply saved dark palette
      const darkKey = localStorage.getItem('mr_dark_palette') || 'obsidian-rose';
      const palette = DARK_PALETTES[darkKey];
      if (palette) _injectDarkPalette(palette);
    } else {
      htmlRoot.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark-mode');
      if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to dark mode');
      // Restore saved light accent (clear inline overrides so CSS vars take over)
      htmlRoot.style.removeProperty('--bg-base');
      htmlRoot.style.removeProperty('--bg-gradient');
      htmlRoot.style.removeProperty('--glass-bg');
      htmlRoot.style.removeProperty('--glass-bg-hover');
      htmlRoot.style.removeProperty('--glass-card');
      htmlRoot.style.removeProperty('--glass-card-hover');
      htmlRoot.style.removeProperty('--glass-border');
      htmlRoot.style.removeProperty('--secondary');
      htmlRoot.style.removeProperty('--accent-blush');
      htmlRoot.style.removeProperty('--shadow-glow');
      // Re-apply saved light accent colour if any
      const lightColor = localStorage.getItem('mr_light_accent');
      if (lightColor) applyStorefrontThemeColor(lightColor);
      // Reset orbs
      const orb1 = document.querySelector('.ambient-orb-1');
      const orb2 = document.querySelector('.ambient-orb-2');
      const orb3 = document.querySelector('.ambient-orb-3');
      if (orb1) orb1.style.background = '';
      if (orb2) orb2.style.background = '';
      if (orb3) orb3.style.background = '';
    }
  }

  // Expose for external and scheduler usage
  window.applyThemeGlobal = applyTheme;

  const allThemeToggles = document.querySelectorAll('.theme-toggle-btn, #themeToggle');
  allThemeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('mr_theme', newTheme);
      const darkKey = localStorage.getItem('mr_dark_palette') || 'obsidian-rose';
      const darkLabel = (DARK_PALETTES[darkKey] || {}).label || 'Dark Mode';
      showToast(
        newTheme === 'dark' ? `${darkLabel} activated` : 'Pastel Mode restored',
        newTheme === 'dark' ? '🌙' : '☀️'
      );
    });
  });

  // --- 5. TOAST NOTIFICATION SYSTEM ---
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, icon = '✓') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2800);
  }

  // Expose globally for Firebase inline script
  window.showToast = showToast;

  // --- 6. INTERACTIVE CARD NAVIGATION (delegated for performance) ---
  // Use a single delegated listener instead of many per-card listeners to reduce memory and improve responsiveness.

  // --- 7. SHOPPING CART & BUNDLE BUILDER ---
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartToggle = document.getElementById('cartToggle');
  const closeCart = document.getElementById('closeCart');
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const subtotalValue = document.getElementById('subtotalValue');
  const checkoutTotal = document.getElementById('checkoutTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const shippingGoalText = document.getElementById('shippingGoalText');
  const shippingGoalPercent = document.getElementById('shippingGoalPercent');
  const shippingProgressFill = document.getElementById('shippingProgressFill');
  const addBundleBtn = document.getElementById('addBundleBtn');

  function loadPersistedCart() {
    try {
      const raw = localStorage.getItem('mr_cart');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => {
            if (Number(item.price) <= 100) item.price = 42000;
            return item;
          });
        }
      }
    } catch (e) {}
    return [
      {
        id: '1',
        name: 'Faerie Dew™ Barrier Face Cream',
        price: 42000,
        image: 'photo_2026-09-09_17-33-58.jpg',
        size: '30ml',
        quantity: 1
      }
    ];
  }

  let cart = loadPersistedCart();

  function saveCartLocally() {
    try {
      localStorage.setItem('mr_cart', JSON.stringify(cart));
    } catch (e) {}
  }

  let activeShippingCost = 0;
  let activeTotalCost = 0;

  function getFreeShippingThreshold() {
    try {
      const raw = localStorage.getItem('mr_store_settings');
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.freeShippingThreshold && !isNaN(s.freeShippingThreshold) && Number(s.freeShippingThreshold) > 0) {
          return Number(s.freeShippingThreshold);
        }
      }
    } catch(e) {}
    return (window.STORE_CONFIG && window.STORE_CONFIG.freeShippingThreshold) || 70000.0;
  }

  function calculateShippingFallback(subtotal, countryCode) {
    const freeThreshold = getFreeShippingThreshold();
    if (subtotal >= freeThreshold) return 0;
    const country = (countryCode || 'NG').toUpperCase();
    if (country === 'NG') return 3500.0;
    if (country === 'US' || country === 'GB') return Math.max(12000, Number((subtotal * 0.1).toFixed(0)));
    return 15000.0;
  }

  async function refreshCheckoutSummary() {
    const subtotal = cart.reduce((s, it) => s + Number(it.price) * it.quantity, 0);
    const country = (checkoutCountry && checkoutCountry.value) || 'NG';
    const freeThreshold = getFreeShippingThreshold();

    if (checkoutSubtotal) checkoutSubtotal.textContent = formatCurrency(subtotal);
    if (checkoutShippingCost) checkoutShippingCost.textContent = '…';
    if (checkoutTotalDisplay) checkoutTotalDisplay.textContent = '…';

    try {
      if (subtotal >= freeThreshold) {
        activeShippingCost = 0;
      } else {
        const resp = await fetch('/api/shipping/rates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: subtotal, country })
        });
        const data = await resp.json();
        const ship = Number(data && data.amount ? data.amount : 0) || calculateShippingFallback(subtotal, country);
        activeShippingCost = Number(ship);
      }
    } catch (err) {
      activeShippingCost = calculateShippingFallback(subtotal, country);
    }

    activeTotalCost = subtotal + activeShippingCost;
    if (checkoutShippingCost) {
      checkoutShippingCost.textContent = activeShippingCost === 0 ? 'FREE (Unlocked 🎉)' : formatCurrency(activeShippingCost);
    }
    if (checkoutTotalDisplay) {
      checkoutTotalDisplay.textContent = formatCurrency(activeTotalCost);
    }
  }

  function openCart() {
    if (cartDrawer && cartBackdrop) {
      cartDrawer.classList.add('open');
      cartBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    if (cartDrawer && cartBackdrop) {
      cartDrawer.classList.remove('open');
      cartBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (cartToggle) cartToggle.addEventListener('click', openCart);
  if (closeCart) closeCart.addEventListener('click', closeCartDrawer);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCartDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      if (typeof closeModal === 'function') closeModal();
    }
  });

  function updateCartBadge() {
    if (!cartCount) return;
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;
    cartCount.classList.remove('bump');
    void cartCount.offsetWidth;
    cartCount.classList.add('bump');
  }

  // formatCurrency is defined at module scope (above DOMContentLoaded) so it
  // is accessible to hydrateStorefrontCatalog and other top-level helpers.
  // See the global function declaration near the top of this file.

  function updateShippingProgress(total) {
    const freeShippingGoal = getFreeShippingThreshold();
    if (!shippingGoalText || !shippingGoalPercent || !shippingProgressFill) return;

    if (total >= freeShippingGoal) {
      shippingGoalText.textContent = '🎉 You unlocked Free Express Shipping!';
      shippingGoalPercent.textContent = '100%';
      shippingProgressFill.style.width = '100%';
    } else {
      const remaining = Math.max(0, freeShippingGoal - total);
      const percent = Math.min(100, Math.round((total / freeShippingGoal) * 100));
      shippingGoalText.textContent = `Add ${formatCurrency(remaining)} more for Free Shipping!`;
      shippingGoalPercent.textContent = `${percent}%`;
      shippingProgressFill.style.width = `${percent}%`;
    }
  }

  function renderCart() {
    if (!cartItems) return;

    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <strong>Your routine bag is empty</strong>
          <small>Explore our botanical routine steps to restore your skin barrier.</small>
          <a href="index.html#catalog" class="btn-primary" onclick="document.getElementById('closeCart')?.click();" style="margin-top: 14px; font-size: 0.85rem; padding: 8px 18px;">
            Shop Formulations
          </a>
        </div>
      `;
      if (subtotalValue) subtotalValue.textContent = '₦0';
      if (checkoutTotal) checkoutTotal.textContent = '₦0';
      updateShippingProgress(0);
      updateCartBadge();
      return;
    }

    cartItems.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item-card" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <h4 class="cart-item-name">${item.name}</h4>
            <span class="cart-item-price">${formatCurrency(item.price * item.quantity)}</span>
            <div class="cart-item-controls">
              <button class="qty-btn qty-minus" data-id="${item.id}" type="button" aria-label="Decrease quantity">−</button>
              <span class="qty-number">${item.quantity}</span>
              <button class="qty-btn qty-plus" data-id="${item.id}" type="button" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="cart-item-remove-btn" data-id="${item.id}" type="button" aria-label="Remove item">✕</button>
        </div>
      `
      )
      .join('');

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const formattedSubtotal = formatCurrency(subtotal);

    if (subtotalValue) subtotalValue.textContent = formattedSubtotal;
    if (checkoutTotal) checkoutTotal.textContent = formattedSubtotal;

    updateShippingProgress(subtotal);
    updateCartBadge();
    saveCartLocally();

    // Cart controls are handled by a single delegated listener attached once (see setup below),
    // so we avoid re-attaching listeners each render which can cause memory churn.
  }

  // Attach a single delegated listener for cart item controls to avoid re-attaching on every render
  if (cartItems) {
    cartItems.addEventListener('click', (e) => {
      const plus = e.target.closest('.qty-plus');
      if (plus) {
        const id = plus.getAttribute('data-id');
        const item = cart.find((i) => i.id === id);
        if (item) {
          item.quantity += 1;
          renderCart();
        }
        return;
      }

      const minus = e.target.closest('.qty-minus');
      if (minus) {
        const id = minus.getAttribute('data-id');
        const idx = cart.findIndex((i) => i.id === id);
        if (idx > -1) {
          if (cart[idx].quantity > 1) {
            cart[idx].quantity -= 1;
          } else {
            cart.splice(idx, 1);
            showToast('Item removed from routine bag', '✕');
          }
          renderCart();
        }
        return;
      }

      const removeBtn = e.target.closest('.cart-item-remove-btn');
      if (removeBtn) {
        const id = removeBtn.getAttribute('data-id');
        cart = cart.filter((i) => i.id !== id);
        renderCart();
        showToast('Item removed from routine bag', '✕');
        return;
      }
    });
  }

  function addToCart(product, qty = 1) {
    let normalizedPrice = Number(product.price || 0);
    if (normalizedPrice > 0 && normalizedPrice <= 100) normalizedPrice = normalizedPrice * 1000;
    const existing = cart.find((i) => i.id === product.id || i.name === product.name);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({
        id: product.id || String(Date.now()),
        name: product.name,
        price: normalizedPrice,
        image: product.image,
        size: product.size || '30ml',
        quantity: qty
      });
    }
    renderCart();
    openCart();
    showToast(`Added ${product.name} to routine bag!`, '🛍️');
  }

  window.addToCart = addToCart;
  window.openCart = openCart;

  // --- 8. MEMORY REHAB SYSTEM 3-STEP BUNDLE BUILDER ACTION ---
  if (addBundleBtn) {
    addBundleBtn.addEventListener('click', () => {
      const bundleItem = {
        id: 'bundle-3step',
        name: 'Complete 3-Step Barrier Routine Set (Vita Sea + Vitamin C + Faerie Dew)',
        price: 107000,
        image: 'photo_2026-09-09_17-33-58.jpg',
        size: '3-Piece Set',
        quantity: 1
      };
      addToCart(bundleItem);
      showToast('🎉 Complete 3-Step Routine Added! You saved ₦19,000!', '✨');
    });
  }

  // NOTE: Add/quick-view/wishlist interactions are handled by the delegated click handler below.

  // Checkout button
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      if (cart.length === 0) {
        showToast('Your routine bag is empty!', '⚠️');
        return;
      }

      const checkoutModal = document.getElementById('checkoutModal');
      if (checkoutModal) checkoutModal.style.display = 'block';
      await refreshCheckoutSummary();
    });
  }

  // --- GAMIFIED ROUTINE ACHIEVEMENT STREAK & LEVEL ENGINE ---
  function calculateOrderAchievement(newOrderItems, orderTotal) {
    let currentStreak = 0;
    let purchasedProductIds = new Set();
    try {
      currentStreak = parseInt(localStorage.getItem('mr_order_streak') || '0', 10);
      const savedIds = JSON.parse(localStorage.getItem('mr_purchased_product_ids') || '[]');
      savedIds.forEach(id => purchasedProductIds.add(String(id)));
    } catch(e) {}

    // Increment streak on new successful order
    currentStreak += 1;
    localStorage.setItem('mr_order_streak', String(currentStreak));
    localStorage.setItem('mr_streak_last_date', new Date().toISOString());

    const currentItemCount = (newOrderItems || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
    const currentDistinctCount = (newOrderItems || []).length;
    (newOrderItems || []).forEach(item => {
      if (item && item.id) purchasedProductIds.add(String(item.id));
    });
    localStorage.setItem('mr_purchased_product_ids', JSON.stringify(Array.from(purchasedProductIds)));
    const totalDistinctEver = purchasedProductIds.size;
    const totalProductsCount = Math.max(currentItemCount, totalDistinctEver);

    // Levels based on products bought & routine completeness
    let level = 1;
    let levelName = 'Apothecary Initiate';
    let levelIcon = '🌿';
    let nextLevelText = 'Add a 2nd product to unlock Level 2';
    let progressPercent = 25;
    let perkText = '15% Welcome Refill Privileges Unlocked';

    if (totalProductsCount >= 5 || currentStreak >= 4) {
      level = 5;
      levelName = 'Barrier Mastery Sovereign';
      levelIcon = '👑';
      nextLevelText = 'MAX LEVEL • Radiance Sovereign';
      progressPercent = 100;
      perkText = 'Permanent VIP Concierge + Custom Compounding Lab Access';
    } else if (totalProductsCount >= 4 || currentStreak >= 3) {
      level = 4;
      levelName = 'Clinical Luminary';
      levelIcon = '✨';
      nextLevelText = 'Next: Level 5 at 5+ products or 4-order streak';
      progressPercent = 80;
      perkText = 'Complimentary Apothecary Travel Minis on next dispatch';
    } else if (totalProductsCount >= 3 || currentDistinctCount >= 3) {
      level = 3;
      levelName = 'Routine Alchemist';
      levelIcon = '🌟';
      nextLevelText = 'Next: Level 4 at 4 routine formulas';
      progressPercent = 60;
      perkText = 'Complete 3-Step Master • Priority Lab Packaging';
    } else if (totalProductsCount >= 2 || currentDistinctCount >= 2) {
      level = 2;
      levelName = 'Barrier Restorer';
      levelIcon = '💧';
      nextLevelText = 'Next: Level 3 (Unlock Complete 3-Step Routine)';
      progressPercent = 40;
      perkText = 'Dual-Action Defense • 5% Bonus Routine Points';
    } else {
      level = 1;
      levelName = 'Apothecary Initiate';
      levelIcon = '🌿';
      nextLevelText = 'Next: Level 2 at 2 routine steps';
      progressPercent = 25;
      perkText = '15% Welcome Refill Privileges Unlocked';
    }

    const unlockedBadges = [];
    unlockedBadges.push({ icon: '💧', label: 'First Drop' });
    if (totalProductsCount >= 2) unlockedBadges.push({ icon: '🛡️', label: 'Dual Defender' });
    if (totalProductsCount >= 3) unlockedBadges.push({ icon: '🌿', label: 'Trinity Master' });
    if (orderTotal >= getFreeShippingThreshold()) unlockedBadges.push({ icon: '🚚', label: 'VIP Express Courier' });
    if (currentStreak >= 2) unlockedBadges.push({ icon: '🔥', label: `${currentStreak}-Streak Master` });

    // Sync to user profile in localStorage
    try {
      const userRaw = localStorage.getItem('mr_current_user');
      if (userRaw) {
        const user = JSON.parse(userRaw);
        user.level = level;
        user.levelName = levelName;
        user.streak = currentStreak;
        user.badges = unlockedBadges;
        localStorage.setItem('mr_current_user', JSON.stringify(user));
      }
    } catch(e) {}

    return {
      level,
      levelName,
      levelIcon,
      streak: currentStreak,
      progressPercent,
      nextLevelText,
      perkText,
      badges: unlockedBadges
    };
  }

  // --- ORDER PLACEMENT & LAB CELEBRATION ENGINE ---
  function completeOrderFlow({ customerName, customerPhone, email, address, country, method = 'whatsapp' } = {}) {
    if (!cart || cart.length === 0) {
      showToast('Your routine bag is empty!', '⚠️');
      return;
    }

    const orderId = 'MR-' + Math.floor(10000 + Math.random() * 90000);
    const orderDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const subtotal = cart.reduce((s, it) => s + Number(it.price) * it.quantity, 0);
    const shipping = activeShippingCost || 0;
    const total = subtotal + shipping;
    const name = customerName || (document.getElementById('checkoutName')?.value.trim()) || 'Valued Client';
    const phone = customerPhone || (document.getElementById('checkoutPhone')?.value.trim()) || '';
    const addr = address || (document.getElementById('checkoutAddress')?.value.trim()) || '';
    const dest = country || (document.getElementById('checkoutCountry')?.value) || 'Nigeria';
    const em = email || (document.getElementById('checkoutEmail')?.value.trim()) || '';

    // Calculate Achievement & Routine Streak based on products purchased
    const achievement = calculateOrderAchievement(cart, total);
    const freeThreshold = getFreeShippingThreshold();

    // Build rich formatted WhatsApp order text
    let waText = `🌿 *MEMORY REHAB LAB — OFFICIAL ORDER #${orderId}* 🌿%0A`;
    waText += `📅 Date: ${orderDate}%0A`;
    waText += `-----------------------------------%0A`;
    waText += `🛍️ *ORDERED ROUTINE ACTIVES:*%0A`;
    cart.forEach((item, i) => {
      waText += `${i + 1}. ${item.quantity}x *${item.name}* (${item.size || 'Full Size'}) — ${formatCurrency(item.price * item.quantity)}%0A`;
    });
    waText += `-----------------------------------%0A`;
    waText += `📦 *Subtotal:* ${formatCurrency(subtotal)}%0A`;
    waText += `🚚 *Shipping:* ${shipping === 0 ? `FREE EXPRESS (${formatCurrency(freeThreshold)}+ Unlocked)` : formatCurrency(shipping)}%0A`;
    waText += `💰 *TOTAL DUE:* ${formatCurrency(total)}%0A`;
    waText += `🏆 *Routine Rank:* ${achievement.levelIcon} ${achievement.levelName} (Streak: ${achievement.streak})%0A`;
    waText += `-----------------------------------%0A`;
    waText += `📍 *DELIVERY DETAILS:*%0A`;
    waText += `• Client: ${name}%0A`;
    if (phone) waText += `• Phone: ${phone}%0A`;
    if (addr) waText += `• Address: ${addr}%0A`;
    waText += `• Destination: ${dest}%0A`;
    if (em) waText += `• Email: ${em}%0A`;
    waText += `• Payment: WhatsApp Concierge / Direct Bank Transfer%0A%0A`;
    waText += `Kindly confirm availability and account details for immediate lab packaging. Thank you! 🙏`;

    // Persist order in local history
    try {
      const orderRecord = {
        id: orderId,
        date: orderDate,
        items: [...cart],
        subtotal,
        shipping,
        total,
        customer: { name, phone, address: addr, country: dest, email: em },
        achievement: {
          level: achievement.level,
          levelName: achievement.levelName,
          streak: achievement.streak
        },
        status: 'Order Received — Dispatch In Preparation'
      };
      const existingOrders = JSON.parse(localStorage.getItem('mr_order_history') || '[]');
      existingOrders.unshift(orderRecord);
      localStorage.setItem('mr_order_history', JSON.stringify(existingOrders));
    } catch(e) {}

    // 1. TRIGGER MULTI-WAVE CELEBRATION CONFETTI
    if (typeof window.triggerConfetti === 'function') {
      window.triggerConfetti({ heavy: true });
      setTimeout(() => {
        if (typeof window.triggerConfetti === 'function') window.triggerConfetti({ heavy: true });
      }, 300);
      setTimeout(() => {
        if (typeof window.triggerConfetti === 'function') window.triggerConfetti({ heavy: true });
      }, 650);
    }

    // 2. Play celebration sound if available
    try {
      if (window.MemoryRehabFX && window.MemoryRehabFX.SoundFX && typeof window.MemoryRehabFX.SoundFX.play === 'function') {
        window.MemoryRehabFX.SoundFX.play('chime');
      }
    } catch(e) {}

    // 3. Show Order Success Modal with Achievement Streak & Level
    const successModal = document.getElementById('orderSuccessModal');
    const successIdBadge = document.getElementById('orderSuccessIdBadge');
    const successSummary = document.getElementById('orderSuccessSummaryBox');
    const successWaLink = document.getElementById('orderSuccessWaLink');

    if (successIdBadge) successIdBadge.textContent = `Order #${orderId}`;
    if (successSummary) {
      successSummary.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-weight:700;">
          <span>Items (${cart.reduce((c, i) => c + i.quantity, 0)})</span>
          <span style="color:var(--primary);">${formatCurrency(total)}</span>
        </div>
        <div style="color:var(--text-muted); font-size:0.8rem; max-height:80px; overflow-y:auto; line-height:1.4;">
          ${cart.map(i => `• ${i.quantity}x ${i.name}`).join('<br/>')}
        </div>
        <div style="margin-top:8px; padding-top:6px; border-top:1px dashed var(--glass-border); font-size:0.8rem; color:var(--text-muted);">
          📍 Destination: <strong>${addr ? `${addr}, ${dest}` : dest}</strong>
        </div>

        <!-- GAMIFIED ACHIEVEMENT STREAK & LEVEL CARD -->
        <div class="achievement-streak-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span class="streak-fire-pill">🔥 <strong>Streak: ${achievement.streak} Order${achievement.streak > 1 ? 's' : ''}</strong></span>
            <span class="streak-badge-pill">${achievement.levelIcon} ${achievement.levelName}</span>
          </div>
          <div class="streak-meter-track">
            <div class="streak-meter-fill" style="width:${achievement.progressPercent}%;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-muted); margin-bottom:8px;">
            <span>Level ${achievement.level} of 5</span>
            <span>${achievement.nextLevelText}</span>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:8px;">
            ${achievement.badges.map(b => `<span class="unlocked-badge-chip">${b.icon} ${b.label}</span>`).join('')}
          </div>
          <div class="streak-perk-box">
            🎁 <strong>Perk Unlocked:</strong> ${achievement.perkText}
          </div>
        </div>
      `;
    }
    const waUrl = `https://wa.me/2349112488271?text=${waText}`;
    if (successWaLink) successWaLink.href = waUrl;

    // Close checkout and cart
    closeCheckout();
    closeCartDrawer();

    // Reset cart
    cart = [];
    saveCartLocally();
    renderCart();

    // Show confirmation modal
    if (successModal) {
      successModal.style.display = 'grid';
    }

    // Open WhatsApp
    window.open(waUrl, '_blank');
    showToast(`Order #${orderId} confirmed! Opening WhatsApp...`, '🎉');
  }

  // Direct Order via WhatsApp buttons (Cart drawer & PDP)
  const whatsappOrderBtns = document.querySelectorAll('.whatsapp-cart-btn, #whatsappOrderBtn');
  whatsappOrderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!cart || cart.length === 0) {
        window.open('https://wa.me/2349112488271?text=Hello%20Memory%20Rehab!%20%F0%9F%8C%BF%20I%20would%20like%20to%20inquire%20about%20your%20clinical%20barrier%20skincare%20routines.', '_blank');
        return;
      }
      const checkoutModal = document.getElementById('checkoutModal');
      if (checkoutModal) {
        checkoutModal.style.display = 'grid';
        refreshCheckoutSummary();
      } else {
        completeOrderFlow({ method: 'whatsapp' });
      }
    });
  });

  // Checkout modal controls
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
  const checkoutCancelBtn = document.getElementById('checkoutCancelBtn');
  const checkoutWhatsAppBtn = document.getElementById('checkoutWhatsAppBtn');
  const checkoutPayBtn = document.getElementById('checkoutPayBtn');
  const checkoutCountry = document.getElementById('checkoutCountry');
  const checkoutEmail = document.getElementById('checkoutEmail');
  const checkoutShippingCost = document.getElementById('checkoutShippingCost');
  const checkoutSubtotal = document.getElementById('checkoutSubtotal');
  const checkoutTotalDisplay = document.getElementById('checkoutTotalDisplay');

  function closeCheckout() {
    if (checkoutModal) checkoutModal.style.display = 'none';
  }

  checkoutCloseBtn?.addEventListener('click', closeCheckout);
  checkoutCancelBtn?.addEventListener('click', closeCheckout);
  checkoutCountry?.addEventListener('change', refreshCheckoutSummary);
  document.getElementById('checkoutAddress')?.addEventListener('input', refreshCheckoutSummary);

  // Instant WhatsApp Order from checkout modal
  checkoutWhatsAppBtn?.addEventListener('click', () => {
    completeOrderFlow({ method: 'whatsapp' });
  });

  // Pay Online (Card / Paystack) with seamless WhatsApp Concierge fallback
  checkoutPayBtn?.addEventListener('click', async () => {
    if (cart.length === 0) { showToast('Your bag is empty!', '⚠️'); return; }
    const subtotal = cart.reduce((s, it) => s + Number(it.price) * it.quantity, 0);
    const total = subtotal + activeShippingCost;
    const email = (checkoutEmail && checkoutEmail.value.trim()) || '';

    // If customer entered email and Paystack is live, attempt initiation
    if (email) {
      try {
        const resp = await fetch('/api/payments/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total, email })
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.data && data.data.authorization_url) {
            window.location.href = data.data.authorization_url;
            return;
          }
        }
      } catch (e) { /* API unavailable — fall through seamlessly */ }
    }

    // Paystack is not yet configured or failed: seamlessly fallback to WhatsApp Order with full details and confetti!
    showToast('Connecting you to WhatsApp Concierge for instant confirmation & dispatch...', '🌿');
    completeOrderFlow({ method: 'whatsapp' });
  });

  // Order Success Modal controls
  const orderSuccessModal = document.getElementById('orderSuccessModal');
  const orderSuccessCloseBtn = document.getElementById('orderSuccessCloseBtn');
  const orderSuccessContinueBtn = document.getElementById('orderSuccessContinueBtn');

  function closeOrderSuccess() {
    if (orderSuccessModal) orderSuccessModal.style.display = 'none';
  }
  orderSuccessCloseBtn?.addEventListener('click', closeOrderSuccess);
  orderSuccessContinueBtn?.addEventListener('click', closeOrderSuccess);

  // Routine Filter Tabs
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');
      applyProductFilter(filter);
    });
  });

  function applyProductFilter(category) {
    productCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      if (category === 'all' || cardCategory === category) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.style.display = 'none';
      }
    });
  }

  // --- 9. QUICK VIEW MODAL (ON INDEX.HTML) ---
  const quickViewModal = document.getElementById('quickViewModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalImg = document.getElementById('modalImg');
  const modalCategoryTag = document.getElementById('modalCategoryTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalRating = document.getElementById('modalRating');
  const modalDescription = document.getElementById('modalDescription');
  const modalIngredients = document.getElementById('modalIngredients');
  const modalAddCartBtn = document.getElementById('modalAddCartBtn');
  const modalViewFullBtn = document.getElementById('modalViewFullBtn');

  let activeModalProduct = null;

  function openQuickView(card) {
    if (!quickViewModal || !card) return;

    activeModalProduct = {
      id: card.dataset.id,
      name: card.dataset.name,
      price: card.dataset.price,
      image: card.dataset.image,
      size: card.dataset.size,
      rating: card.dataset.rating,
      reviews: card.dataset.reviews,
      description: card.dataset.description,
      ingredients: card.dataset.ingredients,
      step: card.dataset.step
    };

    if (modalImg) modalImg.src = activeModalProduct.image;
    if (modalCategoryTag) modalCategoryTag.textContent = `${activeModalProduct.step || 'ROUTINE'} • ${activeModalProduct.size}`;
    if (modalTitle) modalTitle.textContent = activeModalProduct.name;
    if (modalPrice) modalPrice.textContent = formatCurrency(Number(activeModalProduct.price));
    if (modalRating) modalRating.textContent = `★★★★★ ${activeModalProduct.rating} (${activeModalProduct.reviews} reviews)`;
    if (modalDescription) modalDescription.textContent = activeModalProduct.description;

    if (modalIngredients && activeModalProduct.ingredients) {
      modalIngredients.innerHTML = activeModalProduct.ingredients
        .split(',')
        .map((ing) => `<span class="ingredient-chip">${ing.trim()}</span>`)
        .join('');
    }

    if (modalViewFullBtn) {
      modalViewFullBtn.href = `product.html?id=${activeModalProduct.id}`;
    }

    quickViewModal.classList.add('open');
    quickViewModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (quickViewModal) {
      quickViewModal.classList.remove('open');
      quickViewModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (quickViewModal) {
    quickViewModal.addEventListener('click', (e) => {
      if (e.target === quickViewModal) closeModal();
    });
  }

  // Quick view buttons use delegated handling (see bottom of this file) to avoid per-element listeners.

  if (modalAddCartBtn) {
    modalAddCartBtn.addEventListener('click', () => {
      if (activeModalProduct) {
        addToCart(activeModalProduct);
        closeModal();
      }
    });
  }

  // Delegated click handlers (robust fallback for dynamic content)
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.card-add-cart-btn');
    if (addBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = addBtn.closest('.product-card');
      if (!card) return;
      const product = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: Number(card.dataset.price || card.getAttribute('data-price') || 0),
        image: card.dataset.image || card.getAttribute('data-image'),
        size: card.dataset.size
      };
      addToCart(product);
      return;
    }
    // Wishlist toggle (delegated)
    const wishBtn = e.target.closest('.card-wishlist-btn');
    if (wishBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = wishBtn.closest('.product-card');
      if (!card) return;
      const id = card.dataset.id || card.getAttribute('data-id');
      const product = {
        id: id,
        name: card.dataset.name || card.querySelector('.card-title')?.textContent || 'Formulation',
        price: Number(card.dataset.price || card.getAttribute('data-price') || 42000),
        originalPrice: Number(card.dataset.originalPrice || card.dataset.origPrice || 52000),
        image: card.dataset.image || card.querySelector('img')?.getAttribute('src') || 'photo_2026-09-09_17-33-58.jpg',
        size: card.dataset.size || '30ml',
        step: card.dataset.step || card.querySelector('.step-badge')?.textContent || 'Step 3: Hydrate & Lock',
        skinType: card.dataset.skinType || 'Barrier Rehabilitation Care'
      };
      if (typeof window.toggleWishlist === 'function') {
        window.toggleWishlist(product);
      }
      return;
    }

    const quickBtn = e.target.closest('.card-quick-view-btn');
    if (quickBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = quickBtn.closest('.product-card');
      if (card) openQuickView(card);
      return;
    }

    // Gallery quick add (delegated)
    const galBtn = e.target.closest('.gallery-tile-btn');
    if (galBtn) {
      e.preventDefault();
      e.stopPropagation();
      const tile = galBtn.closest('.gallery-tile');
      if (!tile) return;
      const product = {
        id: 'gal-' + Date.now(),
        name: tile.dataset.name || 'Botanical Formulation',
        price: Number(tile.dataset.price || 32000),
        image: tile.dataset.image || tile.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1') || 'photo_2026-09-09_17-33-58.jpg',
        size: 'Full Size'
      };
      addToCart(product);
      return;
    }

    const signBtn = e.target.closest('#userAuthPill') || e.target.closest('.user-auth-pill') || e.target.closest('#userAuthText');
    if (signBtn) {
      e.preventDefault();
      // open auth page
      window.location.href = 'auth.html';
      return;
    }

    // Card body navigation: clicking a card (but not its buttons) should navigate to PDP
    const cardClick = e.target.closest('.product-card');
    if (cardClick && !e.target.closest('button') && !e.target.closest('a')) {
      const id = cardClick.dataset.id;
      // subtle focus/glow cue
      document.querySelectorAll('.product-card').forEach(c => c.classList.remove('card-glow-active'));
      cardClick.classList.add('card-glow-active');
      window.location.href = `product.html?id=${id}`;
      return;
    }
  });

  // --- 10. PRODUCT DETAIL PAGE LOADER (product.html) ---
  window.loadProductDetailPage = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || '1';
    let catalog = window.MEMORY_REHAB_CATALOG || {};
    try {
      const rawCustom = localStorage.getItem('mr_custom_products');
      if (rawCustom) catalog = Object.assign({}, catalog, JSON.parse(rawCustom));
    } catch(e) {}
    const prod = catalog[productId] || catalog['1'] || {};

    // Title and Breadcrumbs
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.textContent = `${prod.name} | Memory Rehab Lab`;
    const pdpBreadcrumbCurrent = document.getElementById('pdpBreadcrumbCurrent');
    if (pdpBreadcrumbCurrent) pdpBreadcrumbCurrent.textContent = prod.name;

    // Hero details
    const pdpMainImg = document.getElementById('pdpMainImg');
    if (pdpMainImg) {
      pdpMainImg.src = prod.image;
      pdpMainImg.alt = prod.name;
    }
    const pdpStepBadge = document.getElementById('pdpStepBadge');
    if (pdpStepBadge) pdpStepBadge.textContent = prod.step;
    const pdpSkinType = document.getElementById('pdpSkinType');
    if (pdpSkinType) {
      const cleanSkinText = (prod.skinType || 'For: All Skin Types').replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, '');
      pdpSkinType.innerHTML = `<img src="favicon-32x32.png" class="tag-favicon" alt="" width="14" height="14" /> ${cleanSkinText}`;
    }
    const pdpTitle = document.getElementById('pdpTitle');
    if (pdpTitle) pdpTitle.textContent = prod.name;
    const pdpRatingNum = document.getElementById('pdpRatingNum');
    if (pdpRatingNum) pdpRatingNum.textContent = prod.rating;
    const pdpReviewCount = document.getElementById('pdpReviewCount');
    if (pdpReviewCount) pdpReviewCount.textContent = `(${prod.reviews} verified customer reviews)`;
    const pdpPrice = document.getElementById('pdpPrice');
    if (pdpPrice) pdpPrice.textContent = formatCurrency(prod.price);
    const pdpOrigPrice = document.getElementById('pdpOrigPrice');
    if (pdpOrigPrice) pdpOrigPrice.textContent = formatCurrency(prod.originalPrice || prod.price);
    const pdpDiscountPill = document.getElementById('pdpDiscountPill');
    if (pdpDiscountPill) {
      const orig = prod.originalPrice || prod.price;
      if (orig > prod.price) {
        const pct = Math.round(((orig - prod.price) / orig) * 100);
        pdpDiscountPill.textContent = `SAVE ${pct}%`;
        pdpDiscountPill.style.display = 'inline-block';
      } else {
        pdpDiscountPill.style.display = 'none';
      }
    }
    const pdpSize = document.getElementById('pdpSize');
    if (pdpSize) pdpSize.textContent = prod.size;
    const pdpSummary = document.getElementById('pdpSummary');
    if (pdpSummary) pdpSummary.textContent = prod.summary;

    // Ingredients chips
    const pdpIngredientChips = document.getElementById('pdpIngredientChips');
    if (pdpIngredientChips && prod.ingredients) {
      pdpIngredientChips.innerHTML = prod.ingredients
        .map(i => `<span class="ingredient-chip">${i}</span>`)
        .join('');
    }

    // Clinical stats
    const pdpClinicalGrid = document.getElementById('pdpClinicalGrid');
    if (pdpClinicalGrid && prod.clinical) {
      pdpClinicalGrid.innerHTML = prod.clinical
        .map(
          c => `
        <div class="pdp-clinical-card">
          <div class="pdp-clinical-stat">${c.val}</div>
          <div class="pdp-clinical-desc">${c.desc}</div>
        </div>
      `
        )
        .join('');
    }

    // Clinical Metrics
    if (prod.clinical && prod.clinical.length >= 3) {
      const m1V = document.getElementById('metric1Val');
      const m1D = document.getElementById('metric1Desc');
      if (m1V) m1V.textContent = prod.clinical[0].val;
      if (m1D) m1D.textContent = prod.clinical[0].desc;

      const m2V = document.getElementById('metric2Val');
      const m2D = document.getElementById('metric2Desc');
      if (m2V) m2V.textContent = prod.clinical[1].val;
      if (m2D) m2D.textContent = prod.clinical[1].desc;

      const m3V = document.getElementById('metric3Val');
      const m3D = document.getElementById('metric3Desc');
      if (m3V) m3V.textContent = prod.clinical[2].val;
      if (m3D) m3D.textContent = prod.clinical[2].desc;
    }

    // Actives Grid
    const pdpActivesGrid = document.getElementById('pdpActivesGrid');
    if (pdpActivesGrid && prod.actives) {
      pdpActivesGrid.innerHTML = prod.actives
        .map(
          a => `
        <div class="pdp-active-glass-card">
          <div class="pdp-active-icon"><img src="favicon-32x32.png" class="pdp-active-favicon-img" alt="" width="22" height="22" /></div>
          <h4>${a.name}</h4>
          <p>${a.desc}</p>
        </div>
      `
        )
        .join('');
    }

    // INCI formula
    const pdpInciText = document.getElementById('pdpInciText');
    if (pdpInciText && prod.inci) {
      pdpInciText.textContent = prod.inci;
    }

    // Reviews list
    const pdpReviewsList = document.getElementById('pdpReviewsList');
    if (pdpReviewsList && prod.reviewsList) {
      pdpReviewsList.innerHTML = prod.reviewsList
        .map(
          r => `
        <div class="pdp-review-card">
          <div class="pdp-review-header">
            <span class="pdp-reviewer-name">${r.name}</span>
            <span class="verified-buyer-badge">✓ Verified Buyer (${r.type})</span>
          </div>
          <div class="stars" style="color: var(--accent-gold); font-size: 0.85rem;">★★★★★</div>
          <p class="pdp-review-body">${r.body}</p>
        </div>
      `
        )
        .join('');
    }

    // PDP Quantity Stepper and Add to Bag
    let pdpQty = 1;
    const pdpQtyVal = document.getElementById('pdpQtyVal');
    const pdpQtyMinus = document.getElementById('pdpQtyMinus');
    const pdpQtyPlus = document.getElementById('pdpQtyPlus');
    const pdpBtnPrice = document.getElementById('pdpBtnPrice');
    const pdpAddBagBtn = document.getElementById('pdpAddBagBtn');

    function updatePdpPrice() {
      if (pdpQtyVal) pdpQtyVal.textContent = pdpQty;
      if (pdpBtnPrice) pdpBtnPrice.textContent = formatCurrency(prod.price * pdpQty);
    }

    // Initialize button price immediately
    updatePdpPrice();

    if (pdpQtyMinus && !pdpQtyMinus.dataset.bound) {
      pdpQtyMinus.dataset.bound = 'true';
      pdpQtyMinus.addEventListener('click', () => {
        if (pdpQty > 1) {
          pdpQty -= 1;
          updatePdpPrice();
        }
      });
    }

    if (pdpQtyPlus && !pdpQtyPlus.dataset.bound) {
      pdpQtyPlus.dataset.bound = 'true';
      pdpQtyPlus.addEventListener('click', () => {
        pdpQty += 1;
        updatePdpPrice();
      });
    }

    if (pdpAddBagBtn && !pdpAddBagBtn.dataset.bound) {
      pdpAddBagBtn.dataset.bound = 'true';
      pdpAddBagBtn.addEventListener('click', () => {
        addToCart(prod, pdpQty);
      });
    }

    // PDP Routine Wishlist Toggle
    const pdpWishlistBtn = document.getElementById('pdpWishlistBtn');
    if (pdpWishlistBtn) {
      function syncPdpWishlistState() {
        if (typeof window.isInWishlist === 'function' && window.isInWishlist(prod.id)) {
          pdpWishlistBtn.classList.add('active');
          pdpWishlistBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>Saved to Routine Wishlist</span>
          `;
        } else {
          pdpWishlistBtn.classList.remove('active');
          pdpWishlistBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>Save to Routine Wishlist</span>
          `;
        }
      }
      syncPdpWishlistState();
      pdpWishlistBtn.onclick = () => {
        if (typeof window.toggleWishlist === 'function') {
          window.toggleWishlist(prod);
          syncPdpWishlistState();
        }
      };
    }
  };

  // --- 11. REAL-TIME CLOUD STORE SYNC (Firebase Firestore) ---
  function initLiveCloudSync() {
    const firebaseConfig = {
      apiKey: "AIzaSyDC4eeTzJlyoRjgDM6HCDsuI7OPH-r_hx0",
      authDomain: "memory-rehab.firebaseapp.com",
      projectId: "memory-rehab",
      storageBucket: "memory-rehab.firebasestorage.app",
      messagingSenderId: "447945885806",
      appId: "1:447945885806:web:6b1e08da09c102671d3e7f"
    };

    if (typeof firebase !== 'undefined' && firebase.initializeApp && (!firebase.apps || !firebase.apps.length)) {
      try {
        firebase.initializeApp(firebaseConfig);
      } catch (e) {}
    }

    if (typeof firebase === 'undefined' || typeof firebase.firestore !== 'function') return;

    try {
      const db = firebase.firestore();

      // Listen to store announcements & promos + theme colours
      db.collection('store_settings').doc('general').onSnapshot((doc) => {
        if (doc.exists) {
          const settings = doc.data();
          applyStorefrontTextSettings(settings);
          if (settings.announcement) {
            const marqueeTracks = document.querySelectorAll('.marquee-track');
            marqueeTracks.forEach((track) => {
              const items = track.querySelectorAll('.marquee-item');
              if (items.length > 0) {
                items[0].innerHTML = `<span class="badge-dot"></span> ${settings.announcement}`;
              }
            });
          }
          if (settings.promoCode) {
            document.querySelectorAll('.face-welcome-code').forEach((el) => {
              el.textContent = settings.promoCode;
            });
          }
          // ── Apply light mode accent colour ──
          if (settings.themeAccentColor) {
            applyStorefrontThemeColor(settings.themeAccentColor);
          }
          // ── Apply dark mode palette ──
          if (settings.darkTheme) {
            applyDarkThemePalette(settings.darkTheme);
          }
          // ── Sync Auto-Theme Scheduler Settings ──
          if (settings.autoThemeEnabled !== undefined) {
            initAutoThemeScheduler({
              enabled: !!settings.autoThemeEnabled,
              interval: settings.autoThemeInterval || 30,
              mode: settings.autoThemeMode || 'adaptive',
              smooth: settings.autoThemeSmooth !== false
            });
          }
          // ── Sync Maintenance Mode ──
          if (typeof initMaintenanceMode === 'function') {
            initMaintenanceMode(settings);
          }
          // ── Sync Free Shipping Threshold live from Firestore ──
          if (settings.freeShippingThreshold && !isNaN(settings.freeShippingThreshold) && Number(settings.freeShippingThreshold) > 0) {
            try {
              const existing = JSON.parse(localStorage.getItem('mr_store_settings') || '{}');
              existing.freeShippingThreshold = Number(settings.freeShippingThreshold);
              localStorage.setItem('mr_store_settings', JSON.stringify(existing));
              // Refresh shipping progress bar if cart is open
              if (typeof updateShippingProgress === 'function') {
                const cartSubtotal = cart ? cart.reduce((s, it) => s + Number(it.price) * it.quantity, 0) : 0;
                updateShippingProgress(cartSubtotal);
              }
            } catch(e) {}
          }
        }
      }, (err) => console.warn('Store settings sync:', err.message));

      // Listen to live product price & title changes
      db.collection('products').onSnapshot((snapshot) => {
        if (snapshot.empty) return;

        snapshot.forEach((doc) => {
          const id = doc.id;
          const liveData = doc.data();

          // Update in-memory catalog
          if (MEMORY_REHAB_CATALOG[id]) {
            if (liveData.price !== undefined) MEMORY_REHAB_CATALOG[id].price = parseFloat(liveData.price);
            if (liveData.originalPrice !== undefined) MEMORY_REHAB_CATALOG[id].originalPrice = parseFloat(liveData.originalPrice);
            if (liveData.name) MEMORY_REHAB_CATALOG[id].name = liveData.name;
            if (liveData.badge) MEMORY_REHAB_CATALOG[id].badge = liveData.badge;
          }

          // Update storefront cards on index.html
          const card = document.querySelector(`.product-card[data-id="${id}"]`);
          if (card) {
            if (liveData.price !== undefined) {
              const curPriceEl = card.querySelector('.current-price');
              if (curPriceEl) curPriceEl.textContent = formatCurrency(liveData.price);
            }
            if (liveData.originalPrice !== undefined) {
              const origPriceEl = card.querySelector('.original-price');
              if (origPriceEl) origPriceEl.textContent = formatCurrency(liveData.originalPrice);
            }
            if (liveData.name) {
              const titleEl = card.querySelector('.card-title');
              if (titleEl) titleEl.textContent = liveData.name;
            }
          }
        });
      }, (err) => console.warn('Product live sync:', err.message));
    } catch (err) {
      console.warn('Live Cloud Sync setup:', err.message);
    }
  }

  // Check locally cached auto-theme config on load
  try {
    const cachedCfg = localStorage.getItem('mr_autotheme_config');
    if (cachedCfg) {
      initAutoThemeScheduler(JSON.parse(cachedCfg));
    }
  } catch(e) {}

  // Defer live cloud sync until after initial paint/idle to avoid blocking main thread on page load
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => initLiveCloudSync(), { timeout: 3000 });
  } else {
    setTimeout(() => initLiveCloudSync(), 1500);
  }

  // Initialize cart on load
  renderCart();
});

// -----------------------------
// Debug overlay & OCR lazy-load
// -----------------------------

// Small debug console used to capture runtime errors and developer messages
window.__mr_debug = {
  enabled: false,
  show(msg, level = 'log') {
    // Disabled in production to prevent mobile overlay intrusions
    return;
  }
};

// Hook window errors and promise rejections
window.addEventListener('error', (ev) => {
  try { window.__mr_debug.show(ev.message + ' — ' + (ev.filename || '' ) + ':' + (ev.lineno||''), 'error'); } catch(e){}
});

window.addEventListener('unhandledrejection', (ev) => {
  try { window.__mr_debug.show('Unhandled Rejection: ' + (ev.reason && ev.reason.stack ? ev.reason.stack : ev.reason), 'error'); } catch(e){}
});

// Wrap console.error to also show overlay
(function(){
  const origErr = console.error.bind(console);
  console.error = function(...args){
    try { window.__mr_debug.show(args.map(a=> (typeof a === 'string'? a : JSON.stringify(a))).join(' '), 'error'); } catch(e){}
    origErr(...args);
  };
})();

// Debug overlay controls
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'debugCloseBtn') {
    const overlay = document.getElementById('debugOverlay'); if (overlay) overlay.style.display='none';
  }
  if (e.target && e.target.id === 'debugClearBtn') {
    const msgs = document.getElementById('debugMessages'); if (msgs) msgs.innerHTML = '';
  }
});

// OCR lazy loader and scanner
async function loadTesseractLocal() {
  if (window.Tesseract && window.Tesseract.createWorker) return window.Tesseract;
  // prefer local copy under ./libs/
  const localPath = './libs/tesseract.min.js';
  try {
    const r = await fetch(localPath, { method: 'HEAD' });
    if (r.ok) {
      await new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = localPath;
        s.onload = res; s.onerror = rej; document.body.appendChild(s);
      });
      window.__mr_debug.show('Tesseract loaded from local libs', 'info');
      return window.Tesseract;
    }
  } catch (e) {
    window.__mr_debug.show('Local Tesseract not found: ' + e.message, 'warn');
  }

  // Fallback: attempt to load from CDN (may be blocked offline)
  const cdn = 'https://unpkg.com/tesseract.js@v2.1.5/dist/tesseract.min.js';
  try {
    await new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = cdn; s.onload = res; s.onerror = rej; document.body.appendChild(s);
    });
    window.__mr_debug.show('Tesseract loaded from CDN', 'info');
    return window.Tesseract;
  } catch (e) {
    window.__mr_debug.show('Failed to load Tesseract from CDN: ' + e.message, 'error');
    throw new Error('Tesseract not available');
  }
}

async function scanImagesWithOCR(limit = 8) {
  try {
    const T = await loadTesseractLocal();
    if (!T || !T.createWorker) throw new Error('Tesseract worker API missing');

    const worker = T.createWorker({
      corePath: './libs/tesseract-core.wasm.js',
      workerPath: './libs/worker.min.js',
      langPath: './libs/lang',
      gzip: false
    });

    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    const imgs = Array.from(document.querySelectorAll('.product-card img, .gallery-tile img')).slice(0, limit);
    for (const img of imgs) {
      try {
        const src = img.src || img.getAttribute('data-src');
        if (!src) continue;
        window.__mr_debug.show('OCR: scanning ' + src, 'info');
        const { data } = await worker.recognize(src);
        const text = (data && data.text) ? data.text.trim() : '';
        window.__mr_debug.show('OCR result: ' + text.split('\n').slice(0,2).join(' | '), 'info');
        const candidate = text.split('\n').map(s=>s.trim()).filter(Boolean)[0];
        if (candidate && candidate.length > 3) {
          const card = img.closest('.product-card') || img.closest('.gallery-tile');
          if (card) {
            card.dataset.name = candidate;
            const titleEl = card.querySelector('.card-title');
            if (titleEl) titleEl.textContent = candidate;
          }
        }
      } catch (ocrErr) {
        window.__mr_debug.show('OCR item failed: ' + (ocrErr.message||ocrErr), 'warn');
      }
    }

    await worker.terminate();
    window.__mr_debug.show('OCR scan complete', 'info');
  } catch (err) {
    window.__mr_debug.show('OCR setup failed: ' + (err.message||err), 'error');
  }
}

// Wire Scan Images button
document.addEventListener('DOMContentLoaded', () => {
  // Detect Android user agents and add a body class so styles can be scoped
  try {
    if (/Android/i.test(navigator.userAgent || '')) {
      document.body.classList.add('platform-android');
    } else {
      document.body.classList.remove('platform-android');
    }
  } catch (e) { /* ignore */ }

  const scanBtn = document.getElementById('scanImagesBtn');
  if (scanBtn) {
    scanBtn.addEventListener('click', () => {
      if ('requestIdleCallback' in window) requestIdleCallback(() => scanImagesWithOCR(10), { timeout: 4000 });
      else setTimeout(() => scanImagesWithOCR(10), 600);
      window.__mr_debug.show('Scheduled OCR scan', 'info');
    });
  }

  // Initialize Storefront Dynamic Catalog Hydration
  hydrateStorefrontCatalog();

  // Initialize Barrier Glow Ritual Video Showcase
  initRitualVideoPlayer();

  // Initialize Instant Live Product Search
  initLiveProductSearch();
});

// ═══════════════════════════════════════════════════════════════
//  BARRIER GLOW RITUAL VIDEO SHOWCASE CONTROLLER (Low-End Friendly)
// ═══════════════════════════════════════════════════════════════
function initRitualVideoPlayer() {
  const video = document.getElementById('ritualVideoPlayer');
  if (!video) return;

  const playToggle = document.getElementById('ritualPlayToggle');
  const pauseIcon = document.getElementById('ritualPauseIcon');
  const playIcon = document.getElementById('ritualPlayIcon');
  const muteToggle = document.getElementById('ritualMuteToggle');
  const mutedIcon = document.getElementById('ritualMutedIcon');
  const soundIcon = document.getElementById('ritualSoundIcon');
  const timeDisplay = document.getElementById('ritualTimeDisplay');
  const stepBtns = document.querySelectorAll('.ritual-step-jump-btn');

  // Play / Pause Toggle
  if (playToggle) {
    playToggle.addEventListener('click', () => {
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }

  // Mobile autoplay assurance
  video.muted = true;
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      const playOnFirstInteraction = () => {
        video.play().catch(() => {});
      };
      window.addEventListener('touchstart', playOnFirstInteraction, { once: true, passive: true });
      window.addEventListener('scroll', playOnFirstInteraction, { once: true, passive: true });
      window.addEventListener('click', playOnFirstInteraction, { once: true });
    });
  }

  video.addEventListener('play', () => {
    if (pauseIcon) pauseIcon.style.display = 'block';
    if (playIcon) playIcon.style.display = 'none';
  });

  video.addEventListener('pause', () => {
    if (pauseIcon) pauseIcon.style.display = 'none';
    if (playIcon) playIcon.style.display = 'block';
  });

  // Mute / Unmute Toggle
  if (muteToggle) {
    muteToggle.addEventListener('click', () => {
      video.muted = !video.muted;
      if (video.muted) {
        if (mutedIcon) mutedIcon.style.display = 'block';
        if (soundIcon) soundIcon.style.display = 'none';
      } else {
        if (mutedIcon) mutedIcon.style.display = 'none';
        if (soundIcon) soundIcon.style.display = 'block';
      }
    });
  }

  // Quick Jump Step Buttons
  stepBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const time = parseFloat(btn.dataset.time) || 0;
      video.currentTime = time;
      if (video.paused) video.play();
      stepBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Timeupdate: format time and highlight active step
  video.addEventListener('timeupdate', () => {
    const cur = video.currentTime;
    const dur = video.duration || 9;
    const curMin = Math.floor(cur / 60);
    const curSec = Math.floor(cur % 60).toString().padStart(2, '0');
    const durMin = Math.floor(dur / 60);
    const durSec = Math.floor(dur % 60).toString().padStart(2, '0');

    if (timeDisplay) {
      timeDisplay.textContent = `${curMin}:${curSec} / ${durMin}:${durSec}`;
    }

    // Determine active step
    let activeIdx = 0;
    if (cur >= 6.0) {
      activeIdx = 2; // Step 3 Glow
    } else if (cur >= 2.8) {
      activeIdx = 1; // Step 2 Rub/Melt
    } else {
      activeIdx = 0; // Step 1 Pour
    }

    stepBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === activeIdx);
    });
  });
}

// ═══════════════════════════════════════════════════════════════
//  DYNAMIC STOREFRONT CATALOG HYDRATION (Admin Changes Sync Live)
// ═══════════════════════════════════════════════════════════════
function hydrateStorefrontCatalog() {

  try {
    const rawCustom = localStorage.getItem('mr_custom_products');
    let catalog = window.MEMORY_REHAB_CATALOG || {};

    if (rawCustom) {
      const customProducts = JSON.parse(rawCustom);
      // Merge with global catalog
      window.MEMORY_REHAB_CATALOG = Object.assign({}, catalog, customProducts);
      catalog = window.MEMORY_REHAB_CATALOG;
    }

    const grid = document.getElementById('productCardsGrid');
    if (!grid) return;

    Object.keys(catalog).forEach((id) => {
      const p = catalog[id];
      if (!p) return;

      // Auto-normalize legacy/small dollar prices (e.g. 45 -> 45000)
      if (p.price && Number(p.price) > 0 && Number(p.price) <= 100) {
        p.price = Number(p.price) * 1000;
      }
      if (p.originalPrice && Number(p.originalPrice) > 0 && Number(p.originalPrice) <= 100) {
        p.originalPrice = Number(p.originalPrice) * 1000;
      }

      let card = grid.querySelector(`.product-card[data-id="${id}"]`);

      if (card) {
        // Update existing card DOM & data attributes
        card.setAttribute('data-name', p.name || '');
        card.setAttribute('data-price', p.price || 0);
        if (p.originalPrice) card.setAttribute('data-original-price', p.originalPrice);
        if (p.image) card.setAttribute('data-image', p.image);
        if (p.size) card.setAttribute('data-size', p.size);
        if (p.step) card.setAttribute('data-step', p.step);
        if (p.skinType) card.setAttribute('data-skin-type', p.skinType);
        if (p.summary) card.setAttribute('data-description', p.summary);
        if (p.ingredients) {
          const ingStr = Array.isArray(p.ingredients) ? p.ingredients.join(', ') : p.ingredients;
          card.setAttribute('data-ingredients', ingStr);
        }

        const titleEl = card.querySelector('.card-title');
        if (titleEl) titleEl.textContent = p.name;

        const priceEl = card.querySelector('.current-price');
        if (priceEl && p.price !== undefined) priceEl.textContent = formatCurrency(p.price);

        const origPriceEl = card.querySelector('.original-price');
        if (origPriceEl && p.originalPrice) origPriceEl.textContent = formatCurrency(p.originalPrice);

        const imgEl = card.querySelector('.card-media-wrap img');
        if (imgEl && p.image) {
          imgEl.src = p.image;
          imgEl.alt = p.name || '';
        }

        const skinEl = card.querySelector('.skin-type-tag');
        if (skinEl && p.skinType) {
          const cleanSkin = p.skinType.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, '');
          skinEl.innerHTML = `<img src="favicon-32x32.png" class="tag-favicon" alt="" width="14" height="14" /> ${cleanSkin}`;
        }

        const summaryEl = card.querySelector('.card-summary');
        if (summaryEl && p.summary) summaryEl.textContent = p.summary;

        // Stock status
        if (p.inStock === false) {
          card.classList.add('out-of-stock');
          const addBtn = card.querySelector('.card-add-cart-btn');
          if (addBtn) {
            addBtn.disabled = true;
            addBtn.textContent = 'Sold Out';
            addBtn.style.opacity = '0.6';
          }
        }
      } else {
        // This is a NEW formulation added by the store owner!
        const stepSlug = (p.step || '').toLowerCase().includes('step 1')
          ? 'step-1'
          : (p.step || '').toLowerCase().includes('step 2')
          ? 'step-2'
          : (p.step || '').toLowerCase().includes('step 3')
          ? 'step-3'
          : 'body-lip';

        const newCard = document.createElement('article');
        newCard.className = 'product-card';
        newCard.dataset.id = id;
        newCard.dataset.category = stepSlug;
        newCard.dataset.name = p.name || 'New Botanical Formulation';
        newCard.dataset.price = p.price || 45000;
        newCard.dataset.originalPrice = p.originalPrice || 55000;
        newCard.dataset.image = p.image || 'photo_2026-09-09_17-33-58.jpg';
        newCard.dataset.rating = p.rating || '5.0';
        newCard.dataset.reviews = p.reviews || '12';
        newCard.dataset.size = p.size || '30ml';
        newCard.dataset.step = p.step || 'Step 2: Target & Treat';
        newCard.dataset.skinType = p.skinType || '🌿 For: All Skin Types';
        newCard.dataset.description = p.summary || 'Restorative botanical skincare formula.';
        newCard.dataset.ingredients = Array.isArray(p.ingredients) ? p.ingredients.join(', ') : (p.ingredients || 'Botanical Actives');

        const ingChips = (Array.isArray(p.ingredients) ? p.ingredients : ['Botanical Actives'])
          .map(i => `<span class="ingredient-chip">${i.trim()}</span>`).join('');

        newCard.innerHTML = `
          <div class="card-media-wrap">
            <div class="card-badge-row">
              <span class="step-badge">${p.step || 'Routine Step'}</span>
              <span class="card-badge gold">${p.badge || 'New Arrival'}</span>
            </div>
            <button class="card-wishlist-btn" type="button" aria-label="Save to wishlist">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <img src="${p.image || 'photo_2026-09-09_17-33-58.jpg'}" alt="${p.name || ''}" loading="lazy" />
            <button class="card-quick-view-btn" type="button">Quick View</button>
          </div>
          <div class="card-content-wrap">
            <div class="card-category-row">
              <span class="card-category-tag">${p.size || '30ml'}</span>
              <span class="card-rating"><span class="stars">★</span> ${p.rating || '5.0'} <span class="card-review-count">(${p.reviews || '12'})</span></span>
            </div>
            <h3 class="card-title">${p.name || ''}</h3>
            <span class="skin-type-tag"><img src="favicon-32x32.png" class="tag-favicon" alt="" width="14" height="14" /> ${(p.skinType || 'For: All Skin Types').replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, '')}</span>
            <p class="card-summary">${p.summary || ''}</p>
            <div class="card-ingredient-chips">
              ${ingChips}
            </div>
            <div class="card-footer-row">
              <div class="price-container">
                <span class="current-price">${formatCurrency(p.price || 0)}</span>
                <span class="original-price">${formatCurrency(p.originalPrice || p.price || 0)}</span>
              </div>
              <button class="card-add-cart-btn" type="button" aria-label="Add ${p.name || ''} to cart">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Add
              </button>
            </div>
          </div>
        `;
        grid.appendChild(newCard);
      }
    });

    // Hydrate store settings (Announcements, Promo code, homepage copy)
    const rawSettings = localStorage.getItem('mr_store_settings');
    if (rawSettings) {
      const settings = JSON.parse(rawSettings);
      applyStorefrontTextSettings(settings);
      if (settings.announcement) {
        const marqueeTracks = document.querySelectorAll('.marquee-track');
        marqueeTracks.forEach(track => {
          const items = track.querySelectorAll('.marquee-item');
          if (items.length > 0) {
            items[0].innerHTML = `<span class="badge-dot"></span> ${settings.announcement}`;
          }
        });
      }
      initMaintenanceMode(settings);
    } else {
      initMaintenanceMode();
    }

    if (typeof window.syncWishlistCardButtons === 'function') {
      window.syncWishlistCardButtons();
    }
  } catch (err) {
    console.warn('[Memory Rehab] Hydration notice:', err.message);
  }
}

// Listen for storage events across tabs (Admin tab -> Store tab instant live sync)
window.addEventListener('storage', (e) => {
  if (e.key === 'mr_custom_products' || e.key === 'mr_store_settings') {
    hydrateStorefrontCatalog();
    initMaintenanceMode();
  }
  if (e.key === 'mr_wishlist') {
    wishlist = loadPersistedWishlist();
    updateWishlistBadges();
    syncWishlistCardButtons();
    if (typeof initWishlistPage === 'function') initWishlistPage();
  }
});

// ═══════════════════════════════════════════════════════════════
//  LUXURY MAINTENANCE MODE CONTROLLER
// ═══════════════════════════════════════════════════════════════

let maintenanceCountdownInterval = null;

function initMaintenanceMode(settings) {
  // Never block the admin dashboard
  const path = window.location.pathname.toLowerCase();
  if (path.includes('admin') || path.endsWith('admin.html')) return;

  // Fallback to localStorage or STORE_CONFIG if settings not passed
  if (!settings) {
    try {
      const raw = localStorage.getItem('mr_store_settings');
      settings = raw ? JSON.parse(raw) : (window.STORE_CONFIG || {});
    } catch(e) {
      settings = window.STORE_CONFIG || {};
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const isPreview = urlParams.get('preview') === 'maintenance';
  const bypassParam = urlParams.get('bypass');
  const bypassKey = (settings.maintenanceBypassKey || 'lab2026').trim();

  // Check if query param grants bypass
  if (bypassParam && bypassParam.trim() === bypassKey) {
    sessionStorage.setItem('mr_maintenance_bypass', 'true');
    const cleanUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, document.title, cleanUrl);
  }

  const isStaffBypassed = sessionStorage.getItem('mr_maintenance_bypass') === 'true' ||
                          sessionStorage.getItem('mr_admin_auth') === 'true';

  const isMaintenanceActive = (settings.maintenanceMode === true || isPreview);

  const existingOverlay = document.getElementById('luxuryMaintenanceOverlay');
  const existingBanner = document.getElementById('maintenanceStaffBanner');

  // Case 1: Maintenance is NOT active
  if (!isMaintenanceActive) {
    if (existingOverlay) existingOverlay.remove();
    if (existingBanner) existingBanner.remove();
    document.body.style.overflow = '';
    if (maintenanceCountdownInterval) clearInterval(maintenanceCountdownInterval);
    return;
  }

  // Case 2: Maintenance IS active, but user is staff bypassed (and not previewing)
  if (isStaffBypassed && !isPreview) {
    if (existingOverlay) existingOverlay.remove();
    document.body.style.overflow = '';

    // Show floating top staff preview banner if not already present
    if (!existingBanner) {
      const banner = document.createElement('div');
      banner.id = 'maintenanceStaffBanner';
      banner.className = 'maintenance-staff-banner';
      banner.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <span>⚠️</span>
          <span><strong>Staff Preview:</strong> Maintenance Mode is currently ACTIVE on the storefront.</span>
        </div>
        <div class="maintenance-staff-banner-actions">
          <a href="admin.html" class="maintenance-staff-banner-btn">Manage in Admin</a>
          <button type="button" class="maintenance-staff-banner-btn" id="exitStaffBypassBtn">Lock Customer View</button>
        </div>
      `;
      document.body.prepend(banner);
      document.body.style.paddingTop = (banner.offsetHeight || 38) + 'px';

      document.getElementById('exitStaffBypassBtn')?.addEventListener('click', () => {
        sessionStorage.removeItem('mr_maintenance_bypass');
        window.location.reload();
      });
    }
    return;
  }

  // Case 3: Maintenance IS active and customer is NOT bypassed
  if (existingBanner) existingBanner.remove();
  document.body.style.overflow = 'hidden';

  const title = settings.maintenanceTitle || 'Laboratory Restock & Routine Formulation Update';
  const message = settings.maintenanceMessage || 'Our apothecary lab is currently restocking fresh botanical batches and calibrating clinical formulations. We will return shortly with freshly compounded barrier care.';
  const returnTime = settings.maintenanceEstimatedReturn || '';
  const allowWhatsApp = settings.maintenanceAllowWhatsAppOrders !== false;
  const whatsappNum = settings.whatsappNumber || '+2349112488271';
  const cleanPhone = whatsappNum.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello Memory Rehab team! I saw the store is in maintenance mode and I would like to place an order / make an inquiry.")}`;

  let overlay = existingOverlay;
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'luxuryMaintenanceOverlay';
    overlay.className = 'luxury-maintenance-overlay';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="maintenance-glass-card">
      <div class="maintenance-emblem-wrap">
        <div class="maintenance-emblem-ring"></div>
        <div class="maintenance-emblem-core">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
        </div>
      </div>

      <div class="maintenance-status-badge">
        <span class="status-pulse-dot"></span>
        <span>Apothecary Lab Restock &amp; Calibration</span>
      </div>

      <h1 class="maintenance-title" id="maintDisplayTitle">${title}</h1>
      <p class="maintenance-desc" id="maintDisplayMsg">${message}</p>

      <div id="maintenanceCountdownContainer"></div>

      <div class="maintenance-actions">
        ${allowWhatsApp ? `
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="maintenance-wa-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            Order / Inquire via WhatsApp
          </a>
        ` : ''}

        <div style="width: 100%; max-width: 420px; margin-top: 8px;">
          <p style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">
            Get notified immediately when fresh batches unlock:
          </p>
          <form class="maintenance-subscribe-form" id="maintenanceSubscribeForm">
            <input type="email" class="maintenance-email-input" id="maintenanceEmailInput" placeholder="Enter your email address…" required />
            <button type="submit" class="maintenance-notify-btn">Notify Me</button>
          </form>
          <div id="maintenanceSubscribeFeedback" style="font-size: 0.82rem; font-weight: 700; color: #10b981; margin-top: 8px; display: none;"></div>
        </div>
      </div>

      <div class="maintenance-staff-row">
        <button type="button" class="maintenance-staff-btn" id="openStaffBypassModalBtn">
          🔑 Staff &amp; Pharmacist Access
        </button>
      </div>
    </div>
  `;

  setupMaintenanceCountdown(returnTime);

  // Subscriber Form
  const subForm = document.getElementById('maintenanceSubscribeForm');
  subForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('maintenanceEmailInput');
    const feedback = document.getElementById('maintenanceSubscribeFeedback');
    const email = emailInput?.value.trim();
    if (!email) return;

    try {
      const subs = JSON.parse(localStorage.getItem('mr_maintenance_subscribers') || '[]');
      if (!subs.includes(email)) {
        subs.push(email);
        localStorage.setItem('mr_maintenance_subscribers', JSON.stringify(subs));
      }

      if (typeof firebase !== 'undefined' && firebase.firestore) {
        try {
          await firebase.firestore().collection('maintenance_subscribers').add({
            email,
            subscribedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        } catch(cErr) {}
      }

      if (feedback) {
        feedback.textContent = '✓ You are on the VIP restock priority list!';
        feedback.style.display = 'block';
      }
      emailInput.value = '';
    } catch(err) {
      if (feedback) {
        feedback.textContent = '✓ Thank you! We will notify you when live.';
        feedback.style.display = 'block';
      }
    }
  });

  // Staff Bypass modal prompt
  document.getElementById('openStaffBypassModalBtn')?.addEventListener('click', () => {
    const key = prompt('Memory Rehab Staff Access:\nPlease enter your secret staff bypass passkey:');
    if (!key) return;
    if (key.trim() === bypassKey) {
      sessionStorage.setItem('mr_maintenance_bypass', 'true');
      alert('✓ Staff passkey verified! Entering preview mode.');
      window.location.reload();
    } else {
      alert('❌ Invalid passkey. Access denied.');
    }
  });
}

function setupMaintenanceCountdown(targetTimeString) {
  const container = document.getElementById('maintenanceCountdownContainer');
  if (!container) return;
  if (maintenanceCountdownInterval) clearInterval(maintenanceCountdownInterval);

  if (!targetTimeString || !targetTimeString.trim()) {
    container.innerHTML = '';
    return;
  }

  const targetDate = new Date(targetTimeString);
  if (isNaN(targetDate.getTime())) {
    container.innerHTML = `
      <div style="margin-bottom: 24px; font-size: 0.9rem; font-weight: 700; color: var(--primary);">
        ⏳ Estimated Reopen: <span>${targetTimeString}</span>
      </div>
    `;
    return;
  }

  function updateTicker() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
      container.innerHTML = `
        <div style="margin-bottom: 24px; font-size: 0.9rem; font-weight: 700; color: #10b981;">
          ✨ Laboratory calibration complete! Unlocking shortly.
        </div>
      `;
      if (maintenanceCountdownInterval) clearInterval(maintenanceCountdownInterval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    container.innerHTML = `
      <div class="maintenance-countdown-wrap">
        ${days > 0 ? `
          <div class="maintenance-countdown-box">
            <div class="maintenance-countdown-val">${String(days).padStart(2, '0')}</div>
            <div class="maintenance-countdown-lbl">Days</div>
          </div>
        ` : ''}
        <div class="maintenance-countdown-box">
          <div class="maintenance-countdown-val">${String(hours).padStart(2, '0')}</div>
          <div class="maintenance-countdown-lbl">Hours</div>
        </div>
        <div class="maintenance-countdown-box">
          <div class="maintenance-countdown-val">${String(minutes).padStart(2, '0')}</div>
          <div class="maintenance-countdown-lbl">Mins</div>
        </div>
        <div class="maintenance-countdown-box">
          <div class="maintenance-countdown-val">${String(seconds).padStart(2, '0')}</div>
          <div class="maintenance-countdown-lbl">Secs</div>
        </div>
      </div>
    `;
  }

  updateTicker();
  maintenanceCountdownInterval = setInterval(updateTicker, 1000);
}

// Auto-run maintenance checker on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initMaintenanceMode());
} else {
  initMaintenanceMode();
}

// ═══════════════════════════════════════════════════════════════
//  INSTANT LIVE PRODUCT SEARCH (Mobile & Desktop)
// ═══════════════════════════════════════════════════════════════
function initLiveProductSearch() {
  const searchBtn = document.getElementById('searchToggleBtn');
  const searchModal = document.getElementById('searchModal');
  const searchClose = document.getElementById('closeSearchModal');
  const searchInput = document.getElementById('searchInputField');
  const resultsContainer = document.getElementById('searchResultsContainer');
  const trendingChips = document.querySelectorAll('.search-tag-chip');

  if (!searchModal || !searchInput || !resultsContainer) return;

  function openSearch() {
    searchModal.classList.add('open');
    searchModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 150);
    renderResults(searchInput.value.trim());
  }

  function closeSearch() {
    searchModal.classList.remove('open');
    searchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  searchBtn?.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', closeSearch);
  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('open')) {
      closeSearch();
    }
  });

  trendingChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query || chip.textContent.trim();
      searchInput.value = q;
      renderResults(q);
      searchInput.focus();
    });
  });

  searchInput.addEventListener('input', () => {
    renderResults(searchInput.value.trim());
  });

  function renderResults(query) {
    const catalog = window.MEMORY_REHAB_CATALOG || {};
    const items = Object.entries(catalog).map(([id, p]) => ({ id, ...p }));

    let filtered = items;
    if (query) {
      const q = query.toLowerCase();
      filtered = items.filter(p => {
        const name = (p.name || '').toLowerCase();
        const step = (p.step || '').toLowerCase();
        const skin = (p.skinType || '').toLowerCase();
        const summary = (p.summary || '').toLowerCase();
        const ings = Array.isArray(p.ingredients) ? p.ingredients.join(' ').toLowerCase() : '';
        return name.includes(q) || step.includes(q) || skin.includes(q) || summary.includes(q) || ings.includes(q);
      });
    }

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-empty-note">
          <p>No formulations found matching "<strong>${query.replace(/</g, '&lt;')}</strong>"</p>
          <span style="font-size:0.8rem; color:var(--text-muted); margin-top:4px; display:block;">Try searching for Ceramides, Vitamin C, or Toners.</span>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = filtered.map(p => `
      <a href="product.html?id=${p.id}" class="search-result-row">
        <img src="${p.image || 'photo_2026-09-09_17-33-58.jpg'}" alt="${p.name}" class="search-result-thumb" />
        <div class="search-result-details">
          <span class="search-result-step">${p.step || 'Apothecary Formulation'}</span>
          <strong class="search-result-title">${p.name}</strong>
          <span class="search-result-price">${formatCurrency(p.price || 0)}</span>
        </div>
        <span style="font-size: 0.82rem; font-weight: 700; color: var(--primary); white-space: nowrap;">View →</span>
      </a>
    `).join('');
  }
}



