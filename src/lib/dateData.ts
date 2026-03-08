export interface Activity {
  id: string;
  name: string;
  category: "beach" | "mountain" | "food" | "adventure" | "culture" | "nightlife" | "chill" | "scenic" | "coffee" | "dessert";
  area: string;
  estimatedCost: number;
  durationMin: number;
  duration: string;
  description: string;
  vibe: ("introvert" | "extrovert" | "romantic" | "adventurous" | "chill")[];
  tags: string[];
  deals?: string;
  nearbyIds?: string[];
  image: string;
  rating: number;
  requiresCar: boolean;
  prepTips?: string[];
}

export interface QuizAnswer {
  personality: "introvert" | "extrovert" | "ambivert";
  setting: "beach" | "mountains" | "city";
  vibe: "nature" | "culture" | "spontaneous" | "romantic";
  energy: "chill" | "active" | "mix";
  food: "coffee" | "restaurant" | "street-food";
  time: "morning" | "afternoon" | "evening" | "fullday";
  hasCar: boolean;
  budget: number;
}

export const quizQuestions = [
  {
    id: "personality",
    question: "How would you describe her personality?",
    subtitle: "Think about how she acts when she's most comfortable — this helps us match the right energy for the date",
    options: [
      { value: "introvert", label: "The Deep Thinker", emoji: "🌙", description: "She'd pick a quiet wine bar over a club any day. She lights up during one-on-one conversations, loves journaling, and recharges with alone time" },
      { value: "extrovert", label: "The Life of the Party", emoji: "🎉", description: "She's the one organising group plans, loves live music and crowded markets, and gets her energy from being around people" },
      { value: "ambivert", label: "The Chameleon", emoji: "✨", description: "She can dance all night or binge a series on the couch — she reads the room and vibes with whatever feels right" },
    ],
  },
  {
    id: "setting",
    question: "What kind of scenery makes her happiest?",
    subtitle: "Picture her in her element — where does she look most at peace or most alive?",
    options: [
      { value: "beach", label: "Ocean Girl", emoji: "🏖️", description: "She's drawn to the sound of waves, loves walking barefoot on sand, and would happily spend a whole day by the water watching the sunset" },
      { value: "mountains", label: "Nature Lover", emoji: "⛰️", description: "She comes alive on hiking trails, feels at home in the winelands, and always says yes to a drive with mountain views" },
      { value: "city", label: "City Soul", emoji: "🏙️", description: "She thrives in buzzing neighbourhoods, loves discovering hidden cafés, street art, and trendy spots — the city is her playground" },
    ],
  },
  {
    id: "vibe",
    question: "What feeling do you want to create?",
    subtitle: "Imagine the perfect moment on this date — what does the atmosphere feel like?",
    options: [
      { value: "nature", label: "Earthy & Grounded", emoji: "🌿", description: "Think barefoot on grass, botanical gardens, farm stalls — a date that feels wholesome and connected to nature" },
      { value: "culture", label: "Cultured & Refined", emoji: "🎨", description: "Wine tastings, gallery walks, jazz bars — a date that sparks interesting conversations and feels sophisticated" },
      { value: "spontaneous", label: "Playful & Unexpected", emoji: "🎯", description: "Mini golf, street food crawls, surprise stops — a date full of laughs where you're both just going with the flow" },
      { value: "romantic", label: "Dreamy & Intimate", emoji: "💫", description: "Sunset picnics, fairy lights, a boat ride — the kind of date that makes her heart skip a beat and feel truly special" },
    ],
  },
  {
    id: "energy",
    question: "How active is she?",
    subtitle: "Does she prefer to kick back or stay on the move? This shapes the pace of the whole date",
    options: [
      { value: "chill", label: "Low-Key & Cozy", emoji: "☕", description: "She'd rather sip coffee at a cute spot, browse a bookshop, and take a slow stroll — no rush, no sweat" },
      { value: "active", label: "Always Moving", emoji: "🚀", description: "She's the type to suggest a sunrise hike, try surfing, or walk 15k steps without blinking — she loves adventure" },
      { value: "mix", label: "Start Slow, Build Up", emoji: "🎯", description: "She likes easing into the day — maybe brunch first, then something active like kayaking or exploring a new area" },
    ],
  },
  {
    id: "time",
    question: "When are you planning the date?",
    subtitle: "Different times unlock different experiences — morning dates have a totally different magic to evening ones",
    options: [
      { value: "morning", label: "Morning Date (8am–12pm)", emoji: "🌅", description: "Sunrise hikes, farmers' markets, beachfront brunch — fresh energy and golden light. Perfect if she's an early bird" },
      { value: "afternoon", label: "Afternoon Date (12–5pm)", emoji: "☀️", description: "Wine farms, long lunches, exploring neighbourhoods — the sweet spot for relaxed vibes with great natural light" },
      { value: "evening", label: "Evening Date (5pm+)", emoji: "🌆", description: "Sunset cocktails, dinner with a view, rooftop bars — the classic romantic setting with city lights and warm atmosphere" },
      { value: "fullday", label: "Full Day Adventure", emoji: "🌈", description: "Go all in — morning coffee, afternoon exploring, evening dinner. Perfect for when you really want to make an impression" },
    ],
  },
  {
    id: "hasCar",
    question: "How are you getting around?",
    subtitle: "This changes which areas and activities we can recommend — some of Cape Town's best spots need a car to reach",
    options: [
      { value: "true", label: "I've Got a Car", emoji: "🚗", description: "Nice! This opens up the winelands, Chapman's Peak, Cape Point, and all the hidden gems that are tricky to Uber to" },
      { value: "false", label: "Uber / MyCiTi", emoji: "🚕", description: "No stress — we'll keep everything in easy-to-reach areas like the CBD, Waterfront, Sea Point, and well-connected spots" },
    ],
  },
];

