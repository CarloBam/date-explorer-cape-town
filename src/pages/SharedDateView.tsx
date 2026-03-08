import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Tag, Car, Shield, Check, X, Edit3, Heart, Receipt, Fuel, ArrowRight, Loader2, CalendarIcon, AlertTriangle, PartyPopper } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { activities as allActivities, Activity, getDistanceBetween, calculatePetrolCost, calculateUberEstimate } from "@/lib/dateData";
import { WeatherWidget } from "@/components/WeatherWidget";
import { fetchForecastForDate, type ForecastData } from "@/lib/weatherForecast";
import { getHolidaysForDate } from "@/lib/saHolidays";
import { toast } from "sonner";

type DateResponse = "pending" | "accepted" | "rejected" | "customised";

interface SavedDate {
  id: string;
  title: string;
  activities: any;
  budget: number;
  total_cost: number;
  share_token: string;
  share_expires_at: string;
  allow_customise: boolean;
  date_response: DateResponse;
  girl_name: string | null;
  response_message: string | null;
  customised_activities: any;
  quiz_answers: any;
  date_scheduled: string | null;
}

export default function SharedDateView() {
  const { token } = useParams<{ token: string }>();
  const [dateData, setDateData] = useState<SavedDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responding, setResponding] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [girlName, setGirlName] = useState("");
  const [showCustomise, setShowCustomise] = useState(false);
  const [customActivities, setCustomActivities] = useState<Activity[]>([]);
  const [hasResponded, setHasResponded] = useState(false);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [holidays, setHolidays] = useState<{ name: string; emoji: string }[]>([]);

  useEffect(() => {
    if (!token) return;
    loadDate();
  }, [token]);

  const loadDate = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("saved_dates")
        .select("*")
        .eq("share_token", token)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!data) {
        setError("This date plan wasn't found or has expired.");
        return;
      }

      const expiresAt = new Date(data.share_expires_at || "");
      if (expiresAt < new Date()) {
        setError("This link has expired. Ask him to send a new one! 💫");
        return;
      }

      setDateData(data as SavedDate);
      if (data.date_response && data.date_response !== "pending") {
        setHasResponded(true);
      }

      // Resolve activities from IDs
      const activityData = data.activities as any[];
      if (activityData && activityData.length > 0) {
        const resolved = activityData
          .map((a: any) => {
            if (typeof a === "string") return allActivities.find(act => act.id === a);
            if (a.id) return allActivities.find(act => act.id === a.id) || a;
            return null;
          })
          .filter(Boolean) as Activity[];
        setCustomActivities(resolved);

        // Load forecast if date is scheduled
        if (data.date_scheduled) {
          const scheduledDate = new Date(data.date_scheduled);
          setHolidays(getHolidaysForDate(scheduledDate));
          const areas = [...new Set(resolved.map(a => a.area))];
          const daysAway = Math.ceil((scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (daysAway >= 0 && daysAway <= 16) {
            fetchForecastForDate(scheduledDate, areas).then(setForecast);
          }
        }
      }
    } catch (err: any) {
      setError("Something went wrong loading this date plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (response: DateResponse) => {
    if (!dateData) return;
    setResponding(true);
    try {
      const updateData: any = {
        date_response: response,
        girl_name: girlName || null,
        response_message: responseMessage || null,
      };

      if (response === "customised") {
        updateData.customised_activities = customActivities.map(a => ({
          id: a.id,
          name: a.name,
          area: a.area,
          estimatedCost: a.estimatedCost,
          duration: a.duration,
          image: a.image,
        }));
      }

      const { error: updateError } = await supabase
        .from("saved_dates")
        .update(updateData)
        .eq("share_token", token);

      if (updateError) throw updateError;

      setHasResponded(true);
      setDateData(prev => prev ? { ...prev, date_response: response } : null);

      if (response === "accepted") toast.success("Date accepted! 💝 He'll be so excited!");
      else if (response === "rejected") toast.info("Response sent. Maybe next time! 💫");
      else if (response === "customised") toast.success("Your custom plan has been saved! 💫");
    } catch (err) {
      toast.error("Failed to send response. Please try again.");
    } finally {
      setResponding(false);
    }
  };

  const toggleCustomActivity = (activity: Activity) => {
    setCustomActivities(prev => {
      const exists = prev.find(a => a.id === activity.id);
      if (exists) return prev.filter(a => a.id !== activity.id);
      return [...prev, activity];
    });
  };

  const hasCar = dateData?.quiz_answers?.hasCar !== false;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Link Not Available</h1>
          <p className="text-muted-foreground">{error}</p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-secondary" />
            <span>Cape Town Dates — Secure Sharing</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!dateData) return null;

  const displayActivities = showCustomise ? customActivities : (
    customActivities.length > 0 ? customActivities : []
  );

  let totalCost = displayActivities.reduce((sum, a) => sum + (a.estimatedCost || 0), 0);
  let totalDistance = 0;
  for (let i = 0; i < displayActivities.length - 1; i++) {
    totalDistance += getDistanceBetween(displayActivities[i].area, displayActivities[i + 1].area);
  }
  const transportCost = hasCar ? calculatePetrolCost(totalDistance) : calculateUberEstimate(totalDistance);

  return (
    <div className="min-h-screen bg-background">
      {/* Trust header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full gradient-sunset flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground text-sm">Cape Town Dates</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-secondary font-medium">
            <Shield className="h-3.5 w-3.5" />
            Verified & Secure
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Hero */}
          <div className="mb-8 text-center">
            <div className="mb-4 text-5xl">💝</div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              {dateData.title || "A Date Plan for You!"}
            </h1>
            <p className="text-muted-foreground">
              Someone special has planned a Cape Town date — just for you ✨
            </p>
          </div>

          {/* Weather */}
          <div className="mb-6">
            <WeatherWidget />
          </div>

          {/* Activities timeline */}
          <div className="space-y-0 mb-6">
            {displayActivities.map((activity, index) => (
              <div key={activity.id} className="relative">
                {index < displayActivities.length - 1 && (
                  <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-border" />
                )}
                <div className="flex gap-4 pb-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full gradient-sunset text-xl shadow-warm">
                    {activity.image}
                  </div>
                  <div className="flex-1 rounded-xl border border-border bg-card p-4 shadow-card">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-foreground">{activity.name}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {activity.area}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {activity.duration}</span>
                        </div>
                      </div>
                      <span className={`font-display font-bold ${activity.estimatedCost === 0 ? "text-secondary" : "text-foreground"}`}>
                        {activity.estimatedCost === 0 ? "FREE" : `R${activity.estimatedCost}`}
                      </span>
                    </div>
                    {activity.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{activity.description}</p>
                    )}
                    {activity.deals && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary">
                        <Tag className="h-3 w-3" /> {activity.deals}
                      </div>
                    )}

                    {/* Remove button in customise mode */}
                    {showCustomise && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-destructive hover:text-destructive"
                        onClick={() => toggleCustomActivity(activity)}
                      >
                        <X className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                </div>

                {index < displayActivities.length - 1 && (
                  <div className="ml-14 -mt-3 mb-3 text-xs text-muted-foreground flex items-center gap-1">
                    {hasCar ? (
                      <><Car className="h-3 w-3" /> {getDistanceBetween(activity.area, displayActivities[index + 1].area)} km drive</>
                    ) : (
                      <>🚕 {getDistanceBetween(activity.area, displayActivities[index + 1].area)} km — Uber ≈ R{calculateUberEstimate(getDistanceBetween(activity.area, displayActivities[index + 1].area))}</>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add more activities (customise mode) */}
          {showCustomise && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
              <h3 className="font-display text-lg font-bold text-foreground mb-3">Add Activities</h3>
              <div className="grid gap-2 max-h-64 overflow-y-auto">
                {allActivities
                  .filter(a => !customActivities.find(ca => ca.id === a.id))
                  .map(activity => (
                    <button
                      key={activity.id}
                      onClick={() => toggleCustomActivity(activity)}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors text-left"
                    >
                      <span className="text-xl">{activity.image}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-sm font-semibold text-foreground truncate">{activity.name}</div>
                        <div className="text-xs text-muted-foreground">{activity.area} • {activity.estimatedCost === 0 ? "FREE" : `R${activity.estimatedCost}`}</div>
                      </div>
                      <span className="text-secondary text-xs font-medium">+ Add</span>
                    </button>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Cost summary */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card mb-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Receipt className="h-5 w-5" /> Estimated Costs
            </h3>
            {displayActivities.map(a => (
              <div key={a.id} className="flex justify-between py-1.5 text-sm">
                <span className="text-muted-foreground">{a.image} {a.name}</span>
                <span className="font-medium text-foreground">{a.estimatedCost === 0 ? "Free" : `R${a.estimatedCost}`}</span>
              </div>
            ))}
            {totalDistance > 0 && (
              <div className="flex justify-between py-1.5 text-sm border-t border-border mt-2 pt-2">
                <span className="text-muted-foreground flex items-center gap-1">
                  {hasCar ? <Fuel className="h-3.5 w-3.5" /> : <span>🚕</span>}
                  {hasCar ? `Petrol (${totalDistance} km)` : `Uber (${totalDistance} km)`}
                </span>
                <span className="font-medium text-foreground">~R{transportCost}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border mt-2 pt-3 text-lg font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-gradient-sunset">R{totalCost + transportCost}</span>
            </div>
          </div>

          {/* Response section */}
          {hasResponded ? (
            <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-6 text-center">
              <div className="text-4xl mb-3">
                {dateData.date_response === "accepted" ? "💝" : dateData.date_response === "rejected" ? "💫" : "✨"}
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-1">
                {dateData.date_response === "accepted" && "You've accepted this date!"}
                {dateData.date_response === "rejected" && "You've passed on this one"}
                {dateData.date_response === "customised" && "You've sent your custom plan!"}
              </h3>
              <p className="text-sm text-muted-foreground">Your response has been sent.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Name input */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Your name (optional)</label>
                <Input
                  placeholder="So he knows it's you 💫"
                  value={girlName}
                  onChange={e => setGirlName(e.target.value)}
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Leave a message (optional)</label>
                <Input
                  placeholder="Can't wait! 🥰"
                  value={responseMessage}
                  onChange={e => setResponseMessage(e.target.value)}
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  variant="hero"
                  className="w-full gap-2 py-6 text-lg"
                  onClick={() => handleRespond("accepted")}
                  disabled={responding}
                >
                  <Check className="h-5 w-5" /> Accept This Date 💝
                </Button>

                {dateData.allow_customise && (
                  <>
                    {!showCustomise ? (
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => setShowCustomise(true)}
                      >
                        <Edit3 className="h-4 w-4" /> Customise This Date
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        className="w-full gap-2"
                        onClick={() => handleRespond("customised")}
                        disabled={responding || customActivities.length === 0}
                      >
                        <Check className="h-4 w-4" /> Send My Custom Plan
                      </Button>
                    )}
                  </>
                )}

                <Button
                  variant="ghost"
                  className="w-full gap-2 text-muted-foreground"
                  onClick={() => handleRespond("rejected")}
                  disabled={responding}
                >
                  <X className="h-4 w-4" /> Not This Time
                </Button>
              </div>
            </div>
          )}

          {/* Trust footer */}
          <div className="mt-8 text-center border-t border-border pt-6">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
              <Shield className="h-4 w-4 text-secondary" />
              This link was created securely on Cape Town Dates
            </div>
            <p className="text-xs text-muted-foreground">
              Your data is not stored or shared. This link expires automatically.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
