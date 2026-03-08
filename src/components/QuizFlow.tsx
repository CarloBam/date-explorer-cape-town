import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Wallet, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDatePlan } from "@/lib/dateContext";
import { quizQuestions } from "@/lib/dateData";
import { Slider } from "@/components/ui/slider";
import { VoiceDescribeHer } from "./VoiceDescribeHer";

export function QuizFlow() {
  const { setQuizAnswers, datePlan, setBudget, setStep } = useDatePlan();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showBudget, setShowBudget] = useState(false);
  const [showDescribe, setShowDescribe] = useState(false);

  const safeQ = Math.min(currentQ, quizQuestions.length - 1);
  const question = quizQuestions[safeQ];
  const isLastQuestion = safeQ === quizQuestions.length - 1;

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      setShowBudget(true);
    } else {
      setTimeout(() => setCurrentQ(prev => prev + 1), 300);
    }
  };

  const handleDescribeFinish = (description: string) => {
    if (description) {
      setAnswers(prev => ({ ...prev, girlDescription: description }));
    }
    setShowDescribe(false);
    setShowBudget(true);
  };

  const handleFinish = () => {
    const parsed: Record<string, unknown> = {};
    Object.entries(answers).forEach(([key, val]) => {
      if (key === "hasCar") parsed[key] = val === "true";
      else parsed[key] = val;
    });
    setQuizAnswers(parsed);
    setStep("browse");
  };

  if (showDescribe) {
    return <VoiceDescribeHer onFinish={handleDescribeFinish} />;
  }

  if (showBudget) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg text-center"
        >
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mb-2 font-display text-3xl font-bold text-foreground">
            What's the budget?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Set your total budget for the date (in Rands)
          </p>

          <div className="mb-4 text-5xl font-display font-bold text-gradient-sunset">
            R{datePlan.budget}
          </div>

          <Slider
            value={[datePlan.budget]}
            onValueChange={([val]) => setBudget(val)}
            min={200}
            max={2000}
            step={50}
            className="mb-8 mx-auto max-w-sm"
          />

          <div className="flex justify-between text-sm text-muted-foreground max-w-sm mx-auto mb-8">
            <span>R200</span>
            <span>R2,000</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Button variant="hero" size="lg" onClick={handleFinish} className="px-10">
              Find Activities <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDescribe(true)}
              className="gap-1.5 text-muted-foreground"
            >
              <Mic className="h-4 w-4" /> Want to describe her? (optional)
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8 flex items-center gap-2">
          {currentQ > 0 && (
            <Button variant="ghost" size="icon" onClick={() => setCurrentQ(prev => prev - 1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex flex-1 gap-1">
            {quizQuestions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= currentQ ? "gradient-sunset" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground font-body">
            {currentQ + 1}/{quizQuestions.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-2 font-display text-3xl font-bold text-foreground md:text-4xl">
              {question.question}
            </h2>
            <p className="mb-8 text-muted-foreground">{question.subtitle}</p>

            <div className="grid gap-3">
              {question.options.map((option) => {
                const isSelected = answers[question.id] === option.value;
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelect(option.value)}
                    className={`flex items-center gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-warm"
                        : "border-border bg-card hover:border-primary/30 shadow-card"
                    }`}
                  >
                    <span className="text-3xl">{option.emoji}</span>
                    <div>
                      <div className="font-display text-lg font-semibold text-foreground">
                        {option.label}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
