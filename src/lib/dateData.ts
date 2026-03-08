export interface Activity {
  id: string;
  name: string;
  category: "beach" | "mountain" | "food" | "adventure" | "culture" | "nightlife" | "chill";
  area: string;
  estimatedCost: number;
  duration: string;
  description: string;
  vibe: ("introvert" | "extrovert" | "romantic" | "adventurous" | "chill")[];
  deals?: string;
  nearbyIds?: string[];
  image: string;
  rating: number;
}

export interface QuizAnswer {
  personality: "introvert" | "extrovert" | "ambivert";
  setting: "beach" | "mountains" | "city";
  energy: "chill" | "active" | "mix";
  food: "coffee" | "restaurant" | "street-food";
  time: "morning" | "afternoon" | "evening";
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
    id: "energy",
    question: "What's the energy level?",
    subtitle: "How active should the date be?",
    options: [
      { value: "chill", label: "Low-key & Relaxed", emoji: "☕", description: "Coffee, strolls, and easy vibes" },
      { value: "active", label: "Active & Adventurous", emoji: "🚀", description: "Hiking, surfing, or exploring" },
      { value: "mix", label: "A Bit of Everything", emoji: "🎯", description: "Start chill, end with a bang" },
    ],
  },
  {
    id: "food",
    question: "Food situation?",
    subtitle: "Every great date needs great food",
    options: [
      { value: "coffee", label: "Coffee & Pastries", emoji: "☕", description: "Artisan cafés and sweet treats" },
      { value: "restaurant", label: "Sit-down Restaurant", emoji: "🍽️", description: "A proper meal with atmosphere" },
      { value: "street-food", label: "Street Food & Markets", emoji: "🌮", description: "Casual eats and market vibes" },
    ],
  },
  {
    id: "time",
    question: "What time of day?",
    subtitle: "When's the date happening?",
    options: [
      { value: "morning", label: "Morning Date", emoji: "🌅", description: "Sunrise vibes and brunch" },
      { value: "afternoon", label: "Afternoon Date", emoji: "☀️", description: "Golden hour and lunch" },
      { value: "evening", label: "Evening Date", emoji: "🌆", description: "Sunset, dinner, and night out" },
    ],
  },
  {
    id: "hasCar",
    question: "Do you have wheels?",
    subtitle: "This helps us plan logistics and distance",
    options: [
      { value: "true", label: "Yes, I'm Driving", emoji: "🚗", description: "Freedom to go anywhere" },
      { value: "false", label: "No Car", emoji: "🚶", description: "We'll keep it walkable or Uber-friendly" },
    ],
  },
];

