import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Tag, MapPin, Clock, Star, ChevronRight, ChevronDown, Car, ExternalLink, MessageSquare, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Activity, getNearbyActivities, isGreatMatch } from "@/lib/dateData";
import { useDatePlan } from "@/lib/dateContext";
import { useState } from "react";

interface ActivityCardProps {
  activity: Activity;
  showNearby?: boolean;
}

export function ActivityCard({ activity, showNearby = true }: ActivityCardProps) {
  const { addActivity, removeActivity, isInPlan, datePlan, getDisplayCost, getDisplayRange, pricingMode } = useDatePlan();
  const inPlan = isInPlan(activity.id);
  const [showNearbyList, setShowNearbyList] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const nearby = showNearby ? getNearbyActivities(activity.id) : [];
  const greatMatch = isGreatMatch(activity, datePlan.quizAnswers);

  const hasDetails = (activity.reviews && activity.reviews.length > 0) || (activity.prepTips && activity.prepTips.length > 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-warm"
    >
      {/* Great match badge */}
      {greatMatch && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-1 text-xs font-semibold text-accent-foreground backdrop-blur-sm">
          <Star className="h-3 w-3 text-accent" /> Great match
        </div>
      )}

      {/* Top section — clickable to expand */}
      <button
        onClick={() => hasDetails && setExpanded(!expanded)}
        className="relative flex w-full items-start gap-4 p-5 text-left"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-3xl">
          {activity.image}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
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

            <div className={`text-right shrink-0 ${greatMatch ? "mt-6" : ""}`}>
              <div className={`font-display font-bold ${activity.estimatedCost === 0 ? "text-secondary text-lg" : "text-foreground text-base"}`}>
                {getDisplayRange(activity.estimatedCost, activity.costMax)}
              </div>
              {activity.estimatedCost > 0 && (
                <div className="text-xs text-muted-foreground">{pricingMode === "for-two" ? "for two" : "per person"}</div>
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

          {/* Expand hint */}
          {hasDetails && (
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
              {expanded ? "Show less" : `See reviews & details${activity.reviews ? ` (${activity.reviews.length})` : ""}`}
            </div>
          )}
        </div>
      </button>

      {/* Expanded details section */}
      <AnimatePresence>
        {expanded && hasDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 py-4 space-y-4">
              {/* Reviews */}
              {activity.reviews && activity.reviews.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">What people are saying</span>
                    <span className="text-xs text-muted-foreground">from Google Maps</span>
                  </div>
                  <div className="space-y-3">
                    {activity.reviews.map((review, i) => (
                      <div key={i} className="rounded-lg bg-muted/60 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">{review.author}</span>
                          <span className="text-xs text-muted-foreground">{review.timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-0.5 mb-1.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              className={`h-3 w-3 ${j < review.rating ? "text-accent fill-accent" : "text-muted-foreground/30"}`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">"{review.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prep tips */}
              {activity.prepTips && activity.prepTips.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">Date prep tips</span>
                  </div>
                  <ul className="space-y-1.5">
                    {activity.prepTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action area */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <div className="flex items-center gap-3">
          {activity.websiteUrl && (
            <a
              href={activity.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3" /> Book / Info
            </a>
          )}
          {activity.menuUrl && (
            <a
              href={activity.menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3" /> Menu
            </a>
          )}
          {nearby.length > 0 && showNearby && (
            <button
              onClick={() => setShowNearbyList(!showNearbyList)}
              className="flex items-center gap-1 text-xs font-medium text-secondary hover:text-secondary/80 transition-colors"
            >
              <span>Nearby: {nearby.map(n => n.name).slice(0, 2).join(", ")}</span>
              <ChevronRight className={`h-3.5 w-3.5 transition-transform ${showNearbyList ? "rotate-90" : ""}`} />
            </button>
          )}
        </div>
        {!nearby.length && !activity.websiteUrl && <div />}

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
            Nearby, easy to combine!
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
