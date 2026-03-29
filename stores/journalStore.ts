import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { JournalEntry } from "../types/journal.types";

const KEYS = {
  entries: "sanctify_journal_entries",
  quizPoints: "sanctify_quiz_points",
  quizDone: "sanctify_quiz_done",
};

interface JournalStore {
  entries: JournalEntry[];
  quizPoints: number;
  completedQuizIds: string[];
  hydrated: boolean;

  hydrate: () => Promise<void>;
  addEntry: (entry: Omit<JournalEntry, "id" | "createdAt">) => void;
  deleteEntry: (id: string) => void;
  getTodayEntry: () => JournalEntry | undefined;
  recordQuizAnswer: (
    questionId: string,
    correct: boolean,
    points: number,
  ) => void;
  hasAnswered: (questionId: string) => boolean;
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
    const raw = await SecureStore.getItemAsync(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export const useJournalStore = create<JournalStore>((set, get) => ({
  entries: [],
  quizPoints: 0,
  completedQuizIds: [],
  hydrated: false,

  hydrate: async () => {
    const [entries, quizPoints, completedQuizIds] = await Promise.all([
      load<JournalEntry[]>(KEYS.entries, []),
      load<number>(KEYS.quizPoints, 0),
      load<string[]>(KEYS.quizDone, []),
    ]);
    set({ entries, quizPoints, completedQuizIds, hydrated: true });
  },

  addEntry: (entry) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: uid(),
      createdAt: new Date().toISOString(),
    };
    const entries = [newEntry, ...get().entries];
    set({ entries });
    save(KEYS.entries, entries);
  },

  deleteEntry: (id) => {
    const entries = get().entries.filter((e) => e.id !== id);
    set({ entries });
    save(KEYS.entries, entries);
  },

  getTodayEntry: () => {
    const today = new Date().toISOString().split("T")[0];
    return get().entries.find((e) => e.date === today);
  },

  recordQuizAnswer: (questionId, correct, points) => {
    if (get().completedQuizIds.includes(questionId)) return;
    const completedQuizIds = [...get().completedQuizIds, questionId];
    const quizPoints = get().quizPoints + (correct ? points : 0);
    set({ quizPoints, completedQuizIds });
    save(KEYS.quizPoints, quizPoints);
    save(KEYS.quizDone, completedQuizIds);
  },

  hasAnswered: (id) => get().completedQuizIds.includes(id),
}));