export const activities: Activity[] = [
  {
    id: "waterfront",
    name: "V&A Waterfront",
    category: "culture",
    area: "Waterfront",
    estimatedCost: 0,
    duration: "1-2 hours",
    description: "Stroll along the harbour, enjoy street performers, and take in Table Mountain views. Free to walk around!",
    vibe: ["extrovert", "romantic", "chill"],
    nearbyIds: ["aquarium", "waterfront-icecream", "cave-golf"],
    image: "🚢",
    rating: 4.5,
  },
  {
    id: "aquarium",
    name: "Two Oceans Aquarium",
    category: "culture",
    area: "Waterfront",
    estimatedCost: 220,
    duration: "1.5-2 hours",
    description: "Explore the wonders of the Atlantic and Indian Oceans. Perfect for a unique, memorable date.",
    vibe: ["introvert", "romantic"],
    deals: "10% off if you book online in advance!",
    nearbyIds: ["waterfront", "waterfront-icecream"],
    image: "🐠",
    rating: 4.7,
  },
  {
    id: "waterfront-icecream",
    name: "Honest Chocolate / Gelato",
    category: "food",
    area: "Waterfront",
    estimatedCost: 80,
    duration: "30 min",
    description: "Artisan gelato or craft chocolate — sweet treat to share between activities.",
    vibe: ["romantic", "chill"],
    nearbyIds: ["waterfront", "aquarium"],
    image: "🍦",
    rating: 4.4,
  },
  {
    id: "cave-golf",
    name: "Cave Golf",
    category: "adventure",
    area: "Waterfront",
    estimatedCost: 90,
    duration: "45 min - 1 hour",
    description: "Glow-in-the-dark mini golf in a cave setting. Fun, competitive, and great for breaking the ice!",
    vibe: ["extrovert", "adventurous"],
    deals: "Couples special on Tuesdays — 2-for-1!",
    nearbyIds: ["waterfront", "aquarium"],
    image: "⛳",
    rating: 4.3,
  },
  {
    id: "kirstenbosch",
    name: "Kirstenbosch Gardens",
    category: "mountain",
    area: "Newlands",
    estimatedCost: 80,
    duration: "2-3 hours",
    description: "One of the great botanical gardens of the world. Pack a picnic and enjoy the Boomslang tree canopy walkway.",
    vibe: ["introvert", "romantic", "chill"],
    deals: "Free entry on certain public holidays!",
    image: "🌿",
    rating: 4.8,
  },
  {
    id: "lions-head",
    name: "Lion's Head Hike",
    category: "mountain",
    area: "Signal Hill",
    estimatedCost: 0,
    duration: "2-3 hours",
    description: "360° views of Cape Town. Best at sunset or full moon. A must-do adventure date!",
    vibe: ["adventurous", "extrovert"],
    image: "🦁",
    rating: 4.9,
  },
  {
    id: "camps-bay",
    name: "Camps Bay Beach",
    category: "beach",
    area: "Camps Bay",
    estimatedCost: 0,
    duration: "1-3 hours",
    description: "Palm-lined beach with dramatic mountain backdrop. Perfect sunset spot with beachfront restaurants nearby.",
    vibe: ["romantic", "chill", "extrovert"],
    nearbyIds: ["camps-bay-restaurant"],
    image: "🏖️",
    rating: 4.6,
  },
  {
    id: "camps-bay-restaurant",
    name: "Café Caprice / Chinchilla",
    category: "food",
    area: "Camps Bay",
    estimatedCost: 350,
    duration: "1.5-2 hours",
    description: "Trendy beachfront dining with cocktails and ocean views. Great for a sunset dinner.",
    vibe: ["extrovert", "romantic"],
    deals: "Happy hour cocktails 4-6pm at Café Caprice",
    nearbyIds: ["camps-bay"],
    image: "🍸",
    rating: 4.4,
  },
  {
    id: "muizenberg",
    name: "Muizenberg Beach",
    category: "beach",
    area: "Muizenberg",
    estimatedCost: 0,
    duration: "1-3 hours",
    description: "Famous colourful beach huts, warm water, and great surf. Laid-back and fun.",
    vibe: ["adventurous", "chill"],
    nearbyIds: ["muizenberg-surf"],
    image: "🏄",
    rating: 4.5,
  },
  {
    id: "muizenberg-surf",
    name: "Surf Lesson at Muizenberg",
    category: "adventure",
    area: "Muizenberg",
    estimatedCost: 500,
    duration: "2 hours",
    description: "Learn to surf together! Boards, wetsuits, and instructor included.",
    vibe: ["adventurous", "extrovert"],
    deals: "R450 per person if booked as a couple",
    nearbyIds: ["muizenberg"],
    image: "🌊",
    rating: 4.6,
  },
  {
    id: "truth-coffee",
    name: "Truth Coffee Roasting",
    category: "food",
    area: "CBD",
    estimatedCost: 120,
    duration: "1 hour",
    description: "Voted the best coffee shop in the world. Steampunk-themed interior, incredible coffee.",
    vibe: ["introvert", "chill"],
    image: "☕",
    rating: 4.8,
  },
  {
    id: "old-biscuit-mill",
    name: "Old Biscuit Mill (Neighbourgoods Market)",
    category: "food",
    area: "Woodstock",
    estimatedCost: 200,
    duration: "1.5-2 hours",
    description: "Saturday market with street food from around the world, craft vendors, and live music.",
    vibe: ["extrovert", "chill"],
    deals: "Saturdays only! 9am - 2pm",
    image: "🥘",
    rating: 4.5,
  },
  {
    id: "zeitz-mocaa",
    name: "Zeitz MOCAA",
    category: "culture",
    area: "Waterfront",
    estimatedCost: 230,
    duration: "1.5-2 hours",
    description: "Africa's largest museum of contemporary art. Stunning architecture and thought-provoking exhibits.",
    vibe: ["introvert", "romantic"],
    deals: "Free entry for SA citizens on Wednesdays!",
    nearbyIds: ["waterfront", "aquarium"],
    image: "🎨",
    rating: 4.6,
  },
  {
    id: "chapmans-peak",
    name: "Chapman's Peak Drive",
    category: "adventure",
    area: "Hout Bay",
    estimatedCost: 52,
    duration: "30 min - 1 hour",
    description: "One of the most scenic drives in the world. Stop at viewpoints for photos and jaw-dropping ocean views.",
    vibe: ["romantic", "adventurous"],
    image: "🛣️",
    rating: 4.9,
  },
  {
    id: "wine-tasting",
    name: "Constantia Wine Tasting",
    category: "food",
    area: "Constantia",
    estimatedCost: 150,
    duration: "1.5-2 hours",
    description: "Historic wine estates in the oldest wine region in SA. Tastings, cheese boards, and gorgeous gardens.",
    vibe: ["romantic", "chill", "introvert"],
    deals: "Groot Constantia offers a R100 tasting that includes 5 wines",
    image: "🍷",
    rating: 4.7,
  },
  {
    id: "boulder-penguins",
    name: "Boulders Beach Penguins",
    category: "beach",
    area: "Simon's Town",
    estimatedCost: 176,
    duration: "1-1.5 hours",
    description: "See the famous African penguin colony up close. A truly unique Cape Town experience.",
    vibe: ["romantic", "chill"],
    nearbyIds: ["simons-town-fish"],
    image: "🐧",
    rating: 4.7,
  },
  {
    id: "simons-town-fish",
    name: "Fish & Chips at Kalky's",
    category: "food",
    area: "Kalk Bay",
    estimatedCost: 120,
    duration: "45 min",
    description: "Legendary fish & chips right on the harbour. Fresh catch of the day with a view.",
    vibe: ["chill"],
    nearbyIds: ["boulder-penguins"],
    image: "🐟",
    rating: 4.5,
  },
];

