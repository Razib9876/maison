import { slugify } from "../lib/format";

export const CATEGORIES = ["Sofa", "Bed", "Almirah", "Table", "Chair"];

const U = (id, w = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

const POOL = {
  Sofa: ["photo-1555041469-a586c61ea9bc", "photo-1493663284031-b7e3aefcae8e", "photo-1586023492125-27b2c045efd7", "photo-1540574163026-643ea20ade25", "photo-1567016432779-094069958ea5"],
  Bed: ["photo-1505693416388-ac5ce068fe85", "photo-1540518614846-7eded433c457", "photo-1616594039964-ae9021a400a0", "photo-1522771739844-6a9f6d5f14af"],
  Almirah: ["photo-1595428774223-ef52624120d2", "photo-1558997519-83ea9252edf8", "photo-1556020685-ae41abfc9365"],
  Table: ["photo-1530018607912-eff2daa1bac4", "photo-1532372320572-cda25653a26d", "photo-1533090481720-856c6e3c1fdc"],
  Chair: ["photo-1567538096630-e0c55bd6374c", "photo-1503602642458-232111445657", "photo-1592078615290-033ee584e267"],
};

export const HERO_IMAGE = U("photo-1618220179428-22790b461013", 2000);
export const CRAFT_IMAGE = U("photo-1524758631624-e2822e304c36", 1400);
export const CATEGORY_IMAGES = {
  Sofa: U(POOL.Sofa[0], 800),
  Bed: U(POOL.Bed[0], 800),
  Almirah: U(POOL.Almirah[0], 800),
  Table: U(POOL.Table[0], 800),
  Chair: U(POOL.Chair[0], 800),
};

const COPY = {
  Sofa: {
    description: "Deep, supportive seating built on a kiln-dried hardwood frame with high-density foam and a hand-finished upholstery. Designed to stay comfortable and keep its shape for years of everyday living.",
    features: ["Kiln-dried hardwood frame", "High-density foam cushions", "Removable, easy-clean covers", "Hand-stitched finishing"],
  },
  Bed: {
    description: "A sturdy, beautifully proportioned bed with a solid frame and reinforced slats. Crafted to stay silent and stable night after night, finished with a smooth hand-polished surface.",
    features: ["Solid wood frame", "Reinforced slat support", "Smooth polish finish", "Easy assembly by our team"],
  },
  Almirah: {
    description: "Generous storage with a clean, modern profile. Smooth-gliding fittings, thoughtful internal layout and a durable finish that resists scratches and humidity.",
    features: ["Moisture-resistant board and finish", "Soft-close hinges and channels", "Adjustable shelves and hanging rail", "Lockable doors"],
  },
  Table: {
    description: "A centrepiece for your living or dining space. Precision-cut, hand-sanded and sealed with a protective coat so it handles daily meals, homework and gatherings with ease.",
    features: ["Heat and stain resistant top", "Hand-sanded edges", "Stable, wobble-free legs", "Protective sealed finish"],
  },
  Chair: {
    description: "Comfort-first seating with a considered shape and a strong frame. Light enough to move around, strong enough to last, finished to match modern interiors.",
    features: ["Ergonomic shape", "Strong joinery", "Scratch-resistant finish", "Non-marking floor feet"],
  },
};

const make = (id, o) => ({
  id,
  slug: slugify(o.name),
  images: [0, 1, 2].map((k) => U(POOL[o.category][(id + k) % POOL[o.category].length])),
  rating: Math.round((4.2 + ((id * 7) % 8) / 10) * 10) / 10,
  reviews: 8 + ((id * 13) % 60),
  warranty: "2 Years",
  createdAt: new Date(Date.UTC(2026, 0, 1 + id)).toISOString(),
  description: COPY[o.category].description,
  features: COPY[o.category].features,
  featured: false,
  isNew: false,
  ...o,
});

export const seedProducts = [
  make(1, { name: "Oslo Three-Seater Sofa", category: "Sofa", price: 68000, oldPrice: 78000, stock: 8, material: "Sal wood frame, premium fabric", dimensions: "210 × 90 × 85 cm", colors: ["Stone Grey", "Sand Beige", "Forest Green"], featured: true }),
  make(2, { name: "Velvet Lounge Sofa", category: "Sofa", price: 54000, stock: 5, material: "Hardwood frame, velvet upholstery", dimensions: "195 × 88 × 82 cm", colors: ["Emerald", "Midnight Blue", "Blush"] }),
  make(3, { name: "Modular Corner Sofa", category: "Sofa", price: 96000, oldPrice: 112000, stock: 3, material: "Hardwood frame, linen blend", dimensions: "280 × 170 × 85 cm", colors: ["Oat", "Charcoal"], featured: true }),
  make(4, { name: "Nordic Two-Seater Loveseat", category: "Sofa", price: 42000, stock: 10, material: "Birch frame, cotton blend", dimensions: "150 × 80 × 80 cm", colors: ["Light Grey", "Mustard", "Teal"] }),
  make(5, { name: "Chesterfield Leather Sofa", category: "Sofa", price: 118000, stock: 2, material: "Hardwood frame, genuine leather", dimensions: "220 × 95 × 78 cm", colors: ["Tan", "Espresso"], isNew: true }),
  make(6, { name: "Classic Wooden Sofa Set (5 Seater)", category: "Sofa", price: 85000, oldPrice: 95000, stock: 6, material: "Segun teak, cushion seats", dimensions: "3+1+1 seater set", colors: ["Natural Teak", "Walnut"] }),

  make(7, { name: "Haven King Bed", category: "Bed", price: 82000, oldPrice: 92000, stock: 7, material: "Segun teak, hand polished", dimensions: "200 × 180 × 110 cm", colors: ["Natural Teak", "Walnut", "White Oak"], featured: true }),
  make(8, { name: "Teak Platform Bed", category: "Bed", price: 74000, stock: 4, material: "Solid teak", dimensions: "200 × 160 × 90 cm", colors: ["Natural Teak", "Dark Walnut"] }),
  make(9, { name: "Storage Bed Frame", category: "Bed", price: 69000, stock: 6, material: "Engineered wood, hydraulic lift", dimensions: "200 × 170 × 100 cm", colors: ["Grey Oak", "Walnut"], isNew: true }),
  make(10, { name: "Upholstered Queen Bed", category: "Bed", price: 64000, stock: 0, material: "Hardwood frame, fabric headboard", dimensions: "200 × 160 × 115 cm", colors: ["Sand", "Slate"] }),
  make(11, { name: "Kids Single Bed", category: "Bed", price: 28000, stock: 12, material: "Sal wood, rounded edges", dimensions: "200 × 100 × 80 cm", colors: ["Natural", "White"] }),

  make(12, { name: "Classic Sliding Almirah", category: "Almirah", price: 59000, oldPrice: 66000, stock: 9, material: "Engineered wood, laminate finish", dimensions: "180 × 60 × 210 cm", colors: ["Walnut", "White Oak", "Grey"], featured: true }),
  make(13, { name: "Walnut Wardrobe (3 Door)", category: "Almirah", price: 64000, stock: 5, material: "Walnut veneer", dimensions: "150 × 55 × 200 cm", colors: ["Walnut"] }),
  make(14, { name: "Mirror Door Almirah", category: "Almirah", price: 72000, stock: 4, material: "Engineered wood, full-length mirror", dimensions: "160 × 58 × 210 cm", colors: ["White", "Oak"], isNew: true }),
  make(15, { name: "Compact 2-Door Almirah", category: "Almirah", price: 34000, stock: 14, material: "Engineered wood", dimensions: "90 × 50 × 190 cm", colors: ["Walnut", "White"] }),
  make(16, { name: "Open Shelf Wardrobe", category: "Almirah", price: 28000, stock: 11, material: "Solid pine and metal rail", dimensions: "120 × 45 × 180 cm", colors: ["Natural Pine"] }),

  make(17, { name: "Round Dining Table", category: "Table", price: 38000, stock: 6, material: "Teak top, metal base", dimensions: "Ø 120 × 75 cm", colors: ["Natural Teak", "Black"], featured: true }),
  make(18, { name: "Marble Coffee Table", category: "Table", price: 24000, oldPrice: 28000, stock: 9, material: "Marble top, brass frame", dimensions: "90 × 50 × 42 cm", colors: ["White Marble", "Black Marble"] }),
  make(19, { name: "Six-Seater Dining Set", category: "Table", price: 56000, stock: 3, material: "Segun teak, cushioned chairs", dimensions: "Table 180 × 90 × 76 cm", colors: ["Natural Teak", "Walnut"], isNew: true }),
  make(20, { name: "Study Desk with Drawers", category: "Table", price: 18000, stock: 15, material: "Engineered wood", dimensions: "120 × 60 × 75 cm", colors: ["Oak", "White"] }),

  make(21, { name: "Accent Armchair", category: "Chair", price: 21000, stock: 10, material: "Hardwood legs, bouclé fabric", dimensions: "75 × 78 × 80 cm", colors: ["Ivory", "Olive", "Rust"], featured: true }),
  make(22, { name: "Rattan Dining Chair", category: "Chair", price: 9500, stock: 25, material: "Natural rattan, teak frame", dimensions: "45 × 52 × 85 cm", colors: ["Natural"] }),
  make(23, { name: "Ergonomic Office Chair", category: "Chair", price: 16500, oldPrice: 19000, stock: 12, material: "Mesh back, steel base", dimensions: "62 × 62 × 115 cm", colors: ["Black", "Grey"] }),
  make(24, { name: "Wingback Reading Chair", category: "Chair", price: 26000, stock: 4, material: "Hardwood frame, linen", dimensions: "78 × 82 × 105 cm", colors: ["Navy", "Sage"], isNew: true }),
];
