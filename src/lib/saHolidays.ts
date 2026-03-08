// South African public holidays
interface Holiday {
  date: string; // MM-DD
  name: string;
  emoji: string;
}

const SA_HOLIDAYS: Holiday[] = [
  { date: "01-01", name: "New Year's Day", emoji: "🎆" },
  { date: "03-21", name: "Human Rights Day", emoji: "✊" },
  { date: "04-27", name: "Freedom Day", emoji: "🇿🇦" },
  { date: "05-01", name: "Workers' Day", emoji: "💪" },
  { date: "06-16", name: "Youth Day", emoji: "🌟" },
  { date: "08-09", name: "National Women's Day", emoji: "👩" },
  { date: "09-24", name: "Heritage Day / Braai Day", emoji: "🔥" },
  { date: "12-16", name: "Day of Reconciliation", emoji: "🕊️" },
  { date: "12-25", name: "Christmas Day", emoji: "🎄" },
  { date: "12-26", name: "Day of Goodwill", emoji: "🎁" },
];

// Easter dates are movable — pre-calculated for 2025-2028
const EASTER_HOLIDAYS: Record<number, { goodFriday: string; familyDay: string }> = {
  2025: { goodFriday: "04-18", familyDay: "04-21" },
  2026: { goodFriday: "04-03", familyDay: "04-06" },
  2027: { goodFriday: "03-26", familyDay: "03-29" },
  2028: { goodFriday: "04-14", familyDay: "04-17" },
};

export function getHolidaysForDate(date: Date): { name: string; emoji: string }[] {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const key = `${month}-${day}`;
  const year = date.getFullYear();

  const matches: { name: string; emoji: string }[] = [];

  // Fixed holidays
  for (const h of SA_HOLIDAYS) {
    if (h.date === key) {
      matches.push({ name: h.name, emoji: h.emoji });
    }
  }

  // Easter holidays
  const easter = EASTER_HOLIDAYS[year];
  if (easter) {
    if (key === easter.goodFriday) matches.push({ name: "Good Friday", emoji: "✝️" });
    if (key === easter.familyDay) matches.push({ name: "Family Day", emoji: "👨‍👩‍👧‍👦" });
  }

  // If a public holiday falls on a Sunday, Monday is observed
  if (date.getDay() === 1) {
    const sunday = new Date(date);
    sunday.setDate(sunday.getDate() - 1);
    const sunMonth = String(sunday.getMonth() + 1).padStart(2, "0");
    const sunDay = String(sunday.getDate()).padStart(2, "0");
    const sunKey = `${sunMonth}-${sunDay}`;
    for (const h of SA_HOLIDAYS) {
      if (h.date === sunKey) {
        matches.push({ name: `${h.name} (observed)`, emoji: h.emoji });
      }
    }
  }

  return matches;
}

export function isNearHoliday(date: Date): { name: string; emoji: string } | null {
  // Check 1 day before and after
  for (let offset = -1; offset <= 1; offset++) {
    const check = new Date(date);
    check.setDate(check.getDate() + offset);
    const holidays = getHolidaysForDate(check);
    if (holidays.length > 0 && offset !== 0) {
      return { ...holidays[0], name: `${holidays[0].name} (${offset === -1 ? "day before" : "day after"})` };
    }
  }
  return null;
}
