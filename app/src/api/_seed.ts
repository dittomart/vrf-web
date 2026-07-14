/* ============================================================
   Verbatim port of the prototype's assets/app.js data block.
   Every id, price, name, description, flag and count is UNCHANGED.
   Part 2 replaces this file with real endpoints and DELETES it.
   ============================================================ */
import type { Category, Product } from '@/types';

/* ---------- Brand config ---------- */
export const VRF = {
  brand: 'VRF Kitchen',
  owner: "Vijay Raghavan's",
  tagline: 'Taste • Time • Quality',

  /* ---- the store ---- */
  city: 'Chennai',
  area: 'Perungalathur',
  state: 'Tamil Nadu',
  pincode: '600063',
  addressLine: 'Shriram Apartment Park 63, Tower 12, Door No: GST Road',
  landmark: 'Near Perungalathur Bus Stand',
  /** the full one-line store address, for the footer and contact rows */
  address:
    'Shriram Apartment Park 63, Tower 12, Door No: GST Road, Perungalathur, Chennai, Tamil Nadu 600063',
  /** the kitchen's own pin — Perungalathur, Chennai */
  lat: 12.9024,
  lng: 80.0946,
  hours: '5:00 AM – 12:00 AM',

  radius: 6, // km
  eta: 35, // minutes
  minOrder: 149,
  freeDeliveryAbove: 349,
  deliveryCharge: 29,
  phone: '9372381280',
  whatsapp: '9372381280',
  demo: true,
} as const;

/* ---------- Demo catalog (Restaurant / Pure Veg) ---------- */
export const CATEGORIES: Category[] = [
  { id: 'starters', name: 'Starters', icon: 'salad' },
  { id: 'biryani', name: 'Biryani', icon: 'cooking-pot' },
  { id: 'maincourse', name: 'Main Course', icon: 'utensils' },
  { id: 'breads', name: 'Breads', icon: 'wheat' },
  { id: 'southindian', name: 'South Indian', icon: 'flame' },
  { id: 'desserts', name: 'Desserts', icon: 'ice-cream-bowl' },
  { id: 'beverages', name: 'Beverages', icon: 'cup-soda' },
  { id: 'combos', name: 'Combo Meals', icon: 'layout-grid' },
];

