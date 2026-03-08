// Open-Meteo API — 100% free, no API key needed!
const CAPE_TOWN_LAT = -33.9249;
const CAPE_TOWN_LNG = 18.4241;

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  condition: string;
  icon: string;
  isWindy: boolean;
  tip: string;
}

function getConditionFromCode(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: "Clear sky", icon: "☀️" };
  if (code <= 3) return { condition: "Partly cloudy", icon: "⛅" };
  if (code <= 49) return { condition: "Foggy", icon: "🌫️" };
  if (code <= 59) return { condition: "Drizzle", icon: "🌦️" };
  if (code <= 69) return { condition: "Rain", icon: "🌧️" };
  if (code <= 79) return { condition: "Snow", icon: "❄️" };
  if (code <= 82) return { condition: "Rain showers", icon: "🌧️" };
  if (code <= 86) return { condition: "Snow showers", icon: "🌨️" };
  if (code >= 95) return { condition: "Thunderstorm", icon: "⛈️" };
  return { condition: "Unknown", icon: "🌤️" };
}

function getWindDirection(degrees: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(degrees / 45) % 8];
}

function getTip(weather: { windSpeed: number; weatherCode: number; temperature: number }): string {
  if (weather.windSpeed > 40) {
    return "⚠️ Strong south-easter today. Table Mountain cables may close. Consider indoor activities!";
  }
  if (weather.weatherCode >= 60) {
    return "🌧️ Rain expected. Skip outdoor activities or bring rain gear. Great day for museums & cafés!";
  }
  if (weather.temperature > 30) {
    return "🔥 Hot day! Beach activities, ice cream, and shady spots are your best bet.";
  }
  if (weather.temperature < 15) {
    return "🧥 Cool day. Wine tasting, cozy cafés, and indoor culture are perfect picks.";
  }
  return "🌤️ Great weather for a date! Mix indoor and outdoor activities for the best experience.";
}

export async function fetchWeather(): Promise<WeatherData | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${CAPE_TOWN_LAT}&longitude=${CAPE_TOWN_LNG}&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&timezone=Africa/Johannesburg`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const current = data.current;

    const { condition, icon } = getConditionFromCode(current.weather_code);
    const windSpeed = Math.round(current.wind_speed_10m);

    return {
      temperature: Math.round(current.temperature_2m),
      windSpeed,
      windDirection: current.wind_direction_10m,
      weatherCode: current.weather_code,
      condition,
      icon,
      isWindy: windSpeed > 40,
      tip: getTip({
        windSpeed,
        weatherCode: current.weather_code,
        temperature: current.temperature_2m,
      }),
    };
  } catch {
    return null;
  }
}

export function getWindDirectionLabel(degrees: number): string {
  return getWindDirection(degrees);
}
