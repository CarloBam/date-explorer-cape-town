import { motion } from "framer-motion";
import { Heart, MapPin, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDatePlan } from "@/lib/dateContext";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-capetown.jpg";

export function HeroSection() {
  const { setStep } = useDatePlan();
  const { user, signOut } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Cape Town sunset over Table Mountain"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="mb-6 flex items-center justify-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-body text-sm uppercase tracking-widest text-primary">
              Cape Town Date Planner
            </span>
          </div>

          <h1 className="mb-6 font-display text-5xl font-extrabold leading-tight text-primary-foreground md:text-7xl">
            Plan the
            <span className="text-gradient-sunset"> Perfect </span>
            Date
          </h1>

          <p className="mb-10 font-body text-lg text-primary-foreground/80 md:text-xl">
            Tell us about her vibe, and we'll curate an unforgettable Cape Town
            date — with costs, deals, distances, and everything you need.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              variant="hero"
              size="lg"
              className="gap-2 px-8 py-6 text-lg"
              onClick={() => setStep("quiz")}
            >
              <Heart className="h-5 w-5" />
              Start Planning
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="gap-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setStep("browse")}
            >
              <Sparkles className="h-5 w-5" />
              Browse Activities
            </Button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="h-8 w-5 rounded-full border-2 border-primary-foreground/40 p-1">
            <div className="h-2 w-1.5 rounded-full bg-primary-foreground/60 mx-auto" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
