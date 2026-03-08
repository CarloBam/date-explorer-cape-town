import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, ArrowRight, Sparkles, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface VoiceDescribeHerProps {
  onFinish: (description: string) => void;
}

const aiResponses = [
  "She sounds like an amazing person! 💖 Let's find the perfect date for her.",
  "Wow, she sounds really special! 🌟 We'll make this date unforgettable.",
  "She sounds like a keeper! 😍 Let's plan something she'll absolutely love.",
  "What a wonderful person to plan a date for! ✨ We've got this.",
  "She sounds incredible! 💫 Time to plan a date that matches her energy.",
];

export function VoiceDescribeHer({ onFinish }: VoiceDescribeHerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [useText, setUseText] = useState(false);
  const recognitionRef = useRef<any>(null);

  const supportsVoice = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-ZA";

    let finalTranscript = "";

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript + interim);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const handleContinue = () => {
    if (transcript.trim()) {
      setShowResponse(true);
      setTimeout(() => onFinish(transcript.trim()), 2500);
    } else {
      onFinish("");
    }
  };

  const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg text-center"
      >
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mb-2 font-display text-3xl font-bold text-foreground">
          Tell us about her
        </h2>
        <p className="mb-8 text-muted-foreground">
          {supportsVoice && !useText
            ? "Record a quick voice note describing what she's like — her interests, personality, what makes her smile."
            : "Tell us about her personality, interests, and what makes her smile."}
        </p>

        <AnimatePresence mode="wait">
          {showResponse ? (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-primary/20 bg-primary/5 p-6"
            >
              <p className="font-display text-lg font-semibold text-foreground">
                {aiResponse}
              </p>
            </motion.div>
          ) : useText || !supportsVoice ? (
            <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <Textarea
                placeholder="She's really into art and nature, loves cozy coffee spots, and has an adventurous side..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="min-h-[120px] text-base"
              />
              <div className="flex gap-3 justify-center">
                {supportsVoice && (
                  <Button variant="ghost" size="sm" onClick={() => setUseText(false)} className="gap-1">
                    <Mic className="h-4 w-4" /> Use voice instead
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="voice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Recording button */}
              <div className="flex flex-col items-center gap-4">
                <motion.button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`relative h-24 w-24 rounded-full transition-colors ${
                    isRecording
                      ? "bg-destructive text-destructive-foreground"
                      : "gradient-sunset text-primary-foreground"
                  } shadow-warm`}
                  animate={isRecording ? { scale: [1, 1.05, 1] } : {}}
                  transition={isRecording ? { repeat: Infinity, duration: 1.5 } : {}}
                >
                  {isRecording ? (
                    <MicOff className="h-10 w-10 mx-auto" />
                  ) : (
                    <Mic className="h-10 w-10 mx-auto" />
                  )}
                </motion.button>
                <span className="text-sm text-muted-foreground">
                  {isRecording ? "Tap to stop recording" : "Tap to start talking"}
                </span>
              </div>

              {/* Transcript preview */}
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-muted p-4 text-left text-sm text-foreground"
                >
                  "{transcript}"
                </motion.div>
              )}

              <Button variant="ghost" size="sm" onClick={() => setUseText(true)} className="gap-1">
                <Pencil className="h-4 w-4" /> Type instead
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {!showResponse && (
          <div className="mt-8 flex justify-center gap-3">
            <Button
              variant="ghost"
              onClick={() => onFinish("")}
            >
              Skip
            </Button>
            <Button
              variant="hero"
              size="lg"
              onClick={handleContinue}
              disabled={!transcript.trim()}
              className="px-10"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
