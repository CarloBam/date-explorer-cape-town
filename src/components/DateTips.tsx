import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronDown, ChevronUp, Heart, Sparkles, ShoppingBag, PenLine } from "lucide-react";
import { Activity } from "@/lib/dateData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DateTipsProps {
  activities: Activity[];
  scheduledDate?: Date;
}

function isSpecialOccasion(date?: Date): boolean {
  if (!date) return false;
  const daysAway = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return daysAway >= 7;
}

const generalTips = [
  { emoji: "🎧", tip: "Make a playlist of songs she likes and play it during the drive or walk" },
  { emoji: "📱", tip: "Put your phone on silent. Be fully present" },
  { emoji: "👃", tip: "Smell good! A little cologne goes a long way" },
  { emoji: "👂", tip: "Ask open-ended questions and actually listen to her answers" },
  { emoji: "😄", tip: "Compliment something specific: her laugh, her style, her energy" },
  { emoji: "🚗", tip: "Arrive on time or 5 min early. First impressions matter" },
  { emoji: "💡", tip: "Have a backup plan if something falls through. She'll appreciate your flexibility" },
  { emoji: "📸", tip: "Take a sneaky photo of her smiling and send it to her after the date" },
  { emoji: "🌹", tip: "If you know her favourite flower, bring one stem. Simple but powerful" },
  { emoji: "🧥", tip: "Bring an extra jacket in case she gets cold. Instant hero move" },
];

function getActivityTips(activities: Activity[]): { activity: string; emoji: string; tips: string[] }[] {
  const tipsMap: { activity: string; emoji: string; tips: string[] }[] = [];

  for (const a of activities) {
    // Use prepTips from the activity data if available
    if (a.prepTips && a.prepTips.length > 0) {
      tipsMap.push({ activity: a.name, emoji: a.image, tips: a.prepTips });
      continue;
    }

    // Fallback: generate tips based on category/tags
    const tips: string[] = [];

    if (a.category === "beach" || a.tags.includes("beach")) {
      tips.push("Bring sunscreen, towels, and a beach umbrella");
      tips.push("Pack cold drinks and light snacks");
      tips.push("Bring a waterproof bag for phones and wallets");
    }

    if (a.category === "mountain" || a.tags.includes("nature")) {
      tips.push("Wear comfortable walking/hiking shoes");
      tips.push("Bring water and a light snack");
      tips.push("Check the weather. Layers are your friend");
    }

    if (a.category === "food" || a.tags.includes("food")) {
      tips.push("Check if reservations are needed and book ahead");
      tips.push("Ask about dietary restrictions beforehand");
    }

    if (a.tags.includes("romantic") && a.category === "chill") {
      tips.push("Bring a blanket and cushions for comfort");
      tips.push("Pack cheese, crackers, fruit, and sparkling water");
      tips.push("Add a small bouquet of flowers");
      tips.push("Bring real glasses instead of plastic cups");
      tips.push("A Bluetooth speaker with a soft playlist is perfect");
    }

    if (a.category === "nightlife") {
      tips.push("Check dress code if it's a rooftop or upscale bar");
      tips.push("Book a table in advance for sunset spots");
    }

    if (a.category === "adventure") {
      tips.push("Wear clothes you can move in");
      tips.push("Check booking requirements, many need advance reservation");
    }

    if (a.category === "coffee") {
      tips.push("Try something she hasn't had before. Ask the barista for recommendations");
    }

    if (tips.length > 0) {
      tipsMap.push({ activity: a.name, emoji: a.image, tips });
    }
  }

  return tipsMap;
}

export function DateTips({ activities, scheduledDate }: DateTipsProps) {
  const [showGeneral, setShowGeneral] = useState(false);
  const [showPrep, setShowPrep] = useState(true);
  const [showLetter, setShowLetter] = useState(false);
  const [letter, setLetter] = useState("");

  const activityTips = getActivityTips(activities);
  const showLoveLetterOption = isSpecialOccasion(scheduledDate);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-bold text-foreground">
          Tips to Nail This Date 💪
        </h3>
      </div>

      {/* Activity-specific prep */}
      {activityTips.length > 0 && (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <button
            onClick={() => setShowPrep(!showPrep)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <span className="flex items-center gap-2 font-display font-semibold text-foreground">
              <ShoppingBag className="h-4 w-4 text-primary" />
              What to Prepare & Bring
            </span>
            {showPrep ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {showPrep && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 space-y-4">
                  {activityTips.map((at, i) => (
                    <div key={i}>
                      <p className="text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                        <span>{at.emoji}</span> {at.activity}
                      </p>
                      <ul className="space-y-1 ml-6">
                        {at.tips.map((tip, j) => (
                          <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* General dating tips */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <button
          onClick={() => setShowGeneral(!showGeneral)}
          className="w-full flex items-center justify-between px-5 py-4 text-left"
        >
          <span className="flex items-center gap-2 font-display font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            General Date Tips
          </span>
          {showGeneral ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        <AnimatePresence>
          {showGeneral && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4">
                <ul className="space-y-2">
                  {generalTips.map((t, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="shrink-0">{t.emoji}</span>
                      {t.tip}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Love letter option, only for dates a week+ away */}
      {showLoveLetterOption && (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <button
            onClick={() => setShowLetter(!showLetter)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <span className="flex items-center gap-2 font-display font-semibold text-foreground">
              <Heart className="h-4 w-4 text-destructive" />
              Write a Love Note 💌
            </span>
            {showLetter ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {showLetter && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Since the date is a while away, write her a love note to include with the invite. 
                    It could be a memory, a compliment, or just why you're excited about this date.
                  </p>
                  <Textarea
                    value={letter}
                    onChange={(e) => setLetter(e.target.value)}
                    placeholder="Hey beautiful, I've been planning something special for us..."
                    rows={4}
                    className="resize-none"
                  />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <PenLine className="h-3 w-3" />
                    <span>This will be included when you share the date plan</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
