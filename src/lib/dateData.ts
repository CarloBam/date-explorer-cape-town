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
    question: "What's her vibe?",
    subtitle: "Help us understand what kind of date she'd love",
    options: [
      { value: "introvert", label: "Quiet & Intimate", emoji: "🌙", description: "She loves deep conversations and cozy spots" },
      { value: "extrovert", label: "Social & Energetic", emoji: "🎉", description: "She thrives in lively, vibrant environments" },
      { value: "ambivert", label: "Best of Both", emoji: "✨", description: "She enjoys a mix of calm and excitement" },
    ],
  },
  {
    id: "setting",
    question: "Where does she shine?",
    subtitle: "Pick the scenery that matches her energy",
    options: [
      { value: "beach", label: "Beach & Ocean", emoji: "🏖️", description: "Sunset walks, waves, and salty air" },
      { value: "mountains", label: "Mountains & Nature", emoji: "⛰️", description: "Hiking trails, views, and fresh air" },
      { value: "city", label: "City & Culture", emoji: "🏙️", description: "Art, food, music, and urban vibes" },
    ],
  },
  {
    id: "vibe",
    question: "What's the date vibe?",
    subtitle: "Choose the feeling you want to create",
    options: [
      { value: "nature", label: "Nature & Outdoors", emoji: "🌿", description: "Fresh air, trails, and natural beauty" },
      { value: "culture", label: "Art, Wine & Culture", emoji: "🎨", description: "Galleries, wine tasting, and inspiration" },
      { value: "spontaneous", label: "Fun & Spontaneous", emoji: "🎯", description: "Mini golf, markets, and surprises" },
      { value: "romantic", label: "Dreamy & Romantic", emoji: "💫", description: "Sunset cruises, picnics, and magic" },
    ],
  },
  {
    id: "energy",
    question: "What's the energy level?",
    subtitle: "How active should the date be?",
    options: [
      { value: "chill", label: "Easy & Relaxed", emoji: "☕", description: "Coffee, strolls, and easy vibes" },
      { value: "active", label: "Get Up & Go", emoji: "🚀", description: "Hiking, surfing, or exploring" },
      { value: "mix", label: "A Bit of Movement", emoji: "🎯", description: "Start chill, end with a bang" },
    ],
  },
  {
    id: "time",
    question: "What time of day?",
    subtitle: "When's the date happening?",
    options: [
      { value: "morning", label: "Morning (8am–12pm)", emoji: "🌅", description: "Sunrise vibes and brunch" },
      { value: "afternoon", label: "Afternoon (12–5pm)", emoji: "☀️", description: "Golden hour and lunch" },
      { value: "evening", label: "Evening (5pm+)", emoji: "🌆", description: "Sunset, dinner, and night out" },
      { value: "fullday", label: "Full Day", emoji: "🌈", description: "All day adventure" },
    ],
  },
  {
    id: "hasCar",
    question: "Do you have wheels?",
    subtitle: "This helps us plan logistics and distance",
    options: [
      { value: "true", label: "Yes, I'm Driving", emoji: "🚗", description: "Freedom to go anywhere" },
      { value: "false", label: "Uber / MyCiTi Only", emoji: "🚕", description: "We'll keep it accessible" },
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
};

// Haversine formula for accurate distance calculation
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1.3 * 10) / 10; // 1.3x factor for road vs straight-line
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
  {
    id: "aquarium",
    name: "Two Oceans Aquarium",
    category: "culture",
    area: "V&A Waterfront",
    estimatedCost: 220,
    durationMin: 90,
    duration: "90 min",
    description: "Explore the wonders of the Atlantic and Indian Oceans. Perfect for a unique, memorable date.",
    vibe: ["introvert", "romantic"],
    tags: ["culture", "romantic", "indoor"],
    deals: "Book online for R20 off!",
    nearbyIds: ["waterfront-cruise", "zeitz-mocaa", "unframed-icecream"],
    image: "🐠",
    rating: 4.7,
    requiresCar: false,
  },
  {
    id: "waterfront-cruise",
    name: "Harbour Sunset Cruise",
    category: "adventure",
    area: "V&A Waterfront",
    estimatedCost: 280,
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
    estimatedCost: 200,
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
    id: "table-mountain",
    name: "Table Mountain Cable Car",
    category: "mountain",
    area: "Table Mountain",
    estimatedCost: 390,
    durationMin: 120,
    duration: "2 hours",
    description: "Ride the revolving cable car for panoramic views of Cape Town, the ocean, and beyond. A must-do experience.",
    vibe: ["adventurous", "romantic"],
    tags: ["nature", "scenic", "adventure"],
    deals: "Book online to skip the queue",
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
  },
  {
    id: "kirstenbosch",
    name: "Kirstenbosch Gardens",
    category: "mountain",
    area: "Southern Suburbs",
    estimatedCost: 220,
    durationMin: 150,
    duration: "2.5 hours",
    description: "World-class botanical gardens with the Boomslang tree canopy walkway. Pack a picnic for the ultimate date.",
    vibe: ["introvert", "romantic", "chill"],
    tags: ["nature", "romantic", "scenic"],
    deals: "Sunday sunset concerts in summer!",
    image: "🌿",
    rating: 4.8,
    requiresCar: true,
  },
  {
    id: "wine-tasting",
    name: "Constantia Wine Tasting",
    category: "food",
    area: "Constantia",
    estimatedCost: 200,
    durationMin: 150,
    duration: "2.5 hours",
    description: "Historic wine estates in SA's oldest wine region. Tastings, cheese boards, and gorgeous gardens.",
    vibe: ["romantic", "chill", "introvert"],
    tags: ["culture", "romantic", "luxury", "food"],
    deals: "Groot Constantia: R100 for 5 wines",
    image: "🍷",
    rating: 4.7,
    requiresCar: true,
  },
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
  },
  {
    id: "boulder-penguins",
    name: "Boulders Beach Penguins",
    category: "beach",
    area: "Simon's Town",
    estimatedCost: 215,
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
    id: "chapmans-peak",
    name: "Chapman's Peak Drive",
    category: "scenic",
    area: "Hout Bay",
    estimatedCost: 55,
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
    id: "truth-coffee",
    name: "Truth Coffee Roasting",
    category: "coffee",
    area: "CBD",
    estimatedCost: 120,
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
    id: "ozcf-market",
    name: "Oranjezicht City Farm Market",
    category: "food",
    area: "De Waterkant",
    estimatedCost: 220,
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
    id: "cave-golf",
    name: "Cave Golf",
    category: "adventure",
    area: "Canal Walk",
    estimatedCost: 130,
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
    id: "unframed-icecream",
    name: "Unframed Ice Cream",
    category: "dessert",
    area: "De Waterkant",
    estimatedCost: 80,
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
    id: "rooftop-shift",
    name: "Rooftop Bar at The Shift",
    category: "nightlife",
    area: "CBD",
    estimatedCost: 260,
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
    id: "green-point-picnic",
    name: "Green Point Park Picnic",
    category: "chill",
    area: "Green Point",
    estimatedCost: 160,
    durationMin: 120,
    duration: "2 hours",
    description: "Beautiful urban park with a biodiversity garden. Pack a picnic basket and enjoy the sunshine together.",
    vibe: ["romantic", "chill", "introvert"],
    tags: ["romantic", "nature", "free"],
    image: "🧺",
    rating: 4.3,
    requiresCar: false,
  },
  {
    id: "neighbourgoods",
    name: "Neighbourgoods Market",
    category: "food",
    area: "Woodstock",
    estimatedCost: 200,
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
    id: "cape-point",
    name: "Cape Point Nature Reserve",
    category: "adventure",
    area: "Cape Point",
    estimatedCost: 360,
    durationMin: 240,
    duration: "4 hours",
    description: "Where the Atlantic meets the Indian Ocean. Dramatic cliffs, hiking, and the iconic lighthouse.",
    vibe: ["adventurous", "romantic"],
    tags: ["nature", "adventure", "scenic"],
    deals: "Bring a picnic — restaurants are pricey",
    image: "🌊",
    rating: 4.8,
    requiresCar: true,
  },
];

