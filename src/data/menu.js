// Menu data — transcribed verbatim from the printed menu cards (4 pages).
//
// Pricing convention:
//   `price`     = full plate
//   `priceHalf` = half plate (only when the menu offers it)
// For items where the size split is "X Pcs / Y Pcs" (e.g. Tandoori Chicken
// 4/8 Pcs), the smaller portion goes into `priceHalf` and the larger into
// `price`. Veg/non-veg follows FSSAI convention — eggs count as non-veg.

const cat = (id, label, blurb) => ({ id, label, blurb });

export const CATEGORIES = [
  cat('biryani',         'Biryani',              'The hero. Long-grain basmati, slow-dum.'),
  cat('starter-veg',     'Veg Starters',         'Crispy, saucy, made for sharing.'),
  cat('starter-nonveg',  'Non-Veg Starters',     'Wok-tossed, fired, plated hot.'),
  cat('tandoori',        'Tandoori',             'Charcoal-charred. Smoke and char.'),
  cat('main-veg',        'Veg Main Course',      'Gravies that pair with everything.'),
  cat('main-nonveg',     'Non-Veg Main Course',  'House gravies, slow-built.'),
  cat('egg',             'Eggetarian',           'Eggs, your way.'),
  cat('rice',            'Fried Rice',           'Wok-fired, restaurant-style.'),
  cat('noodles',         'Noodles',              'Indo-Chinese classics.'),
  cat('soup',            'Soups',                'A warm start.'),
  cat('bread',           'Breads',               'Tawa, tandoor, all of it.'),
  cat('beverage',        'Beverages & Desserts', 'Wash it down. Or finish sweet.'),
];

let _id = 0;
const item = (data) => ({ id: ++_id, ...data });

