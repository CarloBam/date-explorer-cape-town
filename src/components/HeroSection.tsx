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

      {/* User bar */}
      {user && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
          <span className="text-sm text-primary-foreground/70">{user.email}</span>
          <Button variant="ghost" size="sm" onClick={signOut} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 gap-1">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="mb-6 flex items-center justify-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-body text-sm uppercase tracking-widest text-primary">
              Cape Town Date Invitations
            </span>
          </div>

          <h1 className="mb-6 font-display text-5xl font-extrabold leading-tight text-primary-foreground md:text-7xl">
            Ask Her Out
            <span className="text-gradient-sunset"> the Right Way </span>
          </h1>

          <p className="mb-10 font-body text-lg text-primary-foreground/80 md:text-xl">
            Plan the perfect Cape Town date, then send her a beautiful
            invite — complete with activities, a map, and the option to customise.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              variant="hero"
              size="lg"
              className="gap-2 px-8 py-6 text-lg"
              onClick={() => setStep("quiz")}
            >
              <Heart className="h-5 w-5" />
              Plan a Date Invite
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
