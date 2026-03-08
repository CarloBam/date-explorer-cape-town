import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Fuel, Receipt, Share2, Tag, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDatePlan } from "@/lib/dateContext";
import { getDistanceBetween, calculatePetrolCost, calculateUberEstimate } from "@/lib/dateData";
import { WeatherWidget } from "@/components/WeatherWidget";

export function DateSummary() {
  const { datePlan, totalCost, setStep } = useDatePlan();
  const { activities, budget } = datePlan;
  const hasCar = datePlan.quizAnswers.hasCar !== false;

  let totalDistance = 0;
  for (let i = 0; i < activities.length - 1; i++) {
    totalDistance += getDistanceBetween(activities[i].area, activities[i + 1].area);
  }
  const petrolCost = calculatePetrolCost(totalDistance);
  const uberCost = calculateUberEstimate(totalDistance);
  const transportCost = hasCar ? petrolCost : uberCost;
  const grandTotal = totalCost + transportCost;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Button variant="ghost" onClick={() => setStep("browse")} className="mb-6 gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to activities
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8 text-center">
            <div className="mb-4 text-5xl">💝</div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              Date Plan Ready!
            </h1>
            <p className="text-muted-foreground">Here's your curated Cape Town date</p>
          </div>

          {/* Weather */}
          <div className="mb-6">
            <WeatherWidget />
          </div>

          {/* Timeline */}
          <div className="space-y-0">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative">
                {index < activities.length - 1 && (
                  <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-border" />
                )}

                <div className="flex gap-4 pb-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full gradient-sunset text-xl shadow-warm">
                    {activity.image}
                  </div>

                  <div className="flex-1 rounded-xl border border-border bg-card p-4 shadow-card">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {activity.name}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" /> {activity.area}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {activity.duration}
                          </span>
                        </div>
                      </div>
                      <span className={`font-display font-bold ${activity.estimatedCost === 0 ? "text-secondary" : "text-foreground"}`}>
                        {activity.estimatedCost === 0 ? "FREE" : `R${activity.estimatedCost}`}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{activity.description}</p>
                    {activity.deals && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary">
                        <Tag className="h-3 w-3" /> {activity.deals}
                      </div>
                    )}
                  </div>
                </div>

                {/* Distance to next */}
                {index < activities.length - 1 && (
                  <div className="ml-14 -mt-3 mb-3 text-xs text-muted-foreground flex items-center gap-1">
                    {hasCar ? (
                      <>
                        <Car className="h-3 w-3" />
                        {getDistanceBetween(activity.area, activities[index + 1].area)} km drive
                      </>
                    ) : (
                      <>
                        🚕 {getDistanceBetween(activity.area, activities[index + 1].area)} km — Uber ≈ R{calculateUberEstimate(getDistanceBetween(activity.area, activities[index + 1].area))}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Cost summary */}
          <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Receipt className="h-5 w-5" /> Cost Breakdown
            </h3>
            {activities.map(a => (
              <div key={a.id} className="flex justify-between py-1.5 text-sm">
                <span className="text-muted-foreground">{a.image} {a.name}</span>
                <span className="font-medium text-foreground">
                  {a.estimatedCost === 0 ? "Free" : `R${a.estimatedCost}`}
                </span>
              </div>
            ))}
            {totalDistance > 0 && (
              <>
                <div className="flex justify-between py-1.5 text-sm border-t border-border mt-2 pt-2">
                  <span className="text-muted-foreground flex items-center gap-1">
                    {hasCar ? <Fuel className="h-3.5 w-3.5" /> : <span>🚕</span>}
                    {hasCar ? `Petrol (${totalDistance} km)` : `Uber (${totalDistance} km)`}
                  </span>
                  <span className="font-medium text-foreground">~R{transportCost}</span>
                </div>
                {hasCar && (
                  <div className="text-xs text-muted-foreground mt-1 pl-5">
                    R23.80/L × 9.5L/100km × {totalDistance}km
                  </div>
                )}
              </>
            )}
            <div className="flex justify-between border-t border-border mt-2 pt-3 text-lg font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-gradient-sunset">R{grandTotal}</span>
            </div>
            <div className={`flex justify-between text-sm mt-1 ${budget - grandTotal < 0 ? "text-destructive" : "text-secondary"}`}>
              <span>{budget - grandTotal >= 0 ? "✓ Budget remaining" : "⚠️ Over budget"}</span>
              <span className="font-bold">R{budget - grandTotal}</span>
            </div>
          </div>

          {/* Share button */}
          <div className="mt-6 flex gap-3">
            <Button variant="hero" className="flex-1 gap-2">
              <Share2 className="h-4 w-4" /> Share Date Plan
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setStep("browse")}>
              Edit Plan
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
