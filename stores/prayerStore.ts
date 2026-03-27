import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

const KEYS = {
  favorites: "sanctify_favorites",
  streak: "sanctify_streak",
  lastPrayed: "sanctify_last_prayed",
  history: "sanctify_prayer_history",
};

interface StreakData {
  current: number;
  longest: number;
  lastDate: string | null;
}

interface PrayerStore {
  favorites: string[];
  streak: StreakData;
  history: string[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  recordPrayer: () => void;
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

async function save(key: string, value: unknown): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (e) {
    console.warn("SecureStore save error:", e);
  }
}

async function load<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await SecureStore.getItemAsync(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const usePrayerStore = create<PrayerStore>((set, get) => ({
  favorites: [],
  streak: { current: 0, longest: 0, lastDate: null },
  history: [],
  hydrated: false,

  hydrate: async () => {
    const [favorites, streak, history] = await Promise.all([
      load<string[]>(KEYS.favorites, []),
      load<StreakData>(KEYS.streak, { current: 0, longest: 0, lastDate: null }),
      load<string[]>(KEYS.history, []),
    ]);
    set({ favorites, streak, history, hydrated: true });
  },

  toggleFavorite: (id) => {
    const favs = get().favorites;
    const next = favs.includes(id)
      ? favs.filter((f) => f !== id)
      : [...favs, id];
    set({ favorites: next });
    save(KEYS.favorites, next);
  },

  isFavorite: (id) => get().favorites.includes(id),

  recordPrayer: () => {
    const today = todayStr();
    const { streak, history } = get();

    let next: StreakData;
    if (streak.lastDate === today) {
      next = streak;
    } else if (streak.lastDate === yesterdayStr()) {
      next = {
        current: streak.current + 1,
        longest: Math.max(streak.longest, streak.current + 1),
        lastDate: today,
      };
    } else {
      next = {
        current: 1,
        longest: Math.max(streak.longest, 1),
        lastDate: today,
      };
    }

    const nextHistory = [...history, new Date().toISOString()].slice(-100);
    set({ streak: next, history: nextHistory });
    save(KEYS.streak, next);
    save(KEYS.history, nextHistory);
  },
}));