// Point-based scoring algorithm
export function scoreActivity(activity: Activity, answers: Partial<QuizAnswer>): number {
  let score = 0;

  // +3 personality match
  if (answers.personality) {
    if (answers.personality === "introvert" && activity.vibe.includes("introvert")) score += 3;
    if (answers.personality === "extrovert" && activity.vibe.includes("extrovert")) score += 3;
    if (answers.personality === "ambivert") score += 1; // ambiverts get a small bonus for everything
  }

  // +3 setting match
  if (answers.setting) {
    if (answers.setting === "beach" && (activity.category === "beach" || activity.tags.includes("beach"))) score += 3;
    if (answers.setting === "mountains" && (activity.category === "mountain" || activity.tags.includes("nature"))) score += 3;
    if (answers.setting === "city" && (activity.category === "culture" || activity.category === "nightlife" || activity.category === "coffee" || activity.tags.includes("culture"))) score += 3;
  }

  // +2 energy match
  if (answers.energy) {
    if (answers.energy === "chill" && activity.vibe.includes("chill")) score += 2;
    if (answers.energy === "active" && (activity.vibe.includes("adventurous") || activity.tags.includes("active"))) score += 2;
    if (answers.energy === "mix") score += 1;
  }

  // +2 vibe category match
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
      // Hide car-required activities if no car
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
