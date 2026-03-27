import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { fetchDailyReadings } from "../lib/readingsApi";
import { DailyReadings } from "@/types/reading.types";

const CACHE_KEY = "sanctify_readings_cache";

interface ReadingsStore {
  readings: DailyReadings | null;
  loading: boolean;
  error: string | null;
  savedVerses: { reference: string; text: string; date: string }[];
  loadReadings: () => Promise<void>;
  saveVerse: (reference: string, text: string) => void;
  removeSavedVerse: (reference: string) => void;
}

async function loadCache(): Promise<DailyReadings | null> {
  try {
    const raw = await SecureStore.getItemAsync(CACHE_KEY);
    if (!raw) return null;
    const cached: DailyReadings = JSON.parse(raw);
    // Only use cache if it's from today
    const today = new Date().toISOString().split("T")[0];
    return cached.date === today ? cached : null;
  } catch {
    return null;
  }
}

export const useReadingsStore = create<ReadingsStore>((set, get) => ({
  readings: null,
  loading: false,
  error: null,
  savedVerses: [],

  loadReadings: async () => {
    set({ loading: true, error: null });
    try {
      // Try cache first
      const cached = await loadCache();
      if (cached) {
        set({ readings: cached, loading: false });
        return;
      }
      // Fetch fresh
      const readings = await fetchDailyReadings();
      await SecureStore.setItemAsync(CACHE_KEY, JSON.stringify(readings));
      set({ readings, loading: false });
    } catch (e) {
      set({ error: "Could not load readings.", loading: false });
    }
  },

  saveVerse: (reference, text) => {
    const verses = get().savedVerses;
    const already = verses.find((v) => v.reference === reference);
    if (already) return;
    const next = [
      ...verses,
      { reference, text, date: new Date().toISOString().split("T")[0] },
    ];
    set({ savedVerses: next });
    SecureStore.setItemAsync("sanctify_saved_verses", JSON.stringify(next));
  },

  removeSavedVerse: (reference) => {
    const next = get().savedVerses.filter((v) => v.reference !== reference);
    set({ savedVerses: next });
    SecureStore.setItemAsync("sanctify_saved_verses", JSON.stringify(next));
  },
}));
