// DEMO DATA ONLY. Replace with Firestore reads in lib/services/* once configured.
import { offsetPoint } from '@/lib/geo'
import type { Category, City, GeoPoint, MenuItem, Restaurant } from '@/lib/types'

export const DEMO_CITIES: City[] = [
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', center: { lat: 12.9352, lng: 77.6245 } },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', center: { lat: 19.076, lng: 72.8777 } },
  { id: 'delhi', name: 'New Delhi', state: 'Delhi', center: { lat: 28.6139, lng: 77.209 } },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', center: { lat: 17.385, lng: 78.4867 } },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', center: { lat: 13.0827, lng: 80.2707 } },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', center: { lat: 22.5726, lng: 88.3639 } },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', center: { lat: 18.5204, lng: 73.8567 } },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', center: { lat: 23.0225, lng: 72.5714 } },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', center: { lat: 26.9124, lng: 75.7873 } },
  { id: 'kochi', name: 'Kochi', state: 'Kerala', center: { lat: 9.9312, lng: 76.2673 } },
]

export const DEMO_CATEGORIES: Category[] = [
  { id: 'biryani', name: 'Biryani', image: '/images/dishes/biryani.png' },
  { id: 'south-indian', name: 'South Indian', image: '/images/dishes/dosa.png' },
  { id: 'north-indian', name: 'North Indian', image: '/images/dishes/butter-chicken.png' },
  { id: 'street-food', name: 'Street Food', image: '/images/dishes/pani-puri.png' },
  { id: 'thali', name: 'Thali', image: '/images/dishes/thali.png' },
  { id: 'chinese', name: 'Chinese', image: '/images/dishes/hakka-noodles.png' },
  { id: 'desserts', name: 'Desserts', image: '/images/dishes/gulab-jamun.png' },
  { id: 'beverages', name: 'Chai & Drinks', image: '/images/dishes/masala-chai.png' },
]

type DemoRestaurantSeed = Omit<Restaurant, 'location'> & { offsetKm: { north: number; east: number } }

const RESTAURANT_SEEDS: DemoRestaurantSeed[] = [
  {
    id: 'spice-route-biryani',
    name: 'Spice Route Biryani House',
    cuisines: ['Biryani', 'Mughlai'],
    categoryIds: ['biryani', 'north-indian', 'desserts'],
    rating: 4.5,
    ratingCount: 2100,
    deliveryTimeMins: 30,
    costForTwo: 500,
    image: '/images/dishes/biryani.png',
    isPureVeg: false,
    isOpen: true,
    offer: '20% off up to ₹100',
    offsetKm: { north: 1.2, east: 0.8 },
  },
  {
    id: 'dosa-junction',
    name: 'Dosa Junction',
    cuisines: ['South Indian', 'Breakfast'],
    categoryIds: ['south-indian', 'beverages'],
    rating: 4.4,
    ratingCount: 1800,
    deliveryTimeMins: 22,
    costForTwo: 250,
    image: '/images/dishes/dosa.png',
    isPureVeg: true,
    isOpen: true,
    offer: 'Free delivery',
    offsetKm: { north: -0.6, east: 1.5 },
  },
  {
    id: 'tandoor-tales',
    name: 'Tandoor Tales',
    cuisines: ['North Indian', 'Tandoor'],
    categoryIds: ['north-indian'],
    rating: 4.2,
    ratingCount: 960,
    deliveryTimeMins: 35,
    costForTwo: 600,
    image: '/images/dishes/tandoori.png',
    isPureVeg: false,
    isOpen: true,
    offsetKm: { north: 2.4, east: -1.1 },
  },
  {
    id: 'chaat-street',
    name: 'Chaat Street Co.',
    cuisines: ['Street Food', 'Snacks'],
    categoryIds: ['street-food', 'beverages'],
    rating: 4.3,
    ratingCount: 1250,
    deliveryTimeMins: 20,
    costForTwo: 200,
    image: '/images/dishes/pani-puri.png',
    isPureVeg: true,
    isOpen: true,
    offer: '₹50 off above ₹249',
    offsetKm: { north: -1.8, east: -2.0 },
  },
  {
    id: 'bombay-pav-co',
    name: 'Bombay Pav Co.',
    cuisines: ['Street Food', 'Maharashtrian'],
    categoryIds: ['street-food'],
    rating: 4.1,
    ratingCount: 740,
    deliveryTimeMins: 25,
    costForTwo: 300,
    image: '/images/dishes/pav-bhaji.png',
    isPureVeg: true,
    isOpen: true,
    offsetKm: { north: 3.1, east: 2.2 },
  },
  {
    id: 'wok-and-roll',
    name: 'Wok & Roll',
    cuisines: ['Indo-Chinese', 'Noodles'],
    categoryIds: ['chinese'],
    rating: 4.0,
    ratingCount: 610,
    deliveryTimeMins: 28,
    costForTwo: 400,
    image: '/images/dishes/hakka-noodles.png',
    isPureVeg: false,
    isOpen: false,
    offsetKm: { north: -2.9, east: 2.8 },
  },
  {
    id: 'annapurna-thali',
    name: 'Annapurna Thali',
    cuisines: ['Thali', 'Gujarati', 'Rajasthani'],
    categoryIds: ['thali', 'desserts'],
    rating: 4.6,
    ratingCount: 2400,
    deliveryTimeMins: 32,
    costForTwo: 350,
    image: '/images/dishes/thali.png',
    isPureVeg: true,
    isOpen: true,
    offer: 'Flat ₹75 off',
    offsetKm: { north: 0.4, east: -3.6 },
  },
  {
    // Deliberately ~7 km out to exercise the 5 km radius filter.
    id: 'mithai-mahal',
    name: 'Mithai Mahal',
    cuisines: ['Desserts', 'Sweets'],
    categoryIds: ['desserts', 'beverages'],
    rating: 4.7,
    ratingCount: 3100,
    deliveryTimeMins: 40,
    costForTwo: 250,
    image: '/images/dishes/gulab-jamun.png',
    isPureVeg: true,
    isOpen: true,
    offsetKm: { north: 6.0, east: 4.0 },
  },
]

