// Helper to get day name (e.g., "Monday")
export const getTodayName = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long" });
