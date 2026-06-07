// Essential constants and utility helpers for the FIFA World Cup 2026 App

export const FEATURED_GROUP = "D";

// IST Date Formatter
export const formatToIST = (dateString) => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
  });
  return { time: formatter.format(date), date: dateFormatter.format(date) };
};

// Fallback logic for getTeam (mostly for static components)
export const getTeam = (id) => ({
  id: id.toLowerCase(),
  name: id.toUpperCase(),
  flag: id.toLowerCase(),
  group: '?'
});
