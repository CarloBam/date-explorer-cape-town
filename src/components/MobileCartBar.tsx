import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronUp, ArrowRight, Receipt, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDatePlan } from "@/lib/dateContext";
import { getDistanceBetween, calculatePetrolCost, calculateUberEstimate } from "@/lib/dateData";
import { useState } from "react";

export function MobileCartBar() {
  const { datePlan, totalCost, setStep } = useDatePlan();
  const { activities, budget } = datePlan;
  const hasCar = datePlan.quizAnswers.hasCar !== false;
  const [expanded, setExpanded] = useState(false);

  let totalDistance = 0;
  for (let i = 0; i < activities.length - 1; i++) {
    totalDistance += getDistanceBetween(activities[i].area, activities[i + 1].area);
  }
  const petrolCost = calculatePetrolCost(totalDistance);
  const uberCost = calculateUberEstimate(totalDistance);
  const transportCost = hasCar ? petrolCost : uberCost;
  const grandTotal = totalCost + transportCost;
  const remaining = budget - grandTotal;

  // Total time
  const totalTimeMin = activities.reduce((s, a) => s + a.durationMin, 0) + Math.max(0, activities.length - 1) * 10;
  const timeStr = (() => {
    const h = Math.floor(totalTimeMin / 60);
    const m = totalTimeMin % 60;
    return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
  })();

  if (activities.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-card border-t border-border overflow-hidden"
          >
            <div className="px-4 py-3 max-h-[40vh] overflow-y-auto">
              {activities.map((a, i) => (
                <div key={a.id} className="flex items-center gap-2 py-1.5 text-sm">
                  <span className="text-lg">{a.image}</span>
                  <span className="flex-1 truncate text-foreground font-medium">{a.name}</span>
                  <span className="text-muted-foreground text-xs shrink-0">
                    {a.estimatedCost === 0 ? "Free" : `R${a.estimatedCost}`}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-card border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-sunset">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-foreground">
                {activities.length} {activities.length === 1 ? "activity" : "activities"}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Receipt className="h-3 w-3" /> R{grandTotal}
                </span>
                <span className="flex items-center gap-0.5">
                  <Clock className="h-3 w-3" /> ~{timeStr}
                </span>
                <span className={remaining < 0 ? "text-destructive font-medium" : "text-secondary"}>
                  {remaining >= 0 ? `R${remaining} left` : `R${Math.abs(remaining)} over`}
                </span>
              </div>
            </div>
          </div>
          <ChevronUp className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        <div className="px-4 pb-4 pt-0">
          <Button
            variant="hero"
            className="w-full gap-2"
            onClick={() => setStep("summary")}
          >
            View Date Summary <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
