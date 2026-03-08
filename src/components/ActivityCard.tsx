import { motion } from "framer-motion";
import { Plus, Check, Tag, MapPin, Clock, Star, ChevronRight, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Activity, getNearbyActivities, isGreatMatch } from "@/lib/dateData";
import { useDatePlan } from "@/lib/dateContext";
import { useState } from "react";

interface ActivityCardProps {
  activity: Activity;
  showNearby?: boolean;
}

export function ActivityCard({ activity, showNearby = true }: ActivityCardProps) {
  const { addActivity, removeActivity, isInPlan, datePlan } = useDatePlan();
  const inPlan = isInPlan(activity.id);
  const [showNearbyList, setShowNearbyList] = useState(false);
  const nearby = showNearby ? getNearbyActivities(activity.id) : [];
  const greatMatch = isGreatMatch(activity, datePlan.quizAnswers);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-warm"
    >
      {/* Great match badge */}
      {greatMatch && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-1 text-xs font-semibold text-accent-foreground">
          <Star className="h-3 w-3 text-accent" /> Great match
        </div>
      )}

      {/* Top section */}
      <div className="relative flex items-start gap-4 p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-3xl">
          {activity.image}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground leading-tight">
                {activity.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {activity.area}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {activity.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-accent" />
                  {activity.rating}
                </span>
                {activity.requiresCar && (
                  <span className="flex items-center gap-1 text-primary">
                    <Car className="h-3.5 w-3.5" />
                    Car needed
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className={`font-display text-lg font-bold ${activity.estimatedCost === 0 ? "text-secondary" : "text-foreground"}`}>
                {activity.estimatedCost === 0 ? "FREE" : `R${activity.estimatedCost}`}
              </div>
              {activity.estimatedCost > 0 && (
                <div className="text-xs text-muted-foreground">per person</div>
              )}
            </div>
          </div>

          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {activity.description}
          </p>

          {/* Tags */}
          <div className="mt-2 flex flex-wrap gap-1">
            {activity.tags.slice(0, 4).map(tag => (
              <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>

          {activity.deals && (
            <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-accent/15 px-3 py-1.5 text-xs font-medium text-accent-foreground">
              <Tag className="h-3.5 w-3.5 text-primary" />
              {activity.deals}
            </div>
          )}
        </div>
      </div>

      {/* Action area */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        {nearby.length > 0 && showNearby && (
          <button
            onClick={() => setShowNearbyList(!showNearbyList)}
            className="flex items-center gap-1 text-xs font-medium text-secondary hover:text-secondary/80 transition-colors"
          >
            <span>Nearby: {nearby.map(n => n.name).slice(0, 2).join(", ")}</span>
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${showNearbyList ? "rotate-90" : ""}`} />
          </button>
        )}
        {!nearby.length && <div />}

        <Button
          variant={inPlan ? "outline" : "add-to-date"}
          size="sm"
          onClick={() => inPlan ? removeActivity(activity.id) : addActivity(activity)}
          className="gap-1.5"
        >
          {inPlan ? (
            <>
              <Check className="h-4 w-4" /> Added
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Add to Date
            </>
          )}
        </Button>
      </div>

      {/* Nearby activities dropdown */}
      {showNearbyList && nearby.length > 0 && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          className="border-t border-border bg-muted/50 px-5 py-3"
        >
          <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Nearby — easy to combine!
          </p>
          {nearby.map(n => (
            <NearbyRow key={n.id} activity={n} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

function NearbyRow({ activity }: { activity: Activity }) {
  const { addActivity, isInPlan } = useDatePlan();
  const inPlan = isInPlan(activity.id);

  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <span className="text-lg">{activity.image}</span>
        <span className="text-sm font-medium text-foreground">{activity.name}</span>
        <span className="text-xs text-muted-foreground">
          {activity.estimatedCost === 0 ? "Free" : `R${activity.estimatedCost}`}
        </span>
      </div>
      {!inPlan && (
        <button
          onClick={() => addActivity(activity)}
          className="text-xs font-medium text-secondary hover:text-secondary/80"
        >
          + Add
        </button>
      )}
      {inPlan && (
        <span className="text-xs text-muted-foreground">✓ Added</span>
      )}
    </div>
  );
}