// Area coordinates for Haversine distance calculation
export const areaCoordinates: Record<string, { lat: number; lng: number }> = {
  "V&A Waterfront": { lat: -33.902, lng: 18.421 },
  "Table Mountain": { lat: -33.957, lng: 18.403 },
  "Signal Hill": { lat: -33.921, lng: 18.400 },
  "Southern Suburbs": { lat: -33.988, lng: 18.432 },
  "Constantia": { lat: -34.024, lng: 18.437 },
  "Atlantic Seaboard": { lat: -33.942, lng: 18.375 },
  "Simon's Town": { lat: -34.198, lng: 18.450 },
  "Hout Bay": { lat: -34.085, lng: 18.361 },
  "CBD": { lat: -33.929, lng: 18.424 },
  "De Waterkant": { lat: -33.921, lng: 18.414 },
  "Woodstock": { lat: -33.929, lng: 18.448 },
  "Canal Walk": { lat: -33.893, lng: 18.513 },
  "Green Point": { lat: -33.904, lng: 18.406 },
  "Sea Point": { lat: -33.927, lng: 18.387 },
  "Cape Point": { lat: -34.356, lng: 18.497 },
  "Camps Bay": { lat: -33.951, lng: 18.378 },
  "Newlands": { lat: -33.988, lng: 18.458 },
  "Muizenberg": { lat: -34.109, lng: 18.471 },
  "Kalk Bay": { lat: -34.130, lng: 18.448 },
  "Stellenbosch": { lat: -33.934, lng: 18.860 },
  "Franschhoek": { lat: -33.913, lng: 19.118 },
  "Observatory": { lat: -33.937, lng: 18.472 },
  "Bo-Kaap": { lat: -33.920, lng: 18.416 },
  "Noordhoek": { lat: -34.107, lng: 18.375 },
  "Durbanville": { lat: -33.832, lng: 18.647 },
  "Bloubergstrand": { lat: -33.810, lng: 18.459 },
  "Hermanus": { lat: -34.418, lng: 19.235 },
};

// Haversine formula for accurate distance calculation
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1.3 * 10) / 10;
}

export function getDistanceBetween(area1: string, area2: string): number {
  const c1 = areaCoordinates[area1];
  const c2 = areaCoordinates[area2];
  if (!c1 || !c2) return 0;
  if (area1 === area2) return 0;
  return Math.round(haversineDistance(c1.lat, c1.lng, c2.lat, c2.lng));
}

// March 2026 petrol: R23.80/L, consumption: 9.5L/100km
export function calculatePetrolCost(distanceKm: number, pricePerLitre: number = 23.80, consumption: number = 9.5): number {
  return Math.round((distanceKm / 100) * consumption * pricePerLitre);
}

// Uber estimate: ~R3.80/km + R15 base
export function calculateUberEstimate(distanceKm: number): number {
  if (distanceKm <= 0) return 0;
  return Math.round(15 + distanceKm * 3.80);
}

