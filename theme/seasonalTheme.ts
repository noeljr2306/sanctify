import { LiturgicalColor, LiturgicalSeason } from "../utils/liturgicalCalendar";

export interface SeasonTheme {
  primary: string; // Main brand color
  secondary: string; // Accent / highlights
  background: string; // Screen background
  surface: string; // Card / surface background
  text: string; // Primary text
  textMuted: string; // Secondary text
  tabBar: string; // Bottom tab bar bg
  tabBarActive: string; // Active tab icon color
  gradient: string[]; // Hero gradient stops
  emoji: string; // Season emoji
  paperTheme: "light" | "dark";
}

const themes: Record<LiturgicalSeason, SeasonTheme> = {
  advent: {
    primary: "#6B21A8", // Deep purple
    secondary: "#A855F7",
    background: "#1A0A2E",
    surface: "#2D1654",
    text: "#F3E8FF",
    textMuted: "#C084FC",
    tabBar: "#2D1654",
    tabBarActive: "#E879F9",
    gradient: ["#4A0E72", "#1A0A2E"],
    emoji: "🕯️",
    paperTheme: "dark",
  },
  christmas: {
    primary: "#B45309", // Gold
    secondary: "#F59E0B",
    background: "#1A1A2E",
    surface: "#16213E",
    text: "#FEF3C7",
    textMuted: "#FCD34D",
    tabBar: "#16213E",
    tabBarActive: "#F59E0B",
    gradient: ["#92400E", "#1A1A2E"],
    emoji: "⭐",
    paperTheme: "dark",
  },
  ordinary_time: {
    primary: "#166534", // Forest green
    secondary: "#22C55E",
    background: "#F0FDF4",
    surface: "#FFFFFF",
    text: "#14532D",
    textMuted: "#4ADE80",
    tabBar: "#FFFFFF",
    tabBarActive: "#166534",
    gradient: ["#166534", "#14532D"],
    emoji: "🌿",
    paperTheme: "light",
  },
  lent: {
    primary: "#581C87", // Dark purple
    secondary: "#7C3AED",
    background: "#1E0A3C",
    surface: "#2E1058",
    text: "#EDE9FE",
    textMuted: "#A78BFA",
    tabBar: "#2E1058",
    tabBarActive: "#C4B5FD",
    gradient: ["#3B0764", "#1E0A3C"],
    emoji: "✝️",
    paperTheme: "dark",
  },
  holy_week: {
    primary: "#7F1D1D", // Deep red
    secondary: "#EF4444",
    background: "#1A0000",
    surface: "#2D0000",
    text: "#FEE2E2",
    textMuted: "#FCA5A5",
    tabBar: "#2D0000",
    tabBarActive: "#F87171",
    gradient: ["#7F1D1D", "#1A0000"],
    emoji: "🕊️",
    paperTheme: "dark",
  },
  easter: {
    primary: "#FFFFFF", // White / gold
    secondary: "#F59E0B",
    background: "#FFFBEB",
    surface: "#FFFFFF",
    text: "#1C1917",
    textMuted: "#78716C",
    tabBar: "#FFFFFF",
    tabBarActive: "#D97706",
    gradient: ["#FEF3C7", "#FFFBEB"],
    emoji: "✨",
    paperTheme: "light",
  },
  pentecost: {
    primary: "#991B1B", // Red
    secondary: "#DC2626",
    background: "#1A0000",
    surface: "#2D0A0A",
    text: "#FEE2E2",
    textMuted: "#FCA5A5",
    tabBar: "#2D0A0A",
    tabBarActive: "#F87171",
    gradient: ["#991B1B", "#1A0000"],
    emoji: "🔥",
    paperTheme: "dark",
  },
};

// Maps liturgical color overrides (e.g. Rose Sunday)
const colorOverrides: Partial<Record<LiturgicalColor, Partial<SeasonTheme>>> = {
  rose: {
    primary: "#DB2777",
    secondary: "#EC4899",
    tabBarActive: "#F472B6",
  },
  red: {
    primary: "#DC2626",
    secondary: "#EF4444",
    tabBarActive: "#F87171",
  },
};

export function getSeasonTheme(
  season: LiturgicalSeason,
  color?: LiturgicalColor,
): SeasonTheme {
  const base = themes[season];
  if (color && colorOverrides[color]) {
    return { ...base, ...colorOverrides[color] };
  }
  return base;
}

export { themes };
