/**
 * ============================================================================
 *   MEMORY REHAB LAB - EASY STORE & PRODUCT CONFIGURATION FILE
 * ============================================================================
 *   Welcome! You can change ANY product detail, price, photo, or store text
 *   directly in this single file. You do NOT need to touch HTML or CSS!
 * 
 *   HOW TO EDIT:
 *   1. Change a Price: Update the number next to 'price: 42'
 *   2. Change a Name: Edit the text inside 'name: "Your New Cream"'
 *   3. Change an Image: Drop your new JPG in this folder and change 'image: "your_photo.jpg"'
 *   4. Change Discount Code: Edit 'STORE_CONFIG.promoCode' below.
 * ============================================================================
 */

// --- 1. STOREWIDE SETTINGS ---
const STORE_CONFIG = {
  storeName: 'Memory Rehab Lab',
  storeTagline: 'Botanical Skincare',
  brandMonogram: 'MR',
  footerBio: 'High-performance botanical formulas dedicated to skin barrier recovery, soothing balance, and healthy everyday radiance.',
  footerCopyright: '© 2026 Memory Rehab Lab. All rights reserved.',
  footerTagline: 'Crafted with botanical purity & clinical precision.',
  promoCode: 'GLOW15',
  promoDiscount: 15,
  freeShippingThreshold: 70000.00,
  currencySymbol: '₦',
  whatsappNumber: '+2349112488271',
  whatsappDisplay: '+234 911 248 8271',
  whatsappUrl: 'https://wa.me/2349112488271',
  instagramHandle: 'memoryrehab.co',
  instagramUrl: 'https://instagram.com/memoryrehab.co',
  tiktokHandle: 'memoryrehab.co',
  tiktokUrl: 'https://www.tiktok.com/@memoryrehab.co',
  announcements: [
    'WhatsApp Orders & Support: +234 911 248 8271',
    'Follow @memoryrehab.co on Instagram & TikTok',
    'Free Express Shipping On Orders ₦70,000+ • 100% Clean Biocompatible Actives',
    '100% Clean Biocompatible Actives',
    'Dermatologist Approved Barrier Repair',
    'Cruelty-Free and Vegan Certified'
  ],
  maintenanceMode: false,
  maintenanceTitle: 'Laboratory Restock & Routine Formulation Update',
  maintenanceMessage: 'Our apothecary lab is currently restocking fresh botanical batches and calibrating clinical formulations. We will return shortly with freshly compounded barrier care.',
  maintenanceEstimatedReturn: '',
  maintenanceAllowWhatsAppOrders: true,
  maintenanceBypassKey: 'lab2026'
};