export const activities: Activity[] = [
  // ─── V&A WATERFRONT ───
  {
    id: "aquarium",
    name: "Two Oceans Aquarium",
    category: "culture",
    area: "V&A Waterfront",
    estimatedCost: 250,
    durationMin: 90,
    duration: "90 min",
    description: "Explore the wonders of the Atlantic and Indian Oceans. Perfect for a unique, memorable date.",
    vibe: ["introvert", "romantic"],
    tags: ["culture", "romantic", "indoor"],
    deals: "Book online for R20 off!",
    nearbyIds: ["waterfront-cruise", "zeitz-mocaa", "unframed-icecream", "waterfront-wheel"],
    image: "🐠",
    rating: 4.7,
    requiresCar: false,
  },
  {
    id: "waterfront-cruise",
    name: "Harbour Sunset Cruise",
    category: "adventure",
    area: "V&A Waterfront",
    estimatedCost: 300,
    durationMin: 75,
    duration: "75 min",
    description: "Sail into the sunset with Table Mountain as your backdrop. Complimentary sparkling wine included.",
    vibe: ["romantic", "chill"],
    tags: ["romantic", "scenic", "luxury"],
    deals: "Book 48hrs ahead for best availability",
    nearbyIds: ["aquarium", "zeitz-mocaa"],
    image: "⛵",
    rating: 4.8,
    requiresCar: false,
  },
  {
    id: "zeitz-mocaa",
    name: "Zeitz MOCAA Museum",
    category: "culture",
    area: "V&A Waterfront",
    estimatedCost: 230,
    durationMin: 90,
    duration: "90 min",
    description: "Africa's largest contemporary art museum in a stunning converted grain silo. Thought-provoking and inspiring.",
    vibe: ["introvert", "romantic"],
    tags: ["culture", "art", "indoor"],
    deals: "Free entry for SA citizens on Wednesdays!",
    nearbyIds: ["aquarium", "waterfront-cruise"],
    image: "🎨",
    rating: 4.6,
    requiresCar: false,
  },
  {
    id: "waterfront-wheel",
    name: "Cape Wheel",
    category: "scenic",
    area: "V&A Waterfront",
    estimatedCost: 180,
    durationMin: 30,
    duration: "30 min",
    description: "Giant observation wheel with stunning harbour and mountain views. Extra romantic in the VIP gondola with bubbly!",
    vibe: ["romantic", "chill"],
    tags: ["scenic", "romantic", "fun"],
    deals: "VIP gondola with champagne: R450 for two",
    nearbyIds: ["aquarium", "zeitz-mocaa"],
    image: "🎡",
    rating: 4.3,
    requiresCar: false,
  },

  // ─── TABLE MOUNTAIN & SIGNAL HILL ───
  {
    id: "table-mountain",
    name: "Table Mountain Cable Car",
    category: "mountain",
    area: "Table Mountain",
    estimatedCost: 430,
    durationMin: 120,
    duration: "2 hours",
    description: "Ride the revolving cable car for panoramic views of Cape Town, the ocean, and beyond. A must-do experience.",
    vibe: ["adventurous", "romantic"],
    tags: ["nature", "scenic", "adventure"],
    deals: "Book online to skip the queue. Afternoon tickets from R370",
    image: "🏔️",
    rating: 4.9,
    requiresCar: false,
  },
  {
    id: "signal-hill",
    name: "Signal Hill Sunset",
    category: "scenic",
    area: "Signal Hill",
    estimatedCost: 0,
    durationMin: 90,
    duration: "90 min",
    description: "Watch the sun dip below the Atlantic from this iconic viewpoint. Bring a blanket and wine for extra romance.",
    vibe: ["romantic", "chill"],
    tags: ["romantic", "scenic", "nature", "free"],
    image: "🌅",
    rating: 4.7,
    requiresCar: true,
    prepTips: ["Bring a blanket and cushion", "Pack a bottle of wine/bubbly and glasses", "Arrive 45 min before sunset for a good spot", "Bring a Bluetooth speaker for soft music"],
  },
  {
    id: "lions-head",
    name: "Lion's Head Hike",
    category: "mountain",
    area: "Signal Hill",
    estimatedCost: 0,
    durationMin: 180,
    duration: "3 hours",
    description: "360° views of Cape Town from the summit. Best at sunset or full moon. An unforgettable adventure date!",
    vibe: ["adventurous", "extrovert"],
    tags: ["nature", "adventure", "free", "active"],
    image: "🦁",
    rating: 4.9,
    requiresCar: false,
    prepTips: ["Bring water and a headlamp if doing sunset", "Wear proper hiking shoes", "Pack a small snack for the top", "Check the full moon calendar for extra magic"],
  },

  // ─── SOUTHERN SUBURBS & CONSTANTIA ───
  {
    id: "kirstenbosch",
    name: "Kirstenbosch Gardens",
    category: "mountain",
    area: "Southern Suburbs",
    estimatedCost: 250,
    durationMin: 150,
    duration: "2.5 hours",
    description: "World-class botanical gardens with the Boomslang tree canopy walkway. Pack a picnic for the ultimate date.",
    vibe: ["introvert", "romantic", "chill"],
    tags: ["nature", "romantic", "scenic"],
    deals: "Sunday sunset concerts in summer!",
    image: "🌿",
    rating: 4.8,
    requiresCar: true,
    prepTips: ["Pack a picnic blanket and basket", "Bring charcuterie, fruit, bread, cheese & sparkling water", "Walk the Boomslang canopy walkway together", "If she likes flowers, learn a few names to impress her"],
  },
  {
    id: "wine-tasting",
    name: "Constantia Wine Tasting",
    category: "food",
    area: "Constantia",
    estimatedCost: 220,
    durationMin: 150,
    duration: "2.5 hours",
    description: "Historic wine estates in SA's oldest wine region. Tastings, cheese boards, and gorgeous gardens.",
    vibe: ["romantic", "chill", "introvert"],
    tags: ["culture", "romantic", "luxury", "food"],
    deals: "Groot Constantia: R120 for 5 wines",
    image: "🍷",
    rating: 4.7,
    requiresCar: true,
  },
  {
    id: "newlands-forest",
    name: "Newlands Forest Walk",
    category: "mountain",
    area: "Newlands",
    estimatedCost: 0,
    durationMin: 90,
    duration: "90 min",
    description: "Shady forest trails with towering trees and a gentle stream. Peaceful, quiet, and incredibly romantic.",
    vibe: ["introvert", "romantic", "chill"],
    tags: ["nature", "romantic", "free"],
    image: "🌲",
    rating: 4.5,
    requiresCar: true,
    prepTips: ["Bring water and a light jacket — it's cooler under the trees", "The contour path is gentle and perfect for chatting"],
  },

  // ─── BEACHES ───
  {
    id: "clifton-beach",
    name: "Clifton 4th Beach",
    category: "beach",
    area: "Atlantic Seaboard",
    estimatedCost: 0,
    durationMin: 150,
    duration: "2.5 hours",
    description: "Sheltered from the wind with stunning turquoise water and white sand. Cape Town's most glamorous beach.",
    vibe: ["romantic", "chill", "extrovert"],
    tags: ["beach", "romantic", "free", "scenic"],
    image: "🏖️",
    rating: 4.6,
    requiresCar: false,
    prepTips: ["Bring a beach umbrella and towels", "Pack cold drinks and snacks", "The water is freezing — brave it together for bonus points!", "Arrive early in summer for a good spot"],
  },
  {
    id: "camps-bay-beach",
    name: "Camps Bay Beach & Strip",
    category: "beach",
    area: "Camps Bay",
    estimatedCost: 0,
    durationMin: 120,
    duration: "2 hours",
    description: "Palm-lined beach with the Twelve Apostles as backdrop. Walk the strip, grab a drink at one of the beachfront restaurants.",
    vibe: ["extrovert", "romantic", "chill"],
    tags: ["beach", "scenic", "free", "romantic"],
    image: "🌴",
    rating: 4.5,
    requiresCar: false,
  },
  {
    id: "boulder-penguins",
    name: "Boulders Beach Penguins",
    category: "beach",
    area: "Simon's Town",
    estimatedCost: 220,
    durationMin: 90,
    duration: "90 min",
    description: "See the famous African penguin colony up close. A truly unique Cape Town experience she'll never forget.",
    vibe: ["romantic", "chill"],
    tags: ["nature", "scenic", "beach"],
    image: "🐧",
    rating: 4.7,
    requiresCar: true,
  },
  {
    id: "muizenberg-surf",
    name: "Muizenberg Surf Lesson",
    category: "adventure",
    area: "Muizenberg",
    estimatedCost: 500,
    durationMin: 120,
    duration: "2 hours",
    description: "Learn to surf together on beginner-friendly waves. Colourful beach huts make the perfect photo backdrop.",
    vibe: ["adventurous", "extrovert"],
    tags: ["adventure", "beach", "active", "fun"],
    deals: "Couples lessons available — ask for a deal!",
    image: "🏄",
    rating: 4.6,
    requiresCar: true,
  },
  {
    id: "muizenberg-walk",
    name: "Muizenberg Beach Walk",
    category: "beach",
    area: "Muizenberg",
    estimatedCost: 0,
    durationMin: 60,
    duration: "1 hour",
    description: "Stroll along the iconic colourful beach huts. Warm water, long sandy beach, and a relaxed False Bay vibe.",
    vibe: ["romantic", "chill"],
    tags: ["beach", "scenic", "free", "romantic"],
    image: "🎨",
    rating: 4.4,
    requiresCar: true,
  },
  {
    id: "llandudno",
    name: "Llandudno Beach",
    category: "beach",
    area: "Atlantic Seaboard",
    estimatedCost: 0,
    durationMin: 120,
    duration: "2 hours",
    description: "Secluded, stunning, and uncrowded. Massive boulders create a private paradise — perfect for a romantic escape.",
    vibe: ["romantic", "introvert", "chill"],
    tags: ["beach", "scenic", "free", "romantic"],
    image: "🪨",
    rating: 4.7,
    requiresCar: true,
  },

  // ─── SCENIC DRIVES & NATURE ───
  {
    id: "chapmans-peak",
    name: "Chapman's Peak Drive",
    category: "scenic",
    area: "Hout Bay",
    estimatedCost: 60,
    durationMin: 60,
    duration: "1 hour",
    description: "One of the world's most scenic coastal drives. Stop at viewpoints for photos and jaw-dropping ocean views.",
    vibe: ["romantic", "adventurous"],
    tags: ["scenic", "adventure", "romantic"],
    image: "🛣️",
    rating: 4.9,
    requiresCar: true,
  },
  {
    id: "cape-point",
    name: "Cape Point Nature Reserve",
    category: "adventure",
    area: "Cape Point",
    estimatedCost: 380,
    durationMin: 240,
    duration: "4 hours",
    description: "Where the Atlantic meets the Indian Ocean. Dramatic cliffs, hiking, and the iconic lighthouse.",
    vibe: ["adventurous", "romantic"],
    tags: ["nature", "adventure", "scenic"],
    deals: "Bring a picnic — restaurants are pricey",
    image: "🌊",
    rating: 4.8,
    requiresCar: true,
    prepTips: ["Pack lunch and snacks — food inside is expensive", "Wear layers — it's windy at the point", "Walk to the old lighthouse for the best views"],
  },
  {
    id: "noordhoek-beach",
    name: "Noordhoek Long Beach Walk",
    category: "beach",
    area: "Noordhoek",
    estimatedCost: 0,
    durationMin: 90,
    duration: "90 min",
    description: "8km of wild, untouched beach. Dramatic dunes, shipwreck views, and total serenity. Great for horse riding too!",
    vibe: ["romantic", "chill", "introvert"],
    tags: ["beach", "nature", "free", "scenic"],
    image: "🐎",
    rating: 4.6,
    requiresCar: true,
  },

  // ─── CITY / CBD / BO-KAAP ───
  {
    id: "truth-coffee",
    name: "Truth Coffee Roasting",
    category: "coffee",
    area: "CBD",
    estimatedCost: 130,
    durationMin: 75,
    duration: "75 min",
    description: "Voted best coffee shop in the world. Steampunk-themed interior with incredible coffee and conversation vibes.",
    vibe: ["introvert", "chill"],
    tags: ["coffee", "culture", "indoor"],
    image: "☕",
    rating: 4.8,
    requiresCar: false,
  },
  {
    id: "rooftop-shift",
    name: "Rooftop Bar at The Shift",
    category: "nightlife",
    area: "CBD",
    estimatedCost: 280,
    durationMin: 120,
    duration: "2 hours",
    description: "Craft cocktails with panoramic city views from a trendy rooftop. Perfect for a sunset start or nightcap.",
    vibe: ["extrovert", "romantic"],
    tags: ["nightlife", "romantic", "luxury"],
    image: "🍸",
    rating: 4.5,
    requiresCar: false,
  },
  {
    id: "bo-kaap-walk",
    name: "Bo-Kaap Walking Tour",
    category: "culture",
    area: "Bo-Kaap",
    estimatedCost: 0,
    durationMin: 60,
    duration: "1 hour",
    description: "Wander through the colourful streets of the Bo-Kaap. Learn the history, take stunning photos, and soak in the charm.",
    vibe: ["introvert", "romantic", "chill"],
    tags: ["culture", "scenic", "free", "romantic"],
    image: "🏘️",
    rating: 4.5,
    requiresCar: false,
  },
  {
    id: "bo-kaap-cooking",
    name: "Cape Malay Cooking Class",
    category: "food",
    area: "Bo-Kaap",
    estimatedCost: 850,
    durationMin: 180,
    duration: "3 hours",
    description: "Learn to cook traditional Cape Malay dishes together in a local home. Includes the meal you make! Intimate and unique.",
    vibe: ["introvert", "romantic"],
    tags: ["food", "culture", "romantic", "indoor"],
    image: "👨‍🍳",
    rating: 4.9,
    requiresCar: false,
  },

  // ─── FOOD & MARKETS ───
  {
    id: "ozcf-market",
    name: "Oranjezicht City Farm Market",
    category: "food",
    area: "De Waterkant",
    estimatedCost: 250,
    durationMin: 90,
    duration: "90 min",
    description: "Fresh produce, artisan foods, and local crafts in a vibrant weekend market with harbour views.",
    vibe: ["extrovert", "chill"],
    tags: ["food", "culture", "fun"],
    deals: "Saturdays & Sundays only!",
    image: "🥘",
    rating: 4.5,
    requiresCar: false,
  },
  {
    id: "neighbourgoods",
    name: "Neighbourgoods Market",
    category: "food",
    area: "Woodstock",
    estimatedCost: 220,
    durationMin: 90,
    duration: "90 min",
    description: "Street food from around the world, craft vendors, and live music. Cape Town's favourite Saturday market.",
    vibe: ["extrovert", "chill"],
    tags: ["food", "culture", "fun"],
    deals: "Saturdays only! 9am – 2pm",
    image: "🎪",
    rating: 4.5,
    requiresCar: false,
  },
  {
    id: "harbour-house",
    name: "Harbour House Kalk Bay",
    category: "food",
    area: "Kalk Bay",
    estimatedCost: 600,
    durationMin: 120,
    duration: "2 hours",
    description: "Upscale seafood right on the ocean. Waves literally crash against the windows. One of Cape Town's most romantic restaurants.",
    vibe: ["romantic", "introvert"],
    tags: ["food", "romantic", "luxury", "scenic"],
    image: "🦞",
    rating: 4.7,
    requiresCar: true,
  },
  {
    id: "kalk-bay-stroll",
    name: "Kalk Bay Village Stroll",
    category: "chill",
    area: "Kalk Bay",
    estimatedCost: 100,
    durationMin: 90,
    duration: "90 min",
    description: "Browse antique shops, art galleries, and quirky bookstores in this charming seaside village. Grab fish & chips at Kalky's!",
    vibe: ["introvert", "romantic", "chill"],
    tags: ["culture", "scenic", "romantic"],
    image: "🎣",
    rating: 4.5,
    requiresCar: true,
  },

  // ─── ADVENTURE & FUN ───
  {
    id: "cave-golf",
    name: "Cave Golf",
    category: "adventure",
    area: "Canal Walk",
    estimatedCost: 140,
    durationMin: 90,
    duration: "90 min",
    description: "Glow-in-the-dark mini golf in a cave setting. Fun, competitive, and great for breaking the ice!",
    vibe: ["extrovert", "adventurous"],
    tags: ["fun", "adventure", "indoor"],
    deals: "Couples special on Tuesdays — 2-for-1!",
    image: "⛳",
    rating: 4.3,
    requiresCar: false,
  },
  {
    id: "paragliding",
    name: "Tandem Paragliding",
    category: "adventure",
    area: "Signal Hill",
    estimatedCost: 1600,
    durationMin: 30,
    duration: "30 min",
    description: "Fly off Signal Hill and land on the beach! An adrenaline-pumping experience with insane views of Cape Town.",
    vibe: ["adventurous", "extrovert"],
    tags: ["adventure", "active", "scenic"],
    deals: "Book for two and ask for a discount",
    image: "🪂",
    rating: 4.9,
    requiresCar: false,
  },
  {
    id: "abseil-table-mountain",
    name: "Table Mountain Abseil",
    category: "adventure",
    area: "Table Mountain",
    estimatedCost: 1250,
    durationMin: 60,
    duration: "1 hour",
    description: "Abseil off the top of Table Mountain — 112m drop! The world's highest commercial abseil. Not for the faint-hearted!",
    vibe: ["adventurous", "extrovert"],
    tags: ["adventure", "active", "scenic"],
    image: "🧗",
    rating: 4.8,
    requiresCar: false,
  },
  {
    id: "kayak-simons-town",
    name: "Kayaking with Penguins",
    category: "adventure",
    area: "Simon's Town",
    estimatedCost: 600,
    durationMin: 120,
    duration: "2 hours",
    description: "Paddle alongside African penguins in Simon's Town harbour. Guides included. A once-in-a-lifetime date!",
    vibe: ["adventurous", "romantic"],
    tags: ["adventure", "nature", "active"],
    image: "🛶",
    rating: 4.7,
    requiresCar: true,
  },

  // ─── DESSERT & SWEET SPOTS ───
  {
    id: "unframed-icecream",
    name: "Unframed Ice Cream",
    category: "dessert",
    area: "De Waterkant",
    estimatedCost: 90,
    durationMin: 30,
    duration: "30 min",
    description: "Artisan ice cream made with local ingredients. Perfect sweet stop between activities.",
    vibe: ["romantic", "chill"],
    tags: ["dessert", "fun", "quick"],
    image: "🍦",
    rating: 4.4,
    requiresCar: false,
  },
  {
    id: "honest-chocolate",
    name: "Honest Chocolate Café",
    category: "dessert",
    area: "CBD",
    estimatedCost: 120,
    durationMin: 45,
    duration: "45 min",
    description: "Bean-to-bar chocolate in a cozy courtyard café. Try the hot chocolate and truffles — pure indulgence.",
    vibe: ["introvert", "romantic", "chill"],
    tags: ["dessert", "romantic", "indoor"],
    image: "🍫",
    rating: 4.6,
    requiresCar: false,
  },

  // ─── CHILL & PICNIC ───
  {
    id: "green-point-picnic",
    name: "Green Point Park Picnic",
    category: "chill",
    area: "Green Point",
    estimatedCost: 180,
    durationMin: 120,
    duration: "2 hours",
    description: "Beautiful urban park with a biodiversity garden. Pack a picnic basket and enjoy the sunshine together.",
    vibe: ["romantic", "chill", "introvert"],
    tags: ["romantic", "nature", "free"],
    image: "🧺",
    rating: 4.3,
    requiresCar: false,
    prepTips: [
      "Pack a proper picnic: cheese board, baguette, grapes, cold meats, hummus",
      "Bring a big blanket and cushions for comfort",
      "Add a small bouquet of her favourite flowers",
      "Bring sparkling water or juice with wine glasses (real ones!)",
      "Pack wet wipes and a small cutting board",
      "A Bluetooth speaker with a soft playlist goes a long way",
    ],
  },
  {
    id: "sea-point-promenade",
    name: "Sea Point Promenade Walk",
    category: "chill",
    area: "Sea Point",
    estimatedCost: 0,
    durationMin: 90,
    duration: "90 min",
    description: "Scenic seaside walk along Cape Town's most vibrant promenade. People watching, art, and ocean views.",
    vibe: ["chill", "romantic"],
    tags: ["free", "scenic", "beach", "romantic"],
    image: "🚶",
    rating: 4.4,
    requiresCar: false,
  },
  {
    id: "observatory-lower-main",
    name: "Lower Main Road Obs",
    category: "nightlife",
    area: "Observatory",
    estimatedCost: 200,
    durationMin: 120,
    duration: "2 hours",
    description: "Bohemian bars, live music, and quirky restaurants in Cape Town's most eclectic neighbourhood. Great for a fun night out.",
    vibe: ["extrovert", "adventurous"],
    tags: ["nightlife", "fun", "culture"],
    image: "🎵",
    rating: 4.3,
    requiresCar: false,
  },

  // ─── COFFEE ───
  {
    id: "rosetta-roastery",
    name: "Rosetta Roastery",
    category: "coffee",
    area: "De Waterkant",
    estimatedCost: 100,
    durationMin: 60,
    duration: "1 hour",
    description: "Specialty single-origin coffee in a minimal, design-forward space. Great for quiet morning dates.",
    vibe: ["introvert", "chill"],
    tags: ["coffee", "indoor"],
    image: "☕",
    rating: 4.6,
    requiresCar: false,
  },
  {
    id: "espresso-lab",
    name: "Espresso Lab",
    category: "coffee",
    area: "CBD",
    estimatedCost: 110,
    durationMin: 60,
    duration: "1 hour",
    description: "Trendy micro-roastery with a lab-like setup. Watch them brew with precision. Great conversation starter.",
    vibe: ["introvert", "chill"],
    tags: ["coffee", "culture", "indoor"],
    image: "🧪",
    rating: 4.5,
    requiresCar: false,
  },

  // ─── WINELANDS ───
  {
    id: "stellenbosch-wine",
    name: "Stellenbosch Wine Route",
    category: "food",
    area: "Stellenbosch",
    estimatedCost: 400,
    durationMin: 300,
    duration: "5 hours",
    description: "Visit 2-3 stunning wine estates in the heart of the Winelands. Tastings, cheese platters, and oak-lined streets.",
    vibe: ["romantic", "chill", "introvert"],
    tags: ["food", "romantic", "luxury", "culture"],
    deals: "Consider a wine tram for a car-free option!",
    image: "🍇",
    rating: 4.8,
    requiresCar: true,
    prepTips: ["Book tastings in advance — popular estates fill up", "Spier, Delaire Graff, and Jordan are great picks", "Have a designated driver or book a wine tour"],
  },
  {
    id: "franschhoek-tram",
    name: "Franschhoek Wine Tram",
    category: "food",
    area: "Franschhoek",
    estimatedCost: 320,
    durationMin: 300,
    duration: "5 hours",
    description: "Hop-on-hop-off wine tram through the Franschhoek valley. Visit multiple estates without driving. Pure romance!",
    vibe: ["romantic", "chill"],
    tags: ["food", "romantic", "luxury", "culture", "scenic"],
    deals: "Book weeks in advance — sells out fast!",
    image: "🚂",
    rating: 4.9,
    requiresCar: true,
    prepTips: ["Book at least 2 weeks in advance", "Pack sunscreen and a hat", "Eat breakfast — the tastings add up!"],
  },

  // ─── DURBANVILLE & BLOUBERG ───
  {
    id: "durbanville-wine",
    name: "Durbanville Wine Valley",
    category: "food",
    area: "Durbanville",
    estimatedCost: 280,
    durationMin: 180,
    duration: "3 hours",
    description: "Lesser-known wine farms with stunning views. Less crowds, more intimate. Try D'Aria or Hillcrest for great setups.",
    vibe: ["romantic", "chill", "introvert"],
    tags: ["food", "romantic", "scenic"],
    image: "🏡",
    rating: 4.4,
    requiresCar: true,
  },
  {
    id: "blouberg-sunset",
    name: "Bloubergstrand Sunset",
    category: "beach",
    area: "Bloubergstrand",
    estimatedCost: 0,
    durationMin: 90,
    duration: "90 min",
    description: "The iconic Table Mountain photo spot across the bay. Long beach walk with golden sunset views.",
    vibe: ["romantic", "chill"],
    tags: ["beach", "scenic", "free", "romantic"],
    image: "📸",
    rating: 4.5,
    requiresCar: true,
  },
];