export const MENU = [
  // ─────────────────────────────────────────────────────────────────────
  // BIRYANI — the house signature. Format: priceHalf / price
  // ─────────────────────────────────────────────────────────────────────
  item({ category: 'biryani', name: "Subz 'E' Dum Biryani",                        desc: 'Mixed-vegetable dum biryani, sealed pot.',                     priceHalf: 100, price: 160, veg: true }),
  item({ category: 'biryani', name: 'Story Veg Biryani',                           desc: 'Mushroom, paneer & sabji — the veg house special.',            priceHalf: 100, price: 170, veg: true,  popular: true }),
  item({ category: 'biryani', name: 'Alishan Paneer Biryani',                      desc: 'Paneer cubes layered through fragrant biryani rice.',          priceHalf: 100, price: 160, veg: true }),
  item({ category: 'biryani', name: "Mushroom 'E' Mehfil Biryani",                 desc: 'Earthy mushrooms, dum-cooked with whole spices.',              priceHalf: 100, price: 160, veg: true }),
  item({ category: 'biryani', name: 'Jail Ka Biryani (Veg, Dry Fruit)',            desc: 'House-themed veg biryani with cashew, raisins, almonds.',      priceHalf: 110, price: 200, veg: true,  popular: true }),
  item({ category: 'biryani', name: 'Hyderabadi Dum Pakki Chicken Biryani',        desc: 'Kacchi-style dum, sealed pot, fragrant saffron strands.',      priceHalf: 110, price: 180, veg: false, popular: true, hero: true }),
  item({ category: 'biryani', name: 'Story Chicken Biryani (with Egg)',            desc: 'House-style chicken biryani topped with a boiled egg.',        priceHalf: 120, price: 190, veg: false, popular: true }),
  item({ category: 'biryani', name: 'Charcolic Chicken Biryani (2 Pcs)',           desc: 'Charcoal-finished, smoky biryani with chicken pieces.',        price: 220,                veg: false, popular: true }),
  item({ category: 'biryani', name: 'Sahi Keema Biryani',                          desc: 'Slow-cooked minced mutton biryani — rich and royal.',          price: 200,                veg: false }),
  item({ category: 'biryani', name: 'Ghee Roasted Biryani (2 Pcs)',                desc: 'Ghee-finished biryani with extra aromatics.',                  priceHalf: 120, price: 220, veg: false }),
  item({ category: 'biryani', name: 'Chilli Chicken Biryani (6 Pcs)',              desc: 'Indo-Chinese twist — chilli chicken folded into biryani.',     priceHalf: 120, price: 220, veg: false, popular: true }),
  item({ category: 'biryani', name: 'Chicken 65 Biryani (6 Pcs)',                  desc: 'Spicy Chicken 65 over fragrant biryani rice.',                 priceHalf: 120, price: 220, veg: false }),
  item({ category: 'biryani', name: 'Hyderbadi Mutton Dum Pakki Biryani (2 Pcs)',  desc: 'Slow-cooked mutton, fall-apart tender, layered with rice.',    priceHalf: 150, price: 250, veg: false, popular: true }),
  item({ category: 'biryani', name: 'Ghee Roasted Mutton Biryani (2 Pcs)',         desc: 'Mutton biryani enriched with pure ghee.',                      priceHalf: 150, price: 260, veg: false }),
  item({ category: 'biryani', name: 'Tandoori Chicken Biryani (2 Pcs)',            desc: 'Tandoor-charred chicken pieces in biryani rice.',              price: 220,                veg: false }),
  item({ category: 'biryani', name: 'Prawn Fried Biryani',                         desc: 'Coastal twist — prawns wok-tossed with biryani rice.',         price: 240,                veg: false }),

  // ─────────────────────────────────────────────────────────────────────
  // VEG STARTERS — Full / Half columns from the printed card.
  // ─────────────────────────────────────────────────────────────────────
  item({ category: 'starter-veg', name: 'Veg Manchurian (8 Pcs)',         price: 210, priceHalf: 130, veg: true, popular: true }),
  item({ category: 'starter-veg', name: 'Crispy Veg',                     price: 220,                  veg: true }),
  item({ category: 'starter-veg', name: 'Gobi 65',                        price: 220,                  veg: true }),
  item({ category: 'starter-veg', name: 'Chilli Gobi',                    price: 220,                  veg: true }),
  item({ category: 'starter-veg', name: 'Gobi Manchurian',                price: 240,                  veg: true }),
  item({ category: 'starter-veg', name: 'Paneer 65',                      price: 240,                  veg: true, popular: true }),
  item({ category: 'starter-veg', name: 'Paneer Manchurian',              price: 240, priceHalf: 140, veg: true }),
  item({ category: 'starter-veg', name: 'Chilli Paneer (Dry / Gravy)',    price: 230, priceHalf: 130, veg: true, popular: true }),
  item({ category: 'starter-veg', name: 'Paneer Majestic',                price: 250,                  veg: true, popular: true }),
  item({ category: 'starter-veg', name: 'Paneer 555 Garlic',              price: 260,                  veg: true }),
  item({ category: 'starter-veg', name: 'Pepper Paneer',                  price: 240,                  veg: true }),
  item({ category: 'starter-veg', name: 'Baby Corn Manchurian',           price: 230,                  veg: true }),
  item({ category: 'starter-veg', name: 'Chilli Baby Corn',               price: 230,                  veg: true }),
  item({ category: 'starter-veg', name: 'Crispy Baby Corn',               price: 230,                  veg: true, popular: true }),
  item({ category: 'starter-veg', name: 'Baby Corn Golden Fry',           price: 230,                  veg: true }),
  item({ category: 'starter-veg', name: 'Mushroom 65',                    price: 240,                  veg: true }),
  item({ category: 'starter-veg', name: 'Mushroom Manchurian',            price: 240,                  veg: true }),
  item({ category: 'starter-veg', name: 'Mushroom Chilli',                price: 230, priceHalf: 130, veg: true }),
  item({ category: 'starter-veg', name: 'Paneer Pakora',                  price: 180,                  veg: true }),
  item({ category: 'starter-veg', name: 'Soya Chap 65',                   price: 250,                  veg: true }),
  item({ category: 'starter-veg', name: 'Soya Chap Chilli (Dry)',         price: 250,                  veg: true }),

  // ─────────────────────────────────────────────────────────────────────
  // NON-VEG STARTERS
  // ─────────────────────────────────────────────────────────────────────
  item({ category: 'starter-nonveg', name: 'Crispy Chicken',                              price: 260,                 veg: false }),
  item({ category: 'starter-nonveg', name: 'Chilli Chicken (Dry / Gravy) Boneless',       price: 240, priceHalf: 140, veg: false, popular: true }),
  item({ category: 'starter-nonveg', name: 'Hyderabadi Style Chicken 65',                 price: 250, priceHalf: 140, veg: false }),
  item({ category: 'starter-nonveg', name: 'Pepper Chicken',                              price: 250,                 veg: false }),
  item({ category: 'starter-nonveg', name: 'Chicken Majestic',                            price: 270,                 veg: false }),
  item({ category: 'starter-nonveg', name: 'Chicken Lollipop (6 Pcs)',                    price: 270,                 veg: false, popular: true }),
  item({ category: 'starter-nonveg', name: 'Chicken Manchurian (Gravy / Dry)',            price: 250, priceHalf: 140, veg: false }),
  item({ category: 'starter-nonveg', name: 'Chicken 555',                                 price: 270,                 veg: false }),
  item({ category: 'starter-nonveg', name: 'Ginger Chicken',                              price: 250,                 veg: false }),
  item({ category: 'starter-nonveg', name: 'Dragon Chicken',                              price: 270,                 veg: false }),
  item({ category: 'starter-nonveg', name: 'Lemon Chicken',                               price: 260,                 veg: false }),
  item({ category: 'starter-nonveg', name: 'Garlic Chicken (Dry / Gravy)',                price: 240,                 veg: false }),
  item({ category: 'starter-nonveg', name: 'Sezawan Chicken',                             price: 250,                 veg: false }),
  item({ category: 'starter-nonveg', name: 'Prawn Chilli (Dry / Gravy) (8 Pcs)',          price: 300, priceHalf: 150, veg: false }),
  item({ category: 'starter-nonveg', name: 'Golden Fry Prawn (8 Pcs)',                    price: 280,                 veg: false }),
  item({ category: 'starter-nonveg', name: 'Chilli Garlic Chicken (8 Pcs)',               price: 250,                 veg: false }),

  // ─────────────────────────────────────────────────────────────────────
  // TANDOORI — bone-in / bone-out, charcoal finished.
  // ─────────────────────────────────────────────────────────────────────
  item({ category: 'tandoori', name: 'Tandoori Chicken (4 / 8 Pcs)',              price: 360, priceHalf: 180, veg: false, popular: true }),
  item({ category: 'tandoori', name: 'Jail Murg Tikka (8 Pcs)',                   price: 260, priceHalf: 150, veg: false, popular: true }),
  item({ category: 'tandoori', name: 'Murg Afgani Tanoori Bone (4 / 8 Pcs)',      price: 400, priceHalf: 200, veg: false }),
  item({ category: 'tandoori', name: 'Murg Banjara Kabab (8 Pcs)',                price: 300, priceHalf: 150, veg: false }),
  item({ category: 'tandoori', name: 'Tangari Kabab (2 / 4 Pcs)',                 price: 360, priceHalf: 180, veg: false }),

  // ─────────────────────────────────────────────────────────────────────
  // VEG MAIN COURSE
  // ─────────────────────────────────────────────────────────────────────
  item({ category: 'main-veg', name: 'Paneer Butter Masala',          price: 230, priceHalf: 130, veg: true, popular: true }),
  item({ category: 'main-veg', name: 'Paneer Masala',                 price: 230, priceHalf: 130, veg: true }),
  item({ category: 'main-veg', name: 'Sahi Paneer',                   price: 260, priceHalf: 150, veg: true }),
  item({ category: 'main-veg', name: 'Creamy Mix Veg',                price: 210, priceHalf: 130, veg: true }),
  item({ category: 'main-veg', name: 'Paneer Jail Masala',            price: 240, priceHalf: 140, veg: true, popular: true }),
  item({ category: 'main-veg', name: 'Paneer Do Pyaza',               price: 250, priceHalf: 140, veg: true }),
  item({ category: 'main-veg', name: 'Paneer Kadhai',                 price: 240, priceHalf: 140, veg: true }),
  item({ category: 'main-veg', name: 'Paneer Korma',                  price: 250,                 veg: true }),
  item({ category: 'main-veg', name: 'Kaju Paneer (Sweet / Spicy)',   price: 260,                 veg: true }),
  item({ category: 'main-veg', name: 'Mushroom Do Pyaza',             price: 250, priceHalf: 140, veg: true }),
  item({ category: 'main-veg', name: 'Mushroom Jail Masala',          price: 250, priceHalf: 140, veg: true }),
  item({ category: 'main-veg', name: 'Mushroom Kadhai',               price: 240, priceHalf: 140, veg: true }),
  item({ category: 'main-veg', name: 'Mushroom Butter Masala',        price: 230, priceHalf: 130, veg: true }),
  item({ category: 'main-veg', name: 'Mushroom Masala',               price: 230, priceHalf: 130, veg: true }),
  item({ category: 'main-veg', name: 'Baby Corn Kadhai',              price: 250,                 veg: true }),
  item({ category: 'main-veg', name: 'Veg Chatpat',                   price: 240,                 veg: true }),
  item({ category: 'main-veg', name: 'Paneer Malai Kofta',            price: 270,                 veg: true }),
  item({ category: 'main-veg', name: 'Soya Chap Masala',              price: 250,                 veg: true }),
  item({ category: 'main-veg', name: 'Finger Paneer Masala (6 Pcs)',  price: 260,                 veg: true }),
  item({ category: 'main-veg', name: 'Paneer Tikka Masala (8 Pcs)',   price: 300,                 veg: true }),
  item({ category: 'main-veg', name: 'Paneer Kolhapuri',              price: 280,                 veg: true }),

  // ─────────────────────────────────────────────────────────────────────
  // NON-VEG MAIN COURSE — most are 4 Pcs full / 2 Pcs half.
  // ─────────────────────────────────────────────────────────────────────
  item({ category: 'main-nonveg', name: 'Tandoori Chicken (B) Masala (4 Pcs)',     price: 480, priceHalf: 270, veg: false }),
  item({ category: 'main-nonveg', name: 'Chicken Butter Masala (4 Pcs)',           price: 260, priceHalf: 140, veg: false, popular: true }),
  item({ category: 'main-nonveg', name: 'Chicken Jail Masala (Spicy 4 Pcs)',       price: 260, priceHalf: 140, veg: false, popular: true }),
  item({ category: 'main-nonveg', name: 'Chicken Masala Dehati (Homestyle)',       price: 250, priceHalf: 140, veg: false, popular: true }),
  item({ category: 'main-nonveg', name: 'Chicken Chakki Korma (4 Pcs)',            price: 270,                 veg: false }),
  item({ category: 'main-nonveg', name: 'Chicken Afgani (4 Pcs)',                  price: 270, priceHalf: 140, veg: false }),
  item({ category: 'main-nonveg', name: 'Chicken Kadhai (4 Pcs)',                  price: 260, priceHalf: 140, veg: false }),
  item({ category: 'main-nonveg', name: 'Chicken Handi (4 Pcs)',                   price: 270, priceHalf: 140, veg: false }),
  item({ category: 'main-nonveg', name: 'Chicken Kali Mirch (Dahi Gravy 4 Pcs)',   price: 260,                 veg: false }),
  item({ category: 'main-nonveg', name: 'Chicken Kolhapuri (Spicy 4 Pcs)',         price: 270,                 veg: false }),
  item({ category: 'main-nonveg', name: 'Chicken Lababdar (Spicy 4 Pcs)',          price: 280,                 veg: false }),
  item({ category: 'main-nonveg', name: 'Chicken Mughlai (4 Pcs)',                 price: 280,                 veg: false }),
  item({ category: 'main-nonveg', name: 'Ginger Chicken (Indian) (4 Pcs)',         price: 250,                 veg: false }),
  item({ category: 'main-nonveg', name: 'Garlic Chicken (Indian) (4 Pcs)',         price: 250,                 veg: false }),
  item({ category: 'main-nonveg', name: 'Chicken Tikka Masala (8 Pcs)',            price: 300, priceHalf: 150, veg: false, popular: true }),
  item({ category: 'main-nonveg', name: 'Chicken Tikka Butter Masala (8 Pcs)',     price: 300, priceHalf: 160, veg: false }),
  item({ category: 'main-nonveg', name: 'Punjabi Chicken Masala (4 Pcs)',          price: 280,                 veg: false }),
  item({ category: 'main-nonveg', name: 'Prawn Masala (8 Pcs)',                    price: 300,                 veg: false }),
  item({ category: 'main-nonveg', name: 'Prawn Butter Masala (8 Pcs)',             price: 320,                 veg: false }),
  item({ category: 'main-nonveg', name: 'Prawn Curry (8 Pcs)',                     price: 280,                 veg: false }),
  item({ category: 'main-nonveg', name: 'Mutton Athey (4 Pcs)',                    price: 350, priceHalf: 180, veg: false, popular: true }),

  // ─────────────────────────────────────────────────────────────────────
  // EGGETARIAN — eggs marked non-veg per FSSAI.
  // ─────────────────────────────────────────────────────────────────────
  item({ category: 'egg', name: 'Egg Masala (2 Pcs)',           price: 100, veg: false }),
  item({ category: 'egg', name: 'Egg Afgani (2 Pcs)',           price: 130, veg: false }),
  item({ category: 'egg', name: 'Egg Butter Masala',            price: 130, veg: false }),
  item({ category: 'egg', name: 'Egg Chilly (Dry / Gravy)',     price: 160, veg: false }),
  item({ category: 'egg', name: 'Egg Kadhai (2 Pcs)',           price: 130, veg: false }),
  item({ category: 'egg', name: 'Egg Do Pyaza (2 Pcs)',         price: 130, veg: false }),
  item({ category: 'egg', name: 'Egg Bhurji',                   price: 100, veg: false }),

  // ─────────────────────────────────────────────────────────────────────
  // FRIED RICE
  // ─────────────────────────────────────────────────────────────────────
  item({ category: 'rice', name: 'Plain Rice (Steam) — Half / Full',     price: 80,  priceHalf: 40, veg: true }),
  item({ category: 'rice', name: 'Veg Fried Rice',                       price: 140, veg: true }),
  item({ category: 'rice', name: 'Jeera Rice',                           price: 140, veg: true }),
  item({ category: 'rice', name: 'Paneer Fried Rice',                    price: 150, veg: true }),
  item({ category: 'rice', name: 'Mix Veg Fried Rice',                   price: 170, veg: true }),
  item({ category: 'rice', name: 'Mushroom Fried Rice',                  price: 150, veg: true }),
  item({ category: 'rice', name: 'Chicken Fried Rice',                   price: 170, veg: false, popular: true }),
  item({ category: 'rice', name: 'Egg Fried Rice',                       price: 160, veg: false }),
  item({ category: 'rice', name: 'Prawn Fried Rice',                     price: 200, veg: false }),
  item({ category: 'rice', name: 'Chilli Garlic Fried Rice (Veg)',       price: 180, veg: true }),
  item({ category: 'rice', name: 'Chilli Garlic Fried Rice (Non-Veg)',   price: 220, veg: false }),

  // ─────────────────────────────────────────────────────────────────────
  // NOODLES
  // ─────────────────────────────────────────────────────────────────────
  item({ category: 'noodles', name: 'Veg Hakka Noodles',          price: 120, veg: true,  popular: true }),
  item({ category: 'noodles', name: 'Mushroom Noodles',           price: 130, veg: true }),
  item({ category: 'noodles', name: 'Paneer Noodles',             price: 130, veg: true }),
  item({ category: 'noodles', name: 'Sezawan Noodles',            price: 130, veg: true }),
  item({ category: 'noodles', name: 'Paneer Sezawan Noodles',     price: 140, veg: true }),
  item({ category: 'noodles', name: 'Chicken Hakka Noodles',      price: 160, veg: false, popular: true }),
  item({ category: 'noodles', name: 'Egg Hakka Noodles',          price: 150, veg: false }),
  item({ category: 'noodles', name: 'Chilli Garlic Noodles',      price: 140, veg: true }),
  item({ category: 'noodles', name: 'Chicken Sezawan Noodles',    price: 180, veg: false }),
  item({ category: 'noodles', name: 'Mix Noodles (Veg)',          price: 160, veg: true }),
  item({ category: 'noodles', name: 'Chicken Chopsy',             price: 200, veg: false }),
  item({ category: 'noodles', name: 'Veg Chopsy',                 price: 170, veg: true }),
  item({ category: 'noodles', name: 'Prawn Mix Noodles',          price: 220, veg: false }),

  // ─────────────────────────────────────────────────────────────────────
  // SOUPS
  // ─────────────────────────────────────────────────────────────────────
  item({ category: 'soup', name: 'Veg Hot & Sour Soup',          price: 100, veg: true }),
  item({ category: 'soup', name: 'Veg Clear Soup',               price: 100, veg: true }),
  item({ category: 'soup', name: 'Veg Manchow Soup',             price: 120, veg: true }),
  item({ category: 'soup', name: 'Chicken Hot & Sour Soup',      price: 130, veg: false }),
  item({ category: 'soup', name: 'Chicken Manchow Soup',         price: 140, veg: false, popular: true }),
  item({ category: 'soup', name: 'Chicken Dragon Soup',          price: 150, veg: false }),

  // ─────────────────────────────────────────────────────────────────────
  // BREADS
  // ─────────────────────────────────────────────────────────────────────
  item({ category: 'bread', name: 'Tawa Roti',                                   price: 10,                veg: true }),
  item({ category: 'bread', name: 'Tawa Ghee Roti',                              price: 15,                veg: true }),
  item({ category: 'bread', name: 'Tandoori Laccha Paratha (Plain / Butter)',   price: 35, priceHalf: 30, veg: true }),
  item({ category: 'bread', name: 'Atta Tandoori Roti (Plain / Butter)',        price: 25, priceHalf: 20, veg: true }),
  item({ category: 'bread', name: 'Naan (Plain / Butter)',                       price: 45, priceHalf: 40, veg: true }),
  item({ category: 'bread', name: 'Pudina Paratha (Butter)',                     price: 40,                veg: true }),
  item({ category: 'bread', name: 'Garlic Naan',                                 price: 70,                veg: true }),
  item({ category: 'bread', name: 'Chilli Garlic Naan',                          price: 80,                veg: true, popular: true }),
  item({ category: 'bread', name: 'Paneer Kulcha',                               price: 80,                veg: true }),

  // ─────────────────────────────────────────────────────────────────────
  // BEVERAGES & DESSERTS
  // ─────────────────────────────────────────────────────────────────────
  item({ category: 'beverage', name: 'Masala Cold Drink',           price: 30, veg: true }),
  item({ category: 'beverage', name: 'Plain Cold Drink',            price: 40, veg: true }),
  item({ category: 'beverage', name: 'Rabri with 2 Gulab Jamun',    price: 70, veg: true, popular: true }),
];

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

export const getByCategory = (categoryId) =>
  MENU.filter((m) => m.category === categoryId);

export const getPopular = (limit = 8) =>
  MENU.filter((m) => m.popular).slice(0, limit);

export const getCategoryLabel = (id) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;

export const searchMenu = (query) => {
  const q = query.trim().toLowerCase();
  if (!q) return MENU;
  return MENU.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      (m.desc && m.desc.toLowerCase().includes(q)) ||
      getCategoryLabel(m.category).toLowerCase().includes(q),
  );
};

// Curated featured biryanis for the home Signature section.
export const SIGNATURE_BIRYANIS = MENU.filter((m) => m.category === 'biryani' && m.popular);
