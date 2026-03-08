import React, { createContext, useContext, useState, useCallback } from "react";
import { Activity, QuizAnswer } from "./dateData";

export type PricingMode = "for-two" | "per-person";

interface DatePlan {
  activities: Activity[];
  budget: number;
  quizAnswers: Partial<QuizAnswer>;
  scheduledDate: Date | undefined;
}

interface DateContextType {
  datePlan: DatePlan;
  addActivity: (activity: Activity) => void;
  removeActivity: (id: string) => void;
  reorderActivities: (startIndex: number, endIndex: number) => void;
  setBudget: (budget: number) => void;
  setQuizAnswers: (answers: Partial<QuizAnswer>) => void;
  setScheduledDate: (date: Date | undefined) => void;
  totalCost: number;
  isInPlan: (id: string) => boolean;
  step: "landing" | "quiz" | "browse" | "summary";
  setStep: (step: "landing" | "quiz" | "browse" | "summary") => void;
  pricingMode: PricingMode;
  setPricingMode: (mode: PricingMode) => void;
  getDisplayCost: (cost: number) => number;
  getDisplayRange: (cost: number, costMax?: number) => string;
}

const DateContext = createContext<DateContextType | null>(null);

export function DateProvider({ children }: { children: React.ReactNode }) {
  const [datePlan, setDatePlan] = useState<DatePlan>({
    activities: [],
    budget: 1000,
    quizAnswers: {},
    scheduledDate: undefined,
  });
  const [step, setStep] = useState<"landing" | "quiz" | "browse" | "summary">("landing");
  const [pricingMode, setPricingMode] = useState<PricingMode>("for-two");

  const addActivity = useCallback((activity: Activity) => {
    setDatePlan(prev => {
      if (prev.activities.find(a => a.id === activity.id)) return prev;
      return { ...prev, activities: [...prev.activities, activity] };
    });
  }, []);

  const removeActivity = useCallback((id: string) => {
    setDatePlan(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a.id !== id),
    }));
  }, []);

  const reorderActivities = useCallback((startIndex: number, endIndex: number) => {
    setDatePlan(prev => {
      const result = Array.from(prev.activities);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { ...prev, activities: result };
    });
  }, []);

  const setBudget = useCallback((budget: number) => {
    setDatePlan(prev => ({ ...prev, budget }));
  }, []);

  const setQuizAnswers = useCallback((answers: Partial<QuizAnswer>) => {
    setDatePlan(prev => ({ ...prev, quizAnswers: { ...prev.quizAnswers, ...answers } }));
  }, []);

  const setScheduledDate = useCallback((date: Date | undefined) => {
    setDatePlan(prev => ({ ...prev, scheduledDate: date }));
  }, []);

  const getDisplayCost = useCallback((cost: number) => {
    if (cost === 0) return 0;
    return pricingMode === "per-person" ? Math.round(cost / 2) : cost;
  }, [pricingMode]);

  const getDisplayRange = useCallback((cost: number, costMax?: number) => {
    if (cost === 0) return "FREE";
    const min = pricingMode === "per-person" ? Math.round(cost / 2) : cost;
    if (!costMax || costMax === cost) return `R${min}`;
    const max = pricingMode === "per-person" ? Math.round(costMax / 2) : costMax;
    return `R${min} – R${max}`;
  }, [pricingMode]);

  const totalCost = datePlan.activities.reduce((sum, a) => sum + a.estimatedCost, 0);

  const isInPlan = useCallback((id: string) => {
    return datePlan.activities.some(a => a.id === id);
  }, [datePlan.activities]);

  return (
    <DateContext.Provider value={{ datePlan, addActivity, removeActivity, reorderActivities, setBudget, setQuizAnswers, setScheduledDate, totalCost, isInPlan, step, setStep, pricingMode, setPricingMode, getDisplayCost, getDisplayRange }}>
      {children}
    </DateContext.Provider>
  );
}

export function useDatePlan() {
  const context = useContext(DateContext);
  if (!context) throw new Error("useDatePlan must be used within DateProvider");
  return context;
}