// Point-based scoring algorithm
export function scoreActivity(activity: Activity, answers: Partial<QuizAnswer>): number {
  let score = 0;

  if (answers.personality) {
    if (answers.personality === "introvert" && activity.vibe.includes("introvert")) score += 3;
    if (answers.personality === "extrovert" && activity.vibe.includes("extrovert")) score += 3;
    if (answers.personality === "ambivert") score += 1;
  }

  if (answers.setting) {
    if (answers.setting === "beach" && (activity.category === "beach" || activity.tags.includes("beach"))) score += 3;
    if (answers.setting === "mountains" && (activity.category === "mountain" || activity.tags.includes("nature"))) score += 3;
    if (answers.setting === "city" && (activity.category === "culture" || activity.category === "nightlife" || activity.category === "coffee" || activity.tags.includes("culture"))) score += 3;
  }

  if (answers.energy) {
    if (answers.energy === "chill" && activity.vibe.includes("chill")) score += 2;
    if (answers.energy === "active" && (activity.vibe.includes("adventurous") || activity.tags.includes("active"))) score += 2;
    if (answers.energy === "mix") score += 1;
  }

  if (answers.vibe) {
    if (answers.vibe === "nature" && activity.tags.includes("nature")) score += 2;
    if (answers.vibe === "culture" && activity.tags.includes("culture")) score += 2;
    if (answers.vibe === "spontaneous" && activity.tags.includes("fun")) score += 2;
    if (answers.vibe === "romantic" && activity.tags.includes("romantic")) score += 2;
  }

  return score;
}

export function getRecommendedActivities(answers: Partial<QuizAnswer>): Activity[] {
  const scored = activities
    .filter(a => {
      if (answers.hasCar === false && a.requiresCar) return false;
      return true;
    })
    .map(a => ({ activity: a, score: scoreActivity(a, answers) }))
    .sort((a, b) => b.score - a.score);

  return scored.map(s => s.activity);
}

export function isGreatMatch(activity: Activity, answers: Partial<QuizAnswer>): boolean {
  return scoreActivity(activity, answers) >= 5;
}

export function getNearbyActivities(activityId: string): Activity[] {
  const activity = activities.find(a => a.id === activityId);
  if (!activity?.nearbyIds) return [];
  return activities.filter(a => activity.nearbyIds?.includes(a.id));
}
