import { format } from "date-fns";
import { Activity } from "@/lib/dateData";

export function generateICSFile(
  title: string,
  scheduledDate: Date,
  activities: Activity[],
  durationMinutes: number = 240
): string {
  const startDate = format(scheduledDate, "yyyyMMdd'T'HHmmss");
  const endDate = new Date(scheduledDate.getTime() + durationMinutes * 60 * 1000);
  const endDateStr = format(endDate, "yyyyMMdd'T'HHmmss");
  const now = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");

  const activityList = activities
    .map((a, i) => `${i + 1}. ${a.name} (${a.area}) - ${a.duration}`)
    .join("\\n");

  const description = `Date Plan:\\n\\n${activityList}`;
  const location = activities.map(a => a.area).filter((v, i, arr) => arr.indexOf(v) === i).join(", ");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DatePlanner//EN",
    "BEGIN:VEVENT",
    `DTSTART:${startDate}`,
    `DTEND:${endDateStr}`,
    `DTSTAMP:${now}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return ics;
}

export function downloadICS(
  title: string,
  scheduledDate: Date,
  activities: Activity[],
  totalDurationMin?: number
) {
  const duration = totalDurationMin || activities.reduce((sum, a) => sum + a.durationMin, 0);
  const icsContent = generateICSFile(title, scheduledDate, activities, duration);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title.replace(/[^a-zA-Z0-9]/g, "-")}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
