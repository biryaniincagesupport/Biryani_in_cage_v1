// Site-wide constants. All marketing copy and links live here so the team can
// update without touching components. Production secrets/links should override
// via env vars (see .env.example).

const env = import.meta.env;

export const SITE = {
  name: 'Biryani In Cage',
  nameHindi: 'बिरयानी In Cage',
  tagline: 'Caged in flavour. Set free in every bite.',
  shortPitch:
    "Deoghar's most loved themed biryani restaurant. Multicuisine veg & non-veg, served inside our signature cage booths.",
  founded: 2021,
  city: 'Deoghar',
  state: 'Jharkhand',
  address:
    'Parmeshwar Dayal Road, Barmasia, In front of Oxygen Fitness Gym, Deoghar, Jharkhand 814112',
  hours: '12:00 PM – 11:00 PM · Open all days',
  phone: env.VITE_PHONE_NUMBER || '+91 79036 87499',
  email: 'hello@biryaniincage.in',
  links: {
    zomato: env.VITE_ZOMATO_URL || 'https://www.zomato.com/',
    swiggy: env.VITE_SWIGGY_URL || 'https://www.swiggy.com/',
    // Short link works the same on web and Maps mobile app — opens the
    // Biryani In Cage place page where users can directions/call/review.
    maps: env.VITE_GOOGLE_MAPS_URL || 'https://maps.app.goo.gl/Y5hTJxLrrwQKtspV8',
    reviews: env.VITE_GOOGLE_REVIEWS_URL || 'https://maps.app.goo.gl/Y5hTJxLrrwQKtspV8',
    instagram: env.VITE_INSTAGRAM_URL || 'https://instagram.com/',
  },
};

export const STATS = [
  { label: 'Years serving Deoghar', value: '5+', sub: 'since 2021' },
  { label: 'Monthly Google searches', value: '8,000+', sub: 'on Maps' },
  { label: 'Biryani rank · Zomato', value: '#1', sub: 'in Deoghar' },
  { label: 'Biryani rank · Swiggy', value: '#2', sub: 'in Deoghar' },
];

export const STORY = [
  {
    year: '2021',
    title: 'Born in a cloud kitchen',
    body:
      "We started small — a single kitchen, one biryani recipe, and an obsession with getting the dum right. Within months, our orders quietly outgrew the kitchen.",
  },
  {
    year: '2022',
    title: 'The Cage opens',
    body:
      "We turned that obsession into a place — a jail-themed restaurant with black cage booths, brick walls, neon, and flowers. A vibe that felt like nowhere else in Deoghar. People came for the look. They stayed for the biryani.",
  },
  {
    year: '2024',
    title: 'Top of the charts',
    body:
      "#1 on Zomato and #2 on Swiggy in Deoghar's biryani section. Top 5 overall. 8,000+ Google searches a month. Numbers we still can't quite believe.",
  },
  {
    year: 'Today',
    title: 'Same recipe, sharper craft',
    body:
      "Long-grain basmati, slow-cooked masalas, kacchi-style dum, and a vibe that turned the restaurant into a Deoghar landmark.",
  },
];

export const FEATURES = [
  {
    title: 'Slow-cooked dum',
    desc: 'Sealed pot, low flame, long patience. Every biryani is steam-finished the way it should be.',
    icon: 'flame',
  },
  {
    title: 'Veg + Non-veg, one menu',
    desc: 'From Paneer Jail Masala to Chicken Hyderabadi — both sides of the table get something to fight over.',
    icon: 'utensils',
  },
  {
    title: 'The Cage experience',
    desc: 'Themed booths, neon walls, brick textures. Photos turn out unreal. So does the food.',
    icon: 'sparkles',
  },
  {
    title: 'Order any way',
    desc: 'Zomato, Swiggy, dine-in, or just call us. We pick up on the first ring.',
    icon: 'phone',
  },
];

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'Story', to: '/about' },
  { label: 'Visit', to: '/contact' },
];