export const areaDistances: Record<string, Record<string, number>> = {
  "Waterfront": { "Camps Bay": 8, "CBD": 2, "Newlands": 12, "Muizenberg": 30, "Hout Bay": 20, "Constantia": 18, "Simon's Town": 40, "Woodstock": 5, "Signal Hill": 5 },
  "Camps Bay": { "Waterfront": 8, "CBD": 10, "Newlands": 15, "Muizenberg": 35, "Hout Bay": 15, "Signal Hill": 5, "Constantia": 20, "Simon's Town": 45, "Woodstock": 12 },
  "CBD": { "Waterfront": 2, "Camps Bay": 10, "Newlands": 10, "Muizenberg": 28, "Hout Bay": 22, "Constantia": 16, "Simon's Town": 38, "Woodstock": 3, "Signal Hill": 6 },
  "Newlands": { "Waterfront": 12, "Camps Bay": 15, "CBD": 10, "Muizenberg": 20, "Hout Bay": 25, "Constantia": 5, "Simon's Town": 30, "Woodstock": 8, "Signal Hill": 14 },
  "Muizenberg": { "Waterfront": 30, "Camps Bay": 35, "CBD": 28, "Newlands": 20, "Hout Bay": 45, "Constantia": 22, "Simon's Town": 12, "Woodstock": 25, "Signal Hill": 32 },
  "Hout Bay": { "Waterfront": 20, "Camps Bay": 15, "CBD": 22, "Newlands": 25, "Muizenberg": 45, "Constantia": 20, "Simon's Town": 55, "Woodstock": 24, "Signal Hill": 18 },
  "Constantia": { "Waterfront": 18, "Camps Bay": 20, "CBD": 16, "Newlands": 5, "Muizenberg": 22, "Hout Bay": 20, "Simon's Town": 28, "Woodstock": 14, "Signal Hill": 20 },
  "Simon's Town": { "Waterfront": 40, "Camps Bay": 45, "CBD": 38, "Newlands": 30, "Muizenberg": 12, "Hout Bay": 55, "Constantia": 28, "Woodstock": 35, "Signal Hill": 42 },
  "Woodstock": { "Waterfront": 5, "Camps Bay": 12, "CBD": 3, "Newlands": 8, "Muizenberg": 25, "Hout Bay": 24, "Constantia": 14, "Simon's Town": 35, "Signal Hill": 8 },
  "Signal Hill": { "Waterfront": 5, "Camps Bay": 5, "CBD": 6, "Newlands": 14, "Muizenberg": 32, "Hout Bay": 18, "Constantia": 20, "Simon's Town": 42, "Woodstock": 8 },
};

export function getDistanceBetween(area1: string, area2: string): number {
  return areaDistances[area1]?.[area2] ?? 0;
}

export function calculatePetrolCost(distanceKm: number, pricePerLitre: number = 23.5, consumption: number = 8): number {
  return Math.round((distanceKm / 100) * consumption * pricePerLitre);
}

export function getRecommendedActivities(answers: Partial<QuizAnswer>): Activity[] {
  return activities.filter((activity) => {
    let score = 0;
    if (answers.personality && activity.vibe.includes(answers.personality === "ambivert" ? "chill" : answers.personality)) score++;
    if (answers.setting === "beach" && activity.category === "beach") score++;
    if (answers.setting === "mountains" && activity.category === "mountain") score++;
    if (answers.setting === "city" && (activity.category === "culture" || activity.category === "nightlife")) score++;
    if (answers.energy === "chill" && activity.vibe.includes("chill")) score++;
    if (answers.energy === "active" && activity.vibe.includes("adventurous")) score++;
    if (answers.food === "coffee" && activity.id.includes("coffee")) score++;
    if (answers.food === "restaurant" && activity.category === "food") score++;
    return score > 0;
  }).sort((a, b) => b.rating - a.rating);
}

export function getNearbyActivities(activityId: string): Activity[] {
  const activity = activities.find(a => a.id === activityId);
  if (!activity?.nearbyIds) return [];
  return activities.filter(a => activity.nearbyIds?.includes(a.id));
}
