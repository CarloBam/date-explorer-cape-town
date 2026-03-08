import { DateProvider, useDatePlan } from "@/lib/dateContext";
import { HeroSection } from "@/components/HeroSection";
import { QuizFlow } from "@/components/QuizFlow";
import { ActivityBrowser } from "@/components/ActivityBrowser";
import { DateSummary } from "@/components/DateSummary";

function DateApp() {
  const { step } = useDatePlan();

  switch (step) {
    case "landing":
      return <HeroSection />;
    case "quiz":
      return <QuizFlow />;
    case "browse":
      return <ActivityBrowser />;
    case "summary":
      return <DateSummary />;
    default:
      return <HeroSection />;
  }
}

const Index = () => {
  return (
    <DateProvider>
      <DateApp />
    </DateProvider>
  );
};

export default Index;
