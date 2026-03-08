import { areaCoordinates } from "./dateData";

export interface ForecastData {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  condition: string;
  icon: string;
  precipitationProbability: number;
  windSpeed: number;
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

function getTip(forecast: ForecastData, areas: string[]): string {
  const areaText = areas.length > 0 ? ` in ${areas[0]}` : "";

  if (forecast.precipitationProbability > 60) {
    return `🌧️ ${forecast.precipitationProbability}% chance of rain${areaText} — bring an umbrella or consider indoor activities!`;
  }
  if (forecast.windSpeed > 40) {
    return `⚠️ Strong winds expected${areaText} — Table Mountain cables may close. Consider indoor spots!`;
  }
  if (forecast.maxTemp > 30) {
    return `🔥 Hot day ahead (${forecast.maxTemp}°C)${areaText} — beach activities and shade are your friend!`;
  }
  if (forecast.maxTemp < 15) {
    return `🧥 Cool day (${forecast.maxTemp}°C)${areaText} — wine tasting, cozy cafés, and indoor culture are perfect.`;
  }
  if (forecast.precipitationProbability > 30) {
    return `🌦️ Some chance of rain (${forecast.precipitationProbability}%)${areaText} — pack a light jacket just in case.`;
  }
  return `🌤️ Great weather for a date! ${forecast.maxTemp}°C${areaText} — enjoy!`;
}

export async function fetchForecastForDate(date: Date, areas: string[]): Promise<ForecastData | null> {
  try {
    // Use first activity area coordinates, fallback to Cape Town center
    let lat = -33.9249;
    let lng = 18.4241;

    if (areas.length > 0) {
      const coords = areaCoordinates[areas[0]];
      if (coords) {
        lat = coords.lat;
        lng = coords.lng;
      }
    }

    const dateStr = date.toISOString().split("T")[0];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,wind_speed_10m_max&timezone=Africa/Johannesburg&start_date=${dateStr}&end_date=${dateStr}`;

    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    if (!data.daily || !data.daily.time || data.daily.time.length === 0) return null;

    const weatherCode = data.daily.weather_code[0];
    const { condition, icon } = getConditionFromCode(weatherCode);

    const forecast: ForecastData = {
      date: dateStr,
      maxTemp: Math.round(data.daily.temperature_2m_max[0]),
      minTemp: Math.round(data.daily.temperature_2m_min[0]),
      weatherCode,
      condition,
      icon,
      precipitationProbability: data.daily.precipitation_probability_max[0] ?? 0,
      windSpeed: Math.round(data.daily.wind_speed_10m_max[0]),
      tip: "",
    };

    forecast.tip = getTip(forecast, areas);
    return forecast;
  } catch {
    return null;
  }
}
