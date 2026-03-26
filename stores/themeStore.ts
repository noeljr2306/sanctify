import { create } from "zustand";
import { getSeasonTheme, SeasonTheme } from "../theme/seasonalTheme";
import { getLiturgicalDay, LiturgicalDay } from "../utils/liturgicalCalendar";

interface ThemeStore {
  liturgicalDay: LiturgicalDay;
  theme: SeasonTheme;
  refresh: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  liturgicalDay: getLiturgicalDay(),
  theme: (() => {
    const day = getLiturgicalDay();
    return getSeasonTheme(day.season, day.color);
  })(),
  refresh: () => {
    const day = getLiturgicalDay();
    const theme = getSeasonTheme(day.season, day.color);
    set({ liturgicalDay: day, theme });
  },
}));
