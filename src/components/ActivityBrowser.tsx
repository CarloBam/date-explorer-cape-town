import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActivityCard } from "@/components/ActivityCard";
import { DateCart } from "@/components/DateCart";
import { WeatherWidget } from "@/components/WeatherWidget";
import { useDatePlan } from "@/lib/dateContext";
import { activities, getRecommendedActivities } from "@/lib/dateData";

const categories = [
  { value: "all", label: "All", emoji: "✨" },
  { value: "beach", label: "Beach", emoji: "🏖️" },
  { value: "mountain", label: "Nature", emoji: "⛰️" },
  { value: "food", label: "Food & Drinks", emoji: "🍽️" },
  { value: "adventure", label: "Adventure", emoji: "🚀" },
  { value: "culture", label: "Culture", emoji: "🎨" },
  { value: "coffee", label: "Coffee", emoji: "☕" },
  { value: "nightlife", label: "Nightlife", emoji: "🍸" },
  { value: "scenic", label: "Scenic", emoji: "🌅" },
  { value: "chill", label: "Chill", emoji: "🧺" },
  { value: "dessert", label: "Dessert", emoji: "🍦" },
];

export function ActivityBrowser() {
  const { datePlan, setStep } = useDatePlan();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showRecommended, setShowRecommended] = useState(
    Object.keys(datePlan.quizAnswers).length > 0
  );

  const recommended = getRecommendedActivities(datePlan.quizAnswers);
  const baseActivities = showRecommended ? recommended : activities;

  // Filter car-required activities if no car
  const filtered = baseActivities.filter(a => {
    if (datePlan.quizAnswers.hasCar === false && a.requiresCar) return false;
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.area.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || a.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setStep("quiz")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Pick Your Activities
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-body">
                Budget: <span className="font-bold text-foreground">R{datePlan.budget}</span>
              </span>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities or areas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {Object.keys(datePlan.quizAnswers).length > 0 && (
              <Button
                variant={showRecommended ? "default" : "outline"}
                size="sm"
                onClick={() => setShowRecommended(!showRecommended)}
                className="shrink-0 gap-1"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {showRecommended ? "For Her ✨" : "Show All"}
              </Button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  category === cat.value
                    ? "gradient-sunset text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Activity list */}
          <div className="space-y-4">
            {/* Weather widget */}
            <WeatherWidget />

            {showRecommended && recommended.length > 0 && (
              <div className="mb-2 rounded-lg bg-ocean-light/50 border border-secondary/20 px-4 py-3">
                <p className="text-sm font-medium text-foreground flex items-center gap-1">
                  <Star className="h-4 w-4 text-accent" />
                  Curated picks based on her vibe — activities with ⭐ are great matches!
                </p>
              </div>
            )}
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-lg text-muted-foreground">No activities match your search</p>
              </div>
            )}
            {filtered.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>

          {/* Cart sidebar */}
          <div className="lg:sticky lg:top-40 lg:self-start">
            <DateCart />
          </div>
        </div>
      </div>
    </div>
  );
}