export function buildDemoRestaurants(center: GeoPoint): Restaurant[] {
  return RESTAURANT_SEEDS.map(({ offsetKm, ...seed }) => ({
    ...seed,
    location: offsetPoint(center, offsetKm.north, offsetKm.east),
  }))
}

export const DEMO_MENU_ITEMS: MenuItem[] = [
  { id: 'srb-1', restaurantId: 'spice-route-biryani', name: 'Hyderabadi Chicken Dum Biryani', description: 'Slow-cooked basmati, tender chicken, saffron and fried onions. Served with raita.', price: 349, isVeg: false, image: '/images/dishes/biryani.png', categoryId: 'biryani', isBestseller: true },
  { id: 'srb-2', restaurantId: 'spice-route-biryani', name: 'Veg Dum Biryani', description: 'Seasonal vegetables layered with fragrant rice and whole spices.', price: 279, isVeg: true, image: '/images/dishes/biryani.png', categoryId: 'biryani' },
  { id: 'srb-3', restaurantId: 'spice-route-biryani', name: 'Mutton Biryani', description: 'Rich, slow-braised mutton biryani with mirchi ka salan.', price: 449, isVeg: false, image: '/images/dishes/biryani.png', categoryId: 'biryani' },
  { id: 'srb-4', restaurantId: 'spice-route-biryani', name: 'Gulab Jamun (2 pcs)', description: 'Warm khoya dumplings soaked in cardamom syrup.', price: 99, isVeg: true, image: '/images/dishes/gulab-jamun.png', categoryId: 'desserts' },

  { id: 'dj-1', restaurantId: 'dosa-junction', name: 'Masala Dosa', description: 'Crisp rice-lentil crepe with spiced potato, sambar and coconut chutney.', price: 129, isVeg: true, image: '/images/dishes/dosa.png', categoryId: 'south-indian', isBestseller: true },
  { id: 'dj-2', restaurantId: 'dosa-junction', name: 'Ghee Roast Dosa', description: 'Paper-thin dosa roasted in pure ghee.', price: 159, isVeg: true, image: '/images/dishes/dosa.png', categoryId: 'south-indian' },
  { id: 'dj-3', restaurantId: 'dosa-junction', name: 'Kulhad Masala Chai', description: 'Strong tea brewed with ginger, cardamom and cinnamon.', price: 39, isVeg: true, image: '/images/dishes/masala-chai.png', categoryId: 'beverages' },

  { id: 'tt-1', restaurantId: 'tandoor-tales', name: 'Butter Chicken', description: 'Charred tandoori chicken in a velvety tomato-butter gravy.', price: 379, isVeg: false, image: '/images/dishes/butter-chicken.png', categoryId: 'north-indian', isBestseller: true },
  { id: 'tt-2', restaurantId: 'tandoor-tales', name: 'Paneer Tikka', description: 'Cottage cheese cubes marinated in spiced yoghurt, char-grilled.', price: 299, isVeg: true, image: '/images/dishes/tandoori.png', categoryId: 'north-indian' },
  { id: 'tt-3', restaurantId: 'tandoor-tales', name: 'Tandoori Chicken (Half)', description: 'Classic clay-oven chicken with mint chutney and onion rings.', price: 329, isVeg: false, image: '/images/dishes/tandoori.png', categoryId: 'north-indian' },

  { id: 'cs-1', restaurantId: 'chaat-street', name: 'Pani Puri (8 pcs)', description: 'Crisp puris with spiced potato, tangy mint water and tamarind.', price: 79, isVeg: true, image: '/images/dishes/pani-puri.png', categoryId: 'street-food', isBestseller: true },
  { id: 'cs-2', restaurantId: 'chaat-street', name: 'Dahi Puri', description: 'Puris topped with sweet curd, chutneys and sev.', price: 99, isVeg: true, image: '/images/dishes/pani-puri.png', categoryId: 'street-food' },
  { id: 'cs-3', restaurantId: 'chaat-street', name: 'Cutting Chai', description: 'Half-glass of sweet, milky masala chai.', price: 29, isVeg: true, image: '/images/dishes/masala-chai.png', categoryId: 'beverages' },

  { id: 'bp-1', restaurantId: 'bombay-pav-co', name: 'Butter Pav Bhaji', description: 'Mashed vegetable bhaji with two buttered pavs, onion and lemon.', price: 149, isVeg: true, image: '/images/dishes/pav-bhaji.png', categoryId: 'street-food', isBestseller: true },
  { id: 'bp-2', restaurantId: 'bombay-pav-co', name: 'Cheese Pav Bhaji', description: 'Our classic bhaji, loaded with grated cheese.', price: 179, isVeg: true, image: '/images/dishes/pav-bhaji.png', categoryId: 'street-food' },

  { id: 'wr-1', restaurantId: 'wok-and-roll', name: 'Veg Hakka Noodles', description: 'Wok-tossed noodles with crunchy vegetables and soy.', price: 189, isVeg: true, image: '/images/dishes/hakka-noodles.png', categoryId: 'chinese', isBestseller: true },
  { id: 'wr-2', restaurantId: 'wok-and-roll', name: 'Chilli Chicken Noodles', description: 'Hakka noodles tossed with spicy chilli chicken.', price: 229, isVeg: false, image: '/images/dishes/hakka-noodles.png', categoryId: 'chinese' },

  { id: 'at-1', restaurantId: 'annapurna-thali', name: 'Gujarati Thali', description: 'Dal, kadhi, two sabzis, rotli, rice, farsan and sweet.', price: 299, isVeg: true, image: '/images/dishes/thali.png', categoryId: 'thali', isBestseller: true },
  { id: 'at-2', restaurantId: 'annapurna-thali', name: 'Rajasthani Thali', description: 'Dal baati churma, gatte ki sabzi, kadhi and more.', price: 349, isVeg: true, image: '/images/dishes/thali.png', categoryId: 'thali' },
  { id: 'at-3', restaurantId: 'annapurna-thali', name: 'Gulab Jamun (2 pcs)', description: 'Soft, syrupy and served warm.', price: 79, isVeg: true, image: '/images/dishes/gulab-jamun.png', categoryId: 'desserts' },

  { id: 'mm-1', restaurantId: 'mithai-mahal', name: 'Gulab Jamun (4 pcs)', description: 'House-made with fresh khoya.', price: 129, isVeg: true, image: '/images/dishes/gulab-jamun.png', categoryId: 'desserts', isBestseller: true },
  { id: 'mm-2', restaurantId: 'mithai-mahal', name: 'Kesar Chai', description: 'Saffron-infused milk tea.', price: 49, isVeg: true, image: '/images/dishes/masala-chai.png', categoryId: 'beverages' },
]
