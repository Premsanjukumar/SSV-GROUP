export const mapsUrl = () => process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Beladale Petrol Pump, Gumpa, Bidar, Karnataka");
const part = (d: Date, o: Intl.DateTimeFormatOptions, t: string) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", ...o }).formatToParts(d).find(p => p.type === t)?.value ?? "";
export const formatEventDate = (d: Date) => `${part(d, { day: "numeric" }, "day")} ${part(d, { month: "long" }, "month")} ${part(d, { year: "numeric" }, "year")}, ${part(d, { weekday: "long" }, "weekday")}`;
export const formatEventTime = (d: Date) => {
  const ps = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true }).formatToParts(d);
  const g = (t: string) => ps.find(p => p.type === t)?.value ?? "";
  return `${g("hour")}:${g("minute")} ${g("dayPeriod").toUpperCase()} onwards`;
};
export const appUrl = () => (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
