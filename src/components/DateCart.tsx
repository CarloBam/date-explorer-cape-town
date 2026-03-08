import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Trash2, MapPin, Fuel, Receipt, ArrowRight, Heart, Car, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDatePlan } from "@/lib/dateContext";
import { getDistanceBetween, calculatePetrolCost, calculateUberEstimate } from "@/lib/dateData";

export function DateCart() {
  const { datePlan, removeActivity, reorderActivities, totalCost, setStep, getDisplayCost, pricingMode } = useDatePlan();
  const { activities, budget } = datePlan;
  const hasCar = datePlan.quizAnswers.hasCar !== false;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderActivities(result.source.index, result.destination.index);
  };

  // Calculate total distance
  let totalDistance = 0;
  for (let i = 0; i < activities.length - 1; i++) {
    totalDistance += getDistanceBetween(activities[i].area, activities[i + 1].area);
  }
  const petrolCost = calculatePetrolCost(totalDistance);
  const uberCost = calculateUberEstimate(totalDistance);
  const transportCost = hasCar ? petrolCost : uberCost;
  const remaining = budget - totalCost - transportCost;

  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
        <div className="mb-4 text-4xl">💝</div>
        <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
          Your date is empty
        </h3>
        <p className="text-sm text-muted-foreground">
          Add activities to start building the perfect date!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden flex flex-col max-h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="gradient-sunset px-5 py-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-primary-foreground flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Your Date Plan
          </h3>
          <span className="text-sm font-medium text-primary-foreground/80">
            {activities.length} {activities.length === 1 ? "activity" : "activities"}
          </span>
        </div>
      </div>

      {/* Drag & Drop List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="date-plan">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="p-3 overflow-y-auto flex-1">
              <AnimatePresence>
                {activities.map((activity, index) => (
                  <Draggable key={activity.id} draggableId={activity.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`mb-2 rounded-lg border bg-background p-3 transition-shadow ${
                          snapshot.isDragging ? "shadow-warm border-primary" : "border-border"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div {...provided.dragHandleProps} className="cursor-grab text-muted-foreground hover:text-foreground">
                            <GripVertical className="h-4 w-4" />
                          </div>

                          <span className="text-xl">{activity.image}</span>

                          <div className="flex-1 min-w-0">
                            <div className="font-display text-sm font-semibold text-foreground truncate">
                              {activity.name}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {activity.area}
                            </div>
                          </div>

                          <span className="text-sm font-bold text-foreground shrink-0">
                            {activity.estimatedCost === 0 ? "Free" : `R${getDisplayCost(activity.estimatedCost)}`}
                          </span>

                          <button
                            onClick={() => removeActivity(activity.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Distance to next */}
                        {index < activities.length - 1 && (
                          <div className="mt-2 ml-7 flex items-center gap-1 text-xs text-muted-foreground">
                            <ArrowRight className="h-3 w-3" />
                            {getDistanceBetween(activity.area, activities[index + 1].area)} km •{" "}
                            {hasCar ? (
                              <span className="flex items-center gap-0.5"><Car className="h-3 w-3" /> drive</span>
                            ) : (
                              <span>🚕 Uber ≈ R{calculateUberEstimate(getDistanceBetween(activity.area, activities[index + 1].area))}</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Summary */}
      <div className="border-t border-border bg-muted/30 p-4 space-y-2">
        {/* Total time */}
        {activities.length > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Total time
            </span>
            <span className="font-semibold text-foreground">
              ~{(() => {
                const mins = activities.reduce((s, a) => s + a.durationMin, 0) + Math.max(0, activities.length - 1) * 10;
                const h = Math.floor(mins / 60);
                const m = mins % 60;
                return h > 0 ? (m > 0 ? `${h}h ${m}min` : `${h}h`) : `${m} min`;
              })()}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Receipt className="h-3.5 w-3.5" /> Activities {pricingMode === "per-person" ? "(pp)" : "(×2)"}
          </span>
          <span className="font-semibold text-foreground">R{pricingMode === "per-person" ? Math.round(totalCost / 2) : totalCost}</span>
        </div>

        {totalDistance > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              {hasCar ? <Fuel className="h-3.5 w-3.5" /> : <span>🚕</span>}
              {hasCar ? `Petrol (${totalDistance} km)` : `Uber (${totalDistance} km)`}
            </span>
            <span className="font-semibold text-foreground">~R{transportCost}</span>
          </div>
        )}

        <div className="flex justify-between border-t border-border pt-2 text-sm font-bold">
          <span className="text-foreground">Estimated Total</span>
          <span className="text-foreground">R{totalCost + transportCost}</span>
        </div>

        <div className={`flex justify-between text-sm ${remaining < 0 ? "text-destructive" : "text-secondary"}`}>
          <span>{remaining >= 0 ? "✓ Budget remaining" : "⚠️ Over budget"}</span>
          <span className="font-bold">R{remaining}</span>
        </div>

        <Button
          variant="hero"
          className="w-full mt-3"
          onClick={() => setStep("summary")}
        >
          View Date Summary
        </Button>
      </div>
    </div>
  );
}
