import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

const KEYS = {
  lentenCompleted: "sanctify_lenten_completed",
  adventCompleted: "sanctify_advent_completed",
  chaplets: "sanctify_chaplets",
  novenas: "sanctify_novenas",
};

export interface CustomChaplet {
  id: string;
  title: string;
  steps: { label: string; prayer: string; repeat: number }[];
  createdAt: string;
}

export interface NovenaEntry {
  id: string;
  title: string;
  startDate: string; // ISO date
  endDate: string; // ISO date (startDate + 8 days)
  completedDays: number[];
}

interface SeasonalStore {
  lentenCompleted: number[]; // day numbers completed
  adventCompleted: number[]; // day numbers completed
  chaplets: CustomChaplet[];
  novenas: NovenaEntry[];
  hydrated: boolean;

  hydrate: () => Promise<void>;
  completeLentenDay: (day: number) => void;
  completeAdventDay: (day: number) => void;
  isLentenDayDone: (day: number) => boolean;
  isAdventDayDone: (day: number) => boolean;
  addChaplet: (chaplet: Omit<CustomChaplet, "id" | "createdAt">) => void;
  deleteChaplet: (id: string) => void;
  startNovena: (title: string, startDate: string) => void;
  completeNovenaDay: (novenaId: string, day: number) => void;
  deleteNovena: (id: string) => void;
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
async function save(key: string, val: unknown) {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(val));
  } catch {}
}
async function load<T>(key: string, fallback: T): Promise<T> {
  try {
    const r = await SecureStore.getItemAsync(key);
    return r ? JSON.parse(r) : fallback;
  } catch {
    return fallback;
  }
}

export const useSeasonalStore = create<SeasonalStore>((set, get) => ({
  lentenCompleted: [],
  adventCompleted: [],
  chaplets: [],
  novenas: [],
  hydrated: false,

  hydrate: async () => {
    const [lentenCompleted, adventCompleted, chaplets, novenas] =
      await Promise.all([
        load<number[]>(KEYS.lentenCompleted, []),
        load<number[]>(KEYS.adventCompleted, []),
        load<CustomChaplet[]>(KEYS.chaplets, []),
        load<NovenaEntry[]>(KEYS.novenas, []),
      ]);
    set({
      lentenCompleted,
      adventCompleted,
      chaplets,
      novenas,
      hydrated: true,
    });
  },

  completeLentenDay: (day) => {
    if (get().lentenCompleted.includes(day)) return;
    const next = [...get().lentenCompleted, day];
    set({ lentenCompleted: next });
    save(KEYS.lentenCompleted, next);
  },

  completeAdventDay: (day) => {
    if (get().adventCompleted.includes(day)) return;
    const next = [...get().adventCompleted, day];
    set({ adventCompleted: next });
    save(KEYS.adventCompleted, next);
  },

  isLentenDayDone: (day) => get().lentenCompleted.includes(day),
  isAdventDayDone: (day) => get().adventCompleted.includes(day),

  addChaplet: (chaplet) => {
    const newChaplet: CustomChaplet = {
      ...chaplet,
      id: uid(),
      createdAt: new Date().toISOString(),
    };
    const chaplets = [newChaplet, ...get().chaplets];
    set({ chaplets });
    save(KEYS.chaplets, chaplets);
  },

  deleteChaplet: (id) => {
    const chaplets = get().chaplets.filter((c) => c.id !== id);
    set({ chaplets });
    save(KEYS.chaplets, chaplets);
  },

  startNovena: (title, startDate) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 8);
    const novena: NovenaEntry = {
      id: uid(),
      title,
      startDate,
      endDate: end.toISOString().split("T")[0],
      completedDays: [],
    };
    const novenas = [novena, ...get().novenas];
    set({ novenas });
    save(KEYS.novenas, novenas);
  },

  completeNovenaDay: (novenaId, day) => {
    const novenas = get().novenas.map((n) =>
      n.id !== novenaId
        ? n
        : {
            ...n,
            completedDays: n.completedDays.includes(day)
              ? n.completedDays
              : [...n.completedDays, day],
          },
    );
    set({ novenas });
    save(KEYS.novenas, novenas);
  },

  deleteNovena: (id) => {
    const novenas = get().novenas.filter((n) => n.id !== id);
    set({ novenas });
    save(KEYS.novenas, novenas);
  },
}));
