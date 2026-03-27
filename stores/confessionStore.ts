import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { EXAMINATION_BY_AGE } from "../constants/confession";
import { AgeGroup, ExaminationSection } from "../types/confession.types";

const KEYS = {
  lastConfession: "sanctify_last_confession",
  ageGroup: "sanctify_confession_age",
};

interface ConfessionStore {
  lastConfession: string | null; // ISO date string
  ageGroup: AgeGroup;
  examination: ExaminationSection[];
  hydrated: boolean;

  hydrate: () => Promise<void>;
  setAgeGroup: (group: AgeGroup) => void;
  toggleItem: (sectionId: string, itemId: string) => void;
  resetExamination: () => void;
  recordConfession: () => void;
  daysSinceLastConfession: () => number | null;
}

export const useConfessionStore = create<ConfessionStore>((set, get) => ({
  lastConfession: null,
  ageGroup: "adult",
  examination: EXAMINATION_BY_AGE["adult"],
  hydrated: false,

  hydrate: async () => {
    try {
      const [last, age] = await Promise.all([
        SecureStore.getItemAsync(KEYS.lastConfession),
        SecureStore.getItemAsync(KEYS.ageGroup),
      ]);
      const ageGroup = (age as AgeGroup) ?? "adult";
      set({
        lastConfession: last ?? null,
        ageGroup,
        examination: EXAMINATION_BY_AGE[ageGroup],
        hydrated: true,
      });
    } catch {
      set({ hydrated: true });
    }
  },

  setAgeGroup: (group) => {
    set({ ageGroup: group, examination: EXAMINATION_BY_AGE[group] });
    SecureStore.setItemAsync(KEYS.ageGroup, group);
  },

  toggleItem: (sectionId, itemId) => {
    const exam = get().examination.map((section) =>
      section.id !== sectionId
        ? section
        : {
            ...section,
            items: section.items.map((item) =>
              item.id !== itemId ? item : { ...item, checked: !item.checked },
            ),
          },
    );
    set({ examination: exam });
  },

  resetExamination: () => {
    const { ageGroup } = get();
    // Deep clone to reset all checked states
    const fresh = EXAMINATION_BY_AGE[ageGroup].map((s) => ({
      ...s,
      items: s.items.map((i) => ({ ...i, checked: false })),
    }));
    set({ examination: fresh });
  },

  recordConfession: () => {
    const today = new Date().toISOString().split("T")[0];
    set({ lastConfession: today });
    SecureStore.setItemAsync(KEYS.lastConfession, today);
    get().resetExamination();
  },

  daysSinceLastConfession: () => {
    const { lastConfession } = get();
    if (!lastConfession) return null;
    const diff = Date.now() - new Date(lastConfession).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  },
}));