export const PRODUCTS: Product[] = [
  // starters
  { id: 'p1', cat: 'starters', name: 'Paneer Tikka', desc: '8 pcs · char-grilled cottage cheese in tandoori spices', price: 240, mrp: 280, img: '1567188040759-fb8a883dc6d8', best: true, ordered: 214, tags: ['veg', 'bestseller'] },
  { id: 'p2', cat: 'starters', name: 'Gobi 65', desc: 'Crispy fried cauliflower tossed in curry leaves & chilli', price: 160, mrp: 190, img: '1606491956689-2ea866880c84', best: false, ordered: 88, tags: ['veg', 'spicy'] },
  { id: 'p3', cat: 'starters', name: 'Veg Manchurian (Dry)', desc: 'Indo-Chinese veg balls in tangy garlic sauce', price: 180, mrp: 200, img: '1585032226651-759b368d7246', best: false, ordered: 121, tags: ['veg'] },
  { id: 'p4', cat: 'starters', name: 'Mushroom Pepper Fry', desc: 'Button mushrooms in black pepper & onion masala', price: 200, mrp: 230, img: '1611489142329-5f62cfa43e6b', best: false, ordered: 64, tags: ['veg', 'spicy'] },
  // biryani
  { id: 'p5', cat: 'biryani', name: 'Veg Dum Biryani', desc: 'Fragrant seeraga samba rice, layered vegetables, saffron', price: 220, mrp: 250, img: '1589302168068-964664d93dc0', best: true, ordered: 402, tags: ['veg', 'bestseller'] },
  { id: 'p6', cat: 'biryani', name: 'Paneer Biryani', desc: 'Aromatic biryani loaded with soft paneer cubes', price: 260, mrp: 290, img: '1633945274405-b6c8069047b0', best: true, ordered: 268, tags: ['veg', 'bestseller'] },
  { id: 'p7', cat: 'biryani', name: 'Mushroom Biryani', desc: 'Chennai-style mushroom biryani with mint raita', price: 240, mrp: 270, img: '1596797038530-2c107229654b', best: false, ordered: 97, tags: ['veg'] },
  // main course
  { id: 'p8', cat: 'maincourse', name: 'Paneer Butter Masala', desc: 'Rich buttery tomato gravy with fresh paneer', price: 230, mrp: 260, img: '1631452180519-c014fe946bc7', best: true, ordered: 311, tags: ['veg', 'bestseller'] },
  { id: 'p9', cat: 'maincourse', name: 'Kadai Veg', desc: 'Mixed vegetables in roasted kadai masala', price: 210, mrp: 240, img: '1585937421612-70a008356fbe', best: false, ordered: 76, tags: ['veg'] },
  { id: 'p10', cat: 'maincourse', name: 'Dal Tadka', desc: 'Yellow lentils tempered with ghee, cumin & garlic', price: 160, mrp: 180, img: '1546833999-b9f581a1996d', best: false, ordered: 143, tags: ['veg'] },
  { id: 'p11', cat: 'maincourse', name: 'Chettinad Veg Kurma', desc: 'South-style coconut kurma, perfect with parotta', price: 190, mrp: 210, img: '1567337710282-00832b415979', best: false, ordered: 88, tags: ['veg', 'spicy'] },
  // breads
  { id: 'p12', cat: 'breads', name: 'Butter Naan', desc: 'Soft tandoor naan brushed with butter', price: 45, mrp: 55, img: '1626074353765-517a681e40be', best: false, ordered: 190, tags: ['veg'] },
  { id: 'p13', cat: 'breads', name: 'Kerala Parotta (2 pcs)', desc: 'Flaky layered parotta, made fresh', price: 60, mrp: 70, img: '1565557623262-b51c2513a641', best: true, ordered: 233, tags: ['veg', 'bestseller'] },
  { id: 'p14', cat: 'breads', name: 'Tandoori Roti', desc: 'Whole-wheat roti from the clay oven', price: 35, mrp: 40, img: '1574653853027-5382a3d23a15', best: false, ordered: 71, tags: ['veg'] },
  // south indian
  { id: 'p15', cat: 'southindian', name: 'Masala Dosa', desc: 'Crispy dosa with potato masala, sambar & chutney', price: 90, mrp: 110, img: '1668236543090-82eba5ee5976', best: true, ordered: 356, tags: ['veg', 'bestseller'] },
  { id: 'p16', cat: 'southindian', name: 'Idli Vada Combo', desc: '2 idli + 1 medu vada with sambar & 3 chutneys', price: 80, mrp: 95, img: '1589301760014-d929f3979dbc', best: false, ordered: 128, tags: ['veg'] },
  { id: 'p17', cat: 'southindian', name: 'Ghee Pongal', desc: 'Comforting rice-dal pongal loaded with ghee & pepper', price: 100, mrp: 120, img: '1630409351217-bc4fa6422075', best: false, ordered: 84, tags: ['veg'] },
  // desserts
  { id: 'p18', cat: 'desserts', name: 'Gulab Jamun (2 pcs)', desc: 'Warm khoya dumplings soaked in cardamom syrup', price: 60, mrp: 70, img: '1601050690597-df0568f70950', best: false, ordered: 167, tags: ['veg'] },
  { id: 'p19', cat: 'desserts', name: 'Rava Kesari', desc: 'Ghee-rich saffron semolina sweet', price: 70, mrp: 80, img: '1666190092159-3171cf0fbb12', best: false, ordered: 59, tags: ['veg'] },
  // beverages
  { id: 'p20', cat: 'beverages', name: 'Filter Coffee', desc: 'Authentic South Indian degree filter coffee', price: 40, mrp: 45, img: '1509042239860-f550ce710b93', best: true, ordered: 289, tags: ['veg', 'bestseller'] },
  { id: 'p21', cat: 'beverages', name: 'Fresh Lime Soda', desc: 'Sweet & salt lime soda, freshly churned', price: 55, mrp: 60, img: '1621263764928-df1444c5e859', best: false, ordered: 102, tags: ['veg'] },
  { id: 'p22', cat: 'beverages', name: 'Jigarthanda', desc: 'Madurai special — milk, almond gum, ice cream', price: 90, mrp: 100, img: '1638176066666-ffb2f013c7dd', best: false, ordered: 76, tags: ['veg'] },
  // combos
  { id: 'p23', cat: 'combos', name: 'Meals Combo (Unlimited)', desc: 'Rice, sambar, rasam, 3 curries, poriyal, curd, papad, sweet', price: 180, mrp: 220, img: '1585937421612-70a008356fbe', best: true, ordered: 421, tags: ['veg', 'bestseller'] },
  { id: 'p24', cat: 'combos', name: 'Parotta + Kurma Combo', desc: '2 parotta + veg kurma + gulab jamun', price: 150, mrp: 175, img: '1567337710282-00832b415979', best: false, ordered: 134, tags: ['veg'] },
];

