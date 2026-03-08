import { motion } from "framer-motion";
import { Heart, Sparkles, LogOut, MapPin, Clock, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDatePlan } from "@/lib/dateContext";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-capetown.jpg";

const features = [
  { emoji: "💝", title: "Personalised for her", description: "Answer a few questions and we'll match activities to her personality" },
  { emoji: "📍", title: "Route & Map", description: "See all your spots on a map with distances and transport costs" },
  { emoji: "📱", title: "Beautiful invite link", description: "Send her a stunning date invite via WhatsApp or email" },
  { emoji: "✏️", title: "She can customise", description: "Optionally let her swap activities so she feels included" },
];

const motivations = [
  "The best dates are the ones you actually plan. 💪",
  "A great date starts with a great plan.",
  "She deserves more than 'let's see what happens.'",
  "You miss 100% of the dates you don't plan.",
];

export function HeroSection() {
  const { setStep } = useDatePlan();
  const { user, signOut } = useAuth();

  const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];

  return (
    <div className="relative overflow-hidden">
      {/* Hero section */}
      <div className="relative min-h-screen">
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

        {/* Hero Content */}
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

            <h1 className="mb-4 font-display text-5xl font-extrabold leading-tight text-primary-foreground md:text-7xl">
              Plan the
              <br />
              <span className="text-gradient-sunset">Perfect Date.</span>
            </h1>

            <p className="mb-4 font-body text-lg text-primary-foreground/80 md:text-xl">
              Build a personalised date she'll love, then send her a beautiful invite
              with activities, a map, and everything sorted.
            </p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-10 font-display text-base text-primary/90 italic"
            >
              "{randomMotivation}"
            </motion.p>

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
            className="absolute bottom-8 flex flex-col items-center gap-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-xs text-primary-foreground/50 font-body">How it works</span>
            <ChevronDown className="h-5 w-5 text-primary-foreground/40" />
          </motion.div>
        </div>
      </div>

      {/* How it works section */}
      <div className="bg-background py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl mb-3">
              Plan a Date She'd <span className="text-gradient-sunset">Actually Love</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              No more "so where do you wanna go?" Show up with a plan.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid gap-8 md:grid-cols-3 mb-16">
            {[
              { step: "1", emoji: "🧠", title: "Tell us about her", desc: "A quick quiz about her personality, vibe, and what she enjoys" },
              { step: "2", emoji: "🗺️", title: "Pick activities", desc: "We'll recommend the best spots and you pick what feels right" },
              { step: "3", emoji: "💌", title: "Send the invite", desc: "She gets a beautiful link with the full plan & can RSVP" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full gradient-sunset text-2xl shadow-warm">
                  {item.emoji}
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Features grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-card"
              >
                <span className="text-2xl">{feature.emoji}</span>
                <div>
                  <h4 className="font-display font-semibold text-foreground">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-14 text-center"
          >
            <p className="font-display text-xl font-bold text-foreground mb-2">
              She's not going to ask herself out 😏
            </p>
            <p className="text-muted-foreground mb-6">
              It takes 2 minutes to plan a date she'll remember forever.
            </p>
            <Button
              variant="hero"
              size="lg"
              className="gap-2 px-8 py-6 text-lg"
              onClick={() => setStep("quiz")}
            >
              <Heart className="h-5 w-5" />
              Start Planning Now
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
