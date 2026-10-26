export const DAY_COLORS_DARK = [
  "#60A5FA", "#34D399", "#FBBF24", "#A78BFA", "#FB923C", "#22D3EE", "#F87171",
];

export const DAY_COLORS_LIGHT = [
  "#1D4ED8", "#047857", "#B45309", "#6D28D9", "#C2410C", "#0E7490", "#BE123C",
];

export function getDayColor(dayIndex, C) {
  const isLight = C?.isDark === false || C?.bg === "#F9F8F3";
  const colors = isLight ? DAY_COLORS_LIGHT : DAY_COLORS_DARK;
  return colors[Math.abs(dayIndex) % colors.length];
}

export const DAY_COLORS = [
  "#2563EB", "#059669", "#D97706", "#7C3AED", "#EA580C", "#0891B2", "#E11D48",
];