/* ---------- assets ---------- */
export const LOGO = '/image.png';

/* Per-product override map → verified Indian-veg Unsplash photo IDs */
export const IMG: Record<string, string> = {
  p1: '1567188040759-fb8a883dc6d8', // paneer tikka
  p2: '1610057099431-d73a1c9d2f2f', // fried snack
  p3: '1626074353765-517a681e40be', // manchurian-ish
  p4: '1604908176997-125f25cc6f3d', // mushroom
  p5: '1589302168068-964664d93dc0', // biryani
  p6: '1633945274405-b6c8069047b0', // paneer biryani
  p7: '1596797038530-2c107229654b', // mushroom biryani
  p8: '1631452180519-c014fe946bc7', // paneer butter masala
  p9: '1585937421612-70a008356fbe', // veg curry
  p10: '1546833999-b9f581a1996d', // dal
  p11: '1567337710282-00832b415979', // kurma
  p12: '1626074353765-517a681e40be', // naan
  p13: '1565557623262-b51c2513a641', // parotta
  p14: '1574653853027-5382a3d23a15', // roti
  p15: '1668236543090-82eba5ee5976', // dosa
  p16: '1589301760014-d929f3979dbc', // idli
  p17: '1630409351217-bc4fa6422075', // pongal
  p18: '1601050690597-df0568f70950', // gulab jamun
  p19: '1666190092159-3171cf0fbb12', // kesari
  p20: '1509042239860-f550ce710b93', // coffee
  p21: '1621263764928-df1444c5e859', // lime soda
  p22: '1638176066666-ffb2f013c7dd', // jigarthanda
  p23: '1567337710282-00832b415979', // meals
  p24: '1565557623262-b51c2513a641', // combo
};

/* Serviceable areas — the localities the Perungalathur kitchen delivers to */
export const SERVICEABLE_AREAS = [
  'Perungalathur',
  'Tambaram',
  'Chromepet',
  'Selaiyur',
  'Vandalur',
  'Mudichur',
  'Peerkankaranai',
];

/** Serviceable areas with their pins — the location + address search lists. */
export const SERVICE_AREA_PINS: { name: string; lat: number; lng: number }[] = [
  { name: 'Perungalathur, Chennai', lat: 12.9024, lng: 80.0946 },
  { name: 'Tambaram, Chennai', lat: 12.9249, lng: 80.1 },
  { name: 'Chromepet, Chennai', lat: 12.9516, lng: 80.1462 },
  { name: 'Selaiyur, Chennai', lat: 12.9075, lng: 80.14 },
  { name: 'Vandalur, Chennai', lat: 12.8926, lng: 80.0817 },
  { name: 'Mudichur, Chennai', lat: 12.911, lng: 80.067 },
  { name: 'Peerkankaranai, Chennai', lat: 12.9086, lng: 80.1093 },
];