// --- 2. PRODUCT CATALOG DATABASE ---
const MEMORY_REHAB_CATALOG = {
  '1': {
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
    clinical: [
      { val: '96%', desc: 'Noticed barrier redness and stinging calmed within 7 days' },
      { val: '98%', desc: 'Reported continuous 48-hour moisture retention without clogging' },
      { val: '92%', desc: 'Observed complete elimination of dry flaking and tight sensation' }
    ],
    actives: [
      { name: 'Ceramides NP & AP', icon: '🧬', desc: 'Identical to skin’s own intercellular lipids. Rebuilds micro-fissures in the stratum corneum to prevent trans-epidermal water loss.' },
      { name: 'Cold-Pressed Raspberry Seed', icon: '🍇', desc: 'Packed with essential Omega-3 and Omega-6 fatty acids that soothe acute inflammatory flare-ups.' },
      { name: 'Phytosqualane', icon: '💧', desc: 'Olive-derived botanical squalane that mimics skin sebum for weightless, velvet-soft nourishment.' }
    ],
    inci: 'Aqua (Water), Rubus Idaeus (Cold-Pressed Raspberry) Seed Oil, Ceramide NP, Ceramide AP, Phytosphingosine, Squalane, Butyrospermum Parkii (Shea) Butter, Hyaluronic Acid, Glycerin, Camellia Sinensis (Green Tea) Leaf Extract, Allantoin, Tocopherol (Vitamin E), Ethylhexylglycerin, Phenoxyethanol.',
    reviewsList: [
      { name: 'Jordan M.', type: 'Compromised Barrier', rating: 5, body: 'Transformed my peeling skin in less than a week. It melts in like whipped silk and stopped all stinging from active treatments.' },
      { name: 'Elena R.', type: 'Dry / Sensitive', rating: 5, body: 'The holy grail for retinoid-damaged barriers. So lightweight yet deeply hydrating throughout the night.' }
    ]
  },
  '2': {
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
    clinical: [
      { val: '94%', desc: 'Noticed a visible increase in skin luminosity and clarity in 14 days' },
      { val: '89%', desc: 'Observed noticeable fading of stubborn post-acne dark marks' },
      { val: '97%', desc: 'Reported zero irritation or burning sensation upon application' }
    ],
    actives: [
      { name: 'Ethyl Ascorbic Acid (15%)', icon: '🍊', desc: 'Ultra-stable Vitamin C derivative that penetrates deep into epidermis without oxidizing or causing sensitization.' },
      { name: 'Japanese Green Tea', icon: '🍃', desc: 'Loaded with EGCG polyphenols that scavenge free radicals and calm environmental UV stress.' },
      { name: 'Triple Molecular Hyaluronic', icon: '💧', desc: 'Multi-depth hydration that plumps surface fine lines while quenching deep cellular moisture reservoirs.' }
    ],
    inci: 'Aqua (Water), 3-O-Ethyl Ascorbic Acid, Camellia Sinensis (Green Tea) Leaf Extract, Sodium Hyaluronate, Ferulic Acid, Citrus Aurantium Dulcis (Blood Orange) Peel Extract, Propanediol, Glycerin, Panthenol, Ethylhexylglycerin.',
    reviewsList: [
      { name: 'Chloe T.', type: 'Hyperpigmentation', rating: 5, body: 'Most Vitamin C serums break me out or smell awful. This one is like pure sunshine. My dark spots faded so fast!' },
      { name: 'Marcus K.', type: 'Dull / Combination', rating: 5, body: 'Instant glassy radiance without feeling tacky under moisturizer. Highly recommended.' }
    ]
  },
  '3': {
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
    clinical: [
      { val: '93%', desc: 'Observed reduction in active blemish swelling within 24 to 48 hours' },
      { val: '91%', desc: 'Reported fewer monthly hormonal breakouts after 3 weeks of use' },
      { val: '95%', desc: 'Experienced clear pores without dry peeling or flaky skin' }
    ],
    actives: [
      { name: 'Micronized Azelaic Acid', icon: '🍇', desc: 'Gently dissolves pore-clogging dead cells and calms the underlying bacteria responsible for papules.' },
      { name: 'Grape Resveratrol', icon: '🍷', desc: 'Powerful polyphenol that stops post-inflammatory hyperpigmentation (PIH) before it starts.' },
      { name: 'Pure Niacinamide', icon: '✨', desc: 'Strengthens pore elasticity and balances excess sebum production.' }
    ],
    inci: 'Aqua (Water), Azelaic Acid, Niacinamide, Resveratrol, Centella Asiatica Extract, Caprylic/Capric Triglyceride, Zinc PCA, Allantoin, Glycerin, Xanthan Gum, Ethylhexylglycerin.',
    reviewsList: [
      { name: 'Maya P.', type: 'Acne-Prone', rating: 5, body: 'I struggled with cystic jawline acne for years. Exile calms the cysts overnight without drying out my barrier!' },
      { name: 'Liam S.', type: 'Sensitive Blemish', rating: 5, body: 'Gentle yet incredibly effective. No peeling or stinging whatsoever.' }
    ]
  },
  '4': {
    id: '4',
    name: 'Vita Sea™ Fruit Complex Exfoliating Toner',
    step: 'Step 1: Prep & Tone',
    badge: 'New Formula',
    price: 36000,
    originalPrice: 44000,
    image: 'photo_2026-09-09_17-33-53.jpg',
    rating: 4.8,
    reviews: 97,
    size: '60ml / 2.0 fl. oz',
    skinType: 'For: Textured & Congested Skin',
    summary: 'Gentle exfoliating fruit toner with Ethyl Ascorbic, Tartaric Acid, and Kurarinone Extract to smooth uneven texture and refine pores.',
    ingredients: ['Tartaric Acid', 'Ethyl Ascorbic', 'Kurarinone', 'Citrus Fruit Blend'],
    clinical: [
      { val: '95%', desc: 'Noticed immediate skin smoothness after first application' },
      { val: '90%', desc: 'Reported refined pores and reduced congestion around T-zone' },
      { val: '98%', desc: 'Agreed the formula feels refreshing and non-sticky' }
    ],
    actives: [
      { name: 'Natural Tartaric Acid', icon: '🍋', desc: 'Fruit-derived AHA that gently unglues dead surface debris without disrupting barrier lipids.' },
      { name: 'Kurarinone Extract', icon: '🌿', desc: 'Rare botanical flavonoid known for purifying and clearing dull complexions.' },
      { name: 'Blood Orange Infusion', icon: '🍊', desc: 'Energizes skin with natural Vitamin C bioflavonoids for immediate radiance.' }
    ],
    inci: 'Aqua (Water), Tartaric Acid, 3-O-Ethyl Ascorbic Acid, Kurarinone Extract, Citrus Limon (Lemon) Peel Extract, Propanediol, Glycerin, Sodium Hydroxide, Ethylhexylglycerin.',
    reviewsList: [
      { name: 'Aaliyah W.', type: 'Textured Skin', rating: 5, body: 'The gentlest exfoliant I have ever used. My skin texture became baby smooth within 4 days.' }
    ]
  },
  '5': {
    id: '5',
    name: 'Jade Lustre™ Youth Elixir Depigmenting Serum',
    step: 'Step 2: Target & Treat',
    badge: 'Staff Pick',
    price: 46000,
    originalPrice: 56000,
    image: 'photo_2026-09-09_17-33-55.jpg',
    rating: 5.0,
    reviews: 89,
    size: '30ml / 1.0 fl. oz',
    skinType: 'For: Dehydrated / Mature Skin',
    summary: 'Supercharged botanical depigmenting serum infused with cucumber peptides, grape seed, and youth elixir botanicals to restore bounce.',
    ingredients: ['Cucumber Peptides', 'Grape Stem Cells', 'Youth Elixir', 'Hyaluronic Acid'],
    clinical: [
      { val: '97%', desc: 'Reported noticeable plumpness and bounce in dehydrated skin' },
      { val: '94%', desc: 'Observed faded sun spots and more uniform complexion tone' },
      { val: '99%', desc: 'Agreed skin looked glowing and dewy all day long' }
    ],
    actives: [
      { name: 'Cucumber Peptides', icon: '🥒', desc: 'Cools inflammation and boosts micro-circulation for a rested, fresh appearance.' },
      { name: 'Grape Stem Cells', icon: '🍇', desc: 'Antioxidant shield that protects epidermal stem cells against UV photo-aging.' },
      { name: 'Jade Botanical Elixir', icon: '✨', desc: 'Patented botanical blend designed to fade stubborn dark spots and discoloration.' }
    ],
    inci: 'Aqua (Water), Cucumis Sativus (Cucumber) Fruit Extract, Vitis Vinifera (Grape) Seed Extract, Sodium Hyaluronate, Niacinamide, Glycerin, Xanthan Gum, Phenoxyethanol.',
    reviewsList: [
      { name: 'Hannah B.', type: 'Dehydrated', rating: 5, body: 'Feels so cooling on the skin! The depigmenting effect is real; my sun spots on my cheekbones are practically gone.' }
    ]
  },
  '6': {
    id: '6',
    name: 'Blue Blooded™ Skin Restoring Toner',
    step: 'Step 1: Prep & Tone',
    badge: 'Hydra Balance',
    price: 34000,
    originalPrice: 40000,
    image: 'photo_2026-09-09_17-33-56.jpg',
    rating: 4.7,
    reviews: 112,
    size: '100ml / 3.4 fl. oz',
    skinType: 'For: Oily & Irritated Skin',
    summary: 'Balancing botanical toner powered by blueberry polyphenols, salicylic acid, and calming allantoin to detoxify pores and rebalance pH.',
    ingredients: ['Blueberry Polyphenols', 'Salicylic Acid 1%', 'Allantoin', 'Sea Minerals'],
    clinical: [
      { val: '92%', desc: 'Reported balanced oil levels and reduced midday shine' },
      { val: '95%', desc: 'Noticed instant calming of irritated, red patches' },
      { val: '90%', desc: 'Experienced clearer pores and less blackhead buildup' }
    ],
    actives: [
      { name: 'Blueberry Polyphenols', icon: '🫐', desc: 'Potent anthocyanins that defend skin against oxidative stress and blue light.' },
      { name: 'Salicylic Acid (BHA)', icon: '💧', desc: 'Oil-soluble exfoliant that penetrates deep into pores to dissolve trapped sebum.' },
      { name: 'Allantoin', icon: '🌿', desc: 'Clinically proven soothing agent that accelerates epidermal barrier renewal.' }
    ],
    inci: 'Aqua (Water), Vaccinium Angustifolium (Blueberry) Fruit Extract, Salicylic Acid, Allantoin, Sodium Hyaluronate, Propanediol, Glycerin, Citric Acid, Ethylhexylglycerin.',
    reviewsList: [
      { name: 'Tyler D.', type: 'Oily / Breakout', rating: 5, body: 'Controls oil without stripping. My skin feels fresh, hydrated, and calm.' }
    ]
  },
  '7': {
    id: '7',
    name: 'Heavenly Buff™ Smoothening Body Milk',
    step: 'Body Rehabilitation',
    badge: 'Velvet Smooth',
    price: 38000,
    originalPrice: 46000,
    image: 'photo_2026-09-09_17-33-52.jpg',
    rating: 4.9,
    reviews: 185,
    size: '250g / 8.8 fl. oz',
    skinType: 'For: Rough / KP & Dry Body Skin',
    summary: 'Velvety body rehabilitation lotion formulated with Lactic Acid, medical-grade Urea, and organic vanilla to gently exfoliate rough patches.',
    ingredients: ['Lactic Acid 8%', 'Urea 5%', 'Cocoa Seed Butter', 'Vanilla Extract'],
    clinical: [
      { val: '98%', desc: 'Saw rough "strawberry skin" and keratosis pilaris smoothed in 10 days' },
      { val: '96%', desc: 'Reported non-greasy, fast absorption with 24-hour hydration' },
      { val: '94%', desc: 'Loved the delicate warm vanilla and cocoa natural scent' }
    ],
    actives: [
      { name: 'Lactic Acid (8%)', icon: '🥛', desc: 'Gentle milk AHA that breaks down rough keratin plugs while attracting moisture to skin.' },
      { name: 'Medical-Grade Urea (5%)', icon: '💧', desc: 'Natural moisturizing factor that restores elastic suppleness to cracked elbows and legs.' },
      { name: 'Raw Cocoa Butter', icon: '🍫', desc: 'Rich emollient butter that forms a breathable protective shield against dry air.' }
    ],
    inci: 'Aqua (Water), Lactic Acid, Urea, Theobroma Cacao (Cocoa) Seed Butter, Caprylic/Capric Triglyceride, Glycerin, Vanilla Planifolia Fruit Extract, Cetearyl Alcohol, Ethylhexylglycerin.',
    reviewsList: [
      { name: 'Grace K.', type: 'Keratosis Pilaris', rating: 5, body: 'Completely eliminated the bumpy texture on the backs of my arms. Silky, non-sticky, and smells divine!' }
    ]
  },
  '8': {
    id: '8',
    name: "Cupid's Pout™ Moisturising Lip Butter",
    step: 'Lip Therapy',
    badge: 'Customer Fave',
    price: 22000,
    originalPrice: 28000,
    image: 'photo_2026-09-09_17-33-57.jpg',
    rating: 4.9,
    reviews: 246,
    size: '15ml / 0.5 fl. oz',
    skinType: 'For: Chapped & Sensitive Lips',
    summary: 'Luscious strawberry lip rehabilitation butter loaded with hyaluronic acid, cold-pressed berry waxes, and Vitamin E to plump and nourish.',
    ingredients: ['Strawberry Seed Oil', 'Vitamin E', 'Hyaluronic Acid', 'Shea Butter'],
    clinical: [
      { val: '99%', desc: 'Reported immediate relief for cracked, chapped lips' },
      { val: '94%', desc: 'Observed fuller, plumper lip appearance without irritation' },
      { val: '97%', desc: 'Loved the non-sticky high-shine glass glaze finish' }
    ],
    actives: [
      { name: 'Cold-Pressed Strawberry Seed', icon: '🍓', desc: 'Rich in linoleic acid that deeply conditions delicate lip tissue.' },
      { name: 'Micronized Hyaluronic', icon: '💧', desc: 'Draws moisture from within to naturally plump fine lip lines.' },
      { name: 'Pure Vitamin E', icon: '✨', desc: 'Antioxidant shield that protects lips against cold weather wind-burn.' }
    ],
    inci: 'Polyisobutene, Fragaria Ananassa (Strawberry) Seed Oil, Butyrospermum Parkii (Shea) Butter, Sodium Hyaluronate, Tocopheryl Acetate (Vitamin E), Flavor (Natural Strawberry).',
    reviewsList: [
      { name: 'Samantha L.', type: 'Chapped Lips', rating: 5, body: 'The only lip product that actually heals my lips overnight during winter. Never leaving home without it.' }
    ]
  },
  '9': {
    id: '9',
    name: 'Palm Culture™ Herbal Black Soap Blend',
    step: 'Step 1: Cleanse',
    badge: 'Artisanal Blend',
    price: 32000,
    originalPrice: 38000,
    image: 'photo_2026-09-09_17-33-47.jpg',
    rating: 4.8,
    reviews: 134,
    size: '250g / 8.8 oz',
    skinType: 'For: Clogged Pores & Impurities',
    summary: 'Traditional whipped herbal black soap blend infused with antioxidant ground coffee, wild neem leaves, and purifying tamarind.',
    ingredients: ['Herbal Black Soap', 'Wild Neem Leaf', 'Arabica Coffee', 'Tamarind'],
    clinical: [
      { val: '94%', desc: 'Felt deep pore detoxification without tight squeaky dryness' },
      { val: '91%', desc: 'Noticed clearer back and chest skin within 12 days' },
      { val: '96%', desc: 'Loved the earthy aromatic cleansing experience' }
    ],
    actives: [
      { name: 'Artisanal Black Soap', icon: '🌿', desc: 'Handcrafted from plantain ash and palm kernel oil for a gentle, mineral-rich cleanse.' },
      { name: 'Wild Neem Leaf', icon: '🍃', desc: 'Centuries-old botanical known to eradicate stubborn congestion and soothe breakouts.' },
      { name: 'Ground Arabica Coffee', icon: '☕', desc: 'Micro-exfoliates surface grime while delivering energizing antioxidants.' }
    ],
    inci: 'Potassium Palm Kernelate, Aqua, Coffea Arabica (Coffee) Seed Powder, Azadirachta Indica (Neem) Leaf Extract, Tamarindus Indica Fruit Extract, Glycerin.',
    reviewsList: [
      { name: 'Derrick O.', type: 'Acne / Body', rating: 5, body: 'Cleared my chest and back breakouts completely. Incredible purifying paste.' }
    ]
  },
  '10': {
    id: '10',
    name: 'Reveal™ Smoothing Strawberry Scrub',
    step: 'Body Polish',
    badge: 'Whipped Polish',
    price: 35000,
    originalPrice: 42000,
    image: 'photo_2026-09-09_17-33-59.jpg',
    rating: 4.9,
    reviews: 178,
    size: '250g / 8.8 oz',
    skinType: 'For: Dull & Flaky Body Skin',
    summary: 'Whipped exfoliating body polish packed with raw organic shea butter, enzymatic papain, and mulberry extract for touchable softness.',
    ingredients: ['Raw Shea Butter', 'Papain Enzyme', 'Mulberry Extract', 'Strawberry Sugar'],
    clinical: [
      { val: '98%', desc: 'Observed touchably soft, glowing skin right out of the shower' },
      { val: '95%', desc: 'Noticed zero scratching or redness from the smooth sugar crystals' },
      { val: '97%', desc: 'Enjoyed long-lasting hydration that eliminated body lotion need' }
    ],
    actives: [
      { name: 'Raw Shea Butter', icon: '🧈', desc: 'Ethically harvested shea that melts at skin temperature to replenish lipid barriers.' },
      { name: 'Papain Fruit Enzyme', icon: '🥭', desc: 'Enzymatically digests stubborn dead skin cells without aggressive scrubbing.' },
      { name: 'Mulberry Extract', icon: '🍇', desc: 'Natural arbutin source that brightens dark elbows, knees, and underarms.' }
    ],
    inci: 'Sucrose, Butyrospermum Parkii (Shea) Butter, Fragaria Vesca (Strawberry) Fruit Extract, Papain, Morus Alba (Mulberry) Root Extract, Glycerin, Caprylic/Capric Triglyceride.',
    reviewsList: [
      { name: 'Jessica V.', type: 'Dry Skin', rating: 5, body: 'Smells like strawberry shortcake and leaves your body so soft and moisturized!' }
    ]
  }
};

// Make available globally across all pages
if (typeof window !== 'undefined') {
  window.STORE_CONFIG = STORE_CONFIG;
  window.MEMORY_REHAB_CATALOG = MEMORY_REHAB_CATALOG;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STORE_CONFIG, MEMORY_REHAB_CATALOG };
}
