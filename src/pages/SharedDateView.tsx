import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Tag, Car, Shield, Check, X, Edit3, Heart, Receipt, Fuel, ArrowRight, Loader2, CalendarIcon, AlertTriangle, PartyPopper, Download, CalendarClock, Mail } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { activities as allActivities, Activity, getDistanceBetween, calculatePetrolCost, calculateUberEstimate } from "@/lib/dateData";
import { WeatherWidget } from "@/components/WeatherWidget";
import { fetchForecastForDate, type ForecastData } from "@/lib/weatherForecast";
import { getHolidaysForDate } from "@/lib/saHolidays";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  proposed_datetime: string | null;
  proposed_by_name: string | null;
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
  const [showTimeProposal, setShowTimeProposal] = useState(false);
  const [proposedDate, setProposedDate] = useState<Date | undefined>();
  const [proposedTime, setProposedTime] = useState("18:00");
  const [proposingTime, setProposingTime] = useState(false);
  const [timeProposed, setTimeProposed] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // PWA install prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        toast.success("App installed! 🎉");
      }
      setDeferredPrompt(null);
    } else {
      // Fallback: show instructions
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      if (isIOS) {
        toast.info("Tap the Share button ↗ then 'Add to Home Screen' to install", { duration: 5000 });
      } else {
        toast.info("Open your browser menu ⋮ and tap 'Install app' or 'Add to Home Screen'", { duration: 5000 });
      }
    }
  };

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

      setDateData(data as unknown as SavedDate);
      if (data.date_response && data.date_response !== "pending") {
        setHasResponded(true);
      }
      if (data.proposed_datetime) {
        setTimeProposed(true);
      }

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

  const handleProposeTime = async () => {
    if (!proposedDate || !dateData) return;
    setProposingTime(true);
    try {
      const [hours, minutes] = proposedTime.split(":").map(Number);
      const proposedDateTime = new Date(proposedDate);
      proposedDateTime.setHours(hours, minutes, 0, 0);

      const { error } = await supabase.functions.invoke("propose-time-change", {
        body: {
          shareToken: token,
          proposedDatetime: proposedDateTime.toISOString(),
          proposerName: girlName || "Your date",
        },
      });

      if (error) throw error;

      setTimeProposed(true);
      setShowTimeProposal(false);
      toast.success("Time change proposed! He'll be notified 💌");
    } catch (err: any) {
      toast.error("Failed to propose time change. Please try again.");
    } finally {
      setProposingTime(false);
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
            <span>Cape Town Dates • Secure Sharing</span>
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
          <div className="flex items-center gap-3">
            <button
              onClick={handleInstall}
              className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Install App
            </button>
            <div className="flex items-center gap-1.5 text-xs text-secondary font-medium">
              <Shield className="h-3.5 w-3.5" />
              Verified
            </div>
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
            <p className="text-lg text-foreground font-medium mb-1">
              {dateData.quiz_answers?.senderName || "Someone special"} is asking to take you on a date ✨
            </p>
            {dateData.allow_customise && (
              <p className="text-sm text-muted-foreground">
                You may propose changes to the activities if you'd like 💫
              </p>
            )}
            {dateData.date_scheduled && dateData.date_response === "accepted" && (
              <>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-foreground">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  {format(new Date(dateData.date_scheduled), "EEEE, d MMMM yyyy")}
                </div>
                <CountdownTimer targetDate={new Date(dateData.date_scheduled)} />
              </>
            )}
            {/* Show proposed time if exists */}
            {dateData.proposed_datetime && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-medium text-foreground">
                <CalendarClock className="h-4 w-4 text-accent-foreground" />
                Proposed: {format(new Date(dateData.proposed_datetime), "EEEE, d MMMM yyyy 'at' h:mm a")}
              </div>
            )}
          </div>

          {/* Holidays */}
          {holidays.length > 0 && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-accent/15 px-4 py-3 text-sm font-medium text-accent-foreground">
              <PartyPopper className="h-4 w-4 text-primary shrink-0" />
              {holidays.map(h => `${h.emoji} ${h.name}`).join(" • ")} expect busier spots!
            </div>
          )}

          {/* Date forecast */}
          {forecast && (
            <div className={`mb-4 rounded-xl p-4 ${
              forecast.precipitationProbability > 50 || forecast.windSpeed > 40
                ? "bg-destructive/5 border border-destructive/20"
                : "border border-border bg-card"
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  {forecast.icon} {forecast.condition} on date day
                </span>
                <span className="text-sm text-muted-foreground">
                  {forecast.minTemp}°–{forecast.maxTemp}°C
                </span>
              </div>
              <p className={`text-sm ${
                forecast.precipitationProbability > 50 || forecast.windSpeed > 40
                  ? "text-destructive font-medium"
                  : "text-muted-foreground"
              }`}>
                {forecast.precipitationProbability > 50 && <AlertTriangle className="h-3.5 w-3.5 inline mr-1" />}
                {forecast.tip}
              </p>
            </div>
          )}

          {/* Safety & General Tips */}
          {dateData.quiz_answers?.stage === "first-date" ? (
            <div className="mb-6 rounded-xl border border-secondary/20 bg-secondary/5 p-4 text-sm">
              <h3 className="font-display font-bold text-secondary mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" /> Girl Code: First Date Safety
              </h3>
              <ul className="list-disc space-y-1.5 pl-4 text-muted-foreground marker:text-secondary">
                <li>Remember to share your live location with your bestie so they know where you are.</li>
                <li>Keep a mini pepper spray in your bag just in case (always better safe than sorry!).</li>
                <li>Have your own transport plan ready if you want to head out early.</li>
                <li>Stay safe, but most importantly, have the best time! ✨</li>
              </ul>
            </div>
          ) : (
            <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
              <h3 className="font-display font-bold text-primary mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4" /> Date Prep Tips
              </h3>
              <ul className="list-disc space-y-1.5 pl-4 text-muted-foreground marker:text-primary">
                <li>Bring a light jacket or jersey, Cape Town weather loves to surprise us.</li>
                <li>Take a few cute pictures to remember the day!</li>
                <li>Stay present, soak in the vibe, and have an amazing time together! ✨</li>
              </ul>
            </div>
          )}

          {/* Current Weather */}
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
                    </div>
                    {activity.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{activity.description}</p>
                    )}
                    {activity.deals && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary">
                        <Tag className="h-3 w-3" /> {activity.deals}
                      </div>
                    )}
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
                      <>🚕 {getDistanceBetween(activity.area, displayActivities[index + 1].area)} km distance</>
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



          {/* Propose time change */}
          {dateData.date_scheduled && !timeProposed && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-card mb-6">
              {!showTimeProposal ? (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setShowTimeProposal(true)}
                >
                  <CalendarClock className="h-4 w-4" /> Propose a Different Time
                </Button>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                    <CalendarClock className="h-5 w-5 text-primary" /> Propose New Time
                  </h3>
                  <p className="text-sm text-muted-foreground">Pick a new date and time — he'll get an email notification.</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start gap-2", !proposedDate && "text-muted-foreground")}>
                        <CalendarIcon className="h-4 w-4" />
                        {proposedDate ? format(proposedDate, "EEEE, d MMMM yyyy") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={proposedDate}
                        onSelect={setProposedDate}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Time</label>
                    <Input
                      type="time"
                      value={proposedTime}
                      onChange={e => setProposedTime(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="hero"
                      className="flex-1 gap-2"
                      onClick={handleProposeTime}
                      disabled={!proposedDate || proposingTime}
                    >
                      {proposingTime ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Send Proposal
                    </Button>
                    <Button variant="ghost" onClick={() => setShowTimeProposal(false)}>Cancel</Button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {timeProposed && (
            <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-4 mb-6 text-center">
              <CalendarClock className="h-5 w-5 text-secondary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">You've proposed a new time — he's been notified! 💌</p>
            </div>
          )}

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
              
              {dateData.date_response === "accepted" && dateData.date_scheduled && (
                <div className="mt-6 flex flex-col gap-3">
                  <p className="font-medium text-primary mb-2">Almost done! What's next?</p>
                  
                  {dateData.quiz_answers?.senderEmail && (
                    <Button 
                      variant="hero" 
                      className="w-full gap-2" 
                      onClick={() => {
                        const email = dateData.quiz_answers.senderEmail;
                        const subject = encodeURIComponent("Yay! I said yes! 💝");
                        const name = dateData.quiz_answers.senderName || "there";
                        const dateNum = format(new Date(dateData.date_scheduled!), "EEEE, d MMMM");
                        const body = encodeURIComponent(`Hi ${name},\n\nYay, she said yes! I would love to go on the date with you on ${dateNum}. I accept your invitation.\n\nHere are some tips to get ready:\n- Text me when we need to leave.\n- Don't forget any bookings you need to make!\n\nCan't wait! 🥰`);
                        window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
                      }}
                    >
                      <Mail className="h-4 w-4" /> Tap to Email Him Confirmation
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 border-primary/20 hover:bg-primary/5 text-primary"
                    onClick={() => {
                      const dateStr = format(new Date(dateData.date_scheduled!), "yyyyMMdd");
                      const plannerName = encodeURIComponent(dateData.quiz_answers?.senderName || "Special Someone");
                      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Date+with+${plannerName}&dates=${dateStr}T100000Z/${dateStr}T220000Z&details=Excited+for+our+date!`;
                      window.open(url, "_blank");
                    }}
                  >
                    <CalendarIcon className="h-4 w-4" /> Save to My Google Calendar
                  </Button>
                </div>
              )}
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

          {/* Install CTA */}
          <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
            <Download className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="font-display text-lg font-bold text-foreground mb-1">Get the App</h3>
            <p className="text-sm text-muted-foreground mb-3">Install Cape Town Dates for date reminders and quick access</p>
            <Button variant="hero" size="sm" className="gap-2" onClick={handleInstall}>
              <Download className="h-4 w-4" /> Install to Home Screen
            </Button>
          </div>

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

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.total <= 0) {
    return (
      <div className="mt-3 text-sm font-medium text-primary">
        ✨ Today's the day! Have an amazing date ✨
      </div>
    );
  }

  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      {[
        { value: timeLeft.days, label: "days" },
        { value: timeLeft.hours, label: "hrs" },
        { value: timeLeft.minutes, label: "min" },
        { value: timeLeft.seconds, label: "sec" },
      ].map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 font-display text-xl font-bold text-foreground">
            {String(unit.value).padStart(2, "0")}
          </div>
          <span className="mt-1 text-xs text-muted-foreground">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

function getTimeLeft(target: Date) {
  const now = new Date();
  const total = target.getTime() - now.getTime();
  return {
    total,
    days: Math.max(0, Math.floor(total / (1000 * 60 * 60 * 24))),
    hours: Math.max(0, Math.floor((total / (1000 * 60 * 60)) % 24)),
    minutes: Math.max(0, Math.floor((total / (1000 * 60)) % 60)),
    seconds: Math.max(0, Math.floor((total / 1000) % 60)),
  };
}
