import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wind, Thermometer, AlertTriangle } from "lucide-react";
import { fetchWeather, getWindDirectionLabel, type WeatherData } from "@/lib/weatherApi";

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather().then((data) => {
      setWeather(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 animate-pulse">
        <div className="h-16 bg-muted rounded-lg" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 ${
        weather.isWindy
          ? "border-destructive/30 bg-destructive/5"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{weather.icon}</span>
          <div>
            <div className="font-display font-semibold text-foreground">
              Cape Town Now
            </div>
            <div className="text-sm text-muted-foreground">
              {weather.condition}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-foreground">
            <Thermometer className="h-4 w-4 text-primary" />
            {weather.temperature}°C
          </span>
          <span className={`flex items-center gap-1 ${weather.isWindy ? "text-destructive font-semibold" : "text-foreground"}`}>
            <Wind className="h-4 w-4" />
            {weather.windSpeed} km/h {getWindDirectionLabel(weather.windDirection)}
          </span>
        </div>
      </div>

      <div className={`text-sm rounded-lg px-3 py-2 ${
        weather.isWindy
          ? "bg-destructive/10 text-destructive font-medium"
          : "bg-muted text-muted-foreground"
      }`}>
        {weather.isWindy && <AlertTriangle className="h-3.5 w-3.5 inline mr-1" />}
        {weather.tip}
      </div>
    </motion.div>
  );
}
