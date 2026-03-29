import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import {
  NOTIFICATION_SETTINGS,
  NotificationId,
} from "../constants/notifications";
import { applyNotificationPreferences } from "../lib/notificationScheduler";

export interface NotifPref {
  enabled: boolean;
  hour: number;
  minute: number;
}

type Prefs = Record<NotificationId, NotifPref>;

const STORE_KEY = "sanctify_notification_prefs";

// Build default prefs from NOTIFICATION_SETTINGS
function buildDefaults(): Prefs {
  return Object.fromEntries(
    NOTIFICATION_SETTINGS.map((s) => [
      s.id,
      {
        enabled: s.defaultEnabled,
        hour: s.defaultTime?.hour ?? 8,
        minute: s.defaultTime?.minute ?? 0,
      },
    ]),
  ) as Prefs;
}

interface NotificationStore {
  prefs: Prefs;
  permissionGranted: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setEnabled: (id: NotificationId, enabled: boolean) => void;
  setTime: (id: NotificationId, hour: number, minute: number) => void;
  applyAll: () => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  prefs: buildDefaults(),
  permissionGranted: false,
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await SecureStore.getItemAsync(STORE_KEY);
      const saved = raw ? (JSON.parse(raw) as Prefs) : null;
      // Merge saved over defaults so new settings get defaults
      const prefs = saved ? { ...buildDefaults(), ...saved } : buildDefaults();
      set({ prefs, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },

  setEnabled: (id, enabled) => {
    const prefs = { ...get().prefs, [id]: { ...get().prefs[id], enabled } };
    set({ prefs });
    SecureStore.setItemAsync(STORE_KEY, JSON.stringify(prefs));
    applyNotificationPreferences(prefs);
  },

  setTime: (id, hour, minute) => {
    const prefs = {
      ...get().prefs,
      [id]: { ...get().prefs[id], hour, minute },
    };
    set({ prefs });
    SecureStore.setItemAsync(STORE_KEY, JSON.stringify(prefs));
    applyNotificationPreferences(prefs);
  },

  applyAll: async () => {
    await applyNotificationPreferences(get().prefs);
    set({ permissionGranted: true });
  },
}));
