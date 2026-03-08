import { Activity, areaCoordinates } from "@/lib/dateData";
import { MapPin } from "lucide-react";

interface DateMapProps {
  activities: Activity[];
}

export function DateMap({ activities }: DateMapProps) {
  const uniqueAreas = [...new Set(activities.map(a => a.area))];
  const coords = uniqueAreas
    .map(area => ({ area, ...areaCoordinates[area] }))
    .filter(c => c.lat && c.lng);

  if (coords.length === 0) return null;

  // Build OpenStreetMap static map URL using markers
  const markers = coords.map((c, i) => `${c.lat},${c.lng}`).join("|");
  
  // Calculate center and zoom from bounding box
  const lats = coords.map(c => c.lat);
  const lngs = coords.map(c => c.lng);
  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  
  // Calculate zoom based on spread
  const latSpread = Math.max(...lats) - Math.min(...lats);
  const lngSpread = Math.max(...lngs) - Math.min(...lngs);
  const maxSpread = Math.max(latSpread, lngSpread);
  let zoom = 12;
  if (maxSpread > 0.5) zoom = 10;
  if (maxSpread > 1) zoom = 9;
  if (maxSpread < 0.1) zoom = 13;
  if (maxSpread < 0.02) zoom = 14;

  // Use a free static map tile approach with embedded iframe
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(...lngs) - 0.02},${Math.min(...lats) - 0.02},${Math.max(...lngs) + 0.02},${Math.max(...lats) + 0.02}&layer=mapnik`;

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" /> Date Route Map
        </h3>
      </div>
      
      {/* Map */}
      <div className="relative">
        <iframe
          src={osmEmbedUrl}
          className="w-full h-[280px] border-0"
          loading="lazy"
          title="Date route map"
        />
      </div>

      {/* Location list */}
      <div className="px-5 py-3 space-y-1.5">
        {activities.map((a, i) => (
          <div key={a.id} className="flex items-center gap-2 text-sm">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {i + 1}
            </span>
            <span className="text-foreground">{a.name}</span>
            <span className="text-muted-foreground text-xs">({a.area})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
