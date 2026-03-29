import { HOLY_DAYS, NotificationId } from "@/constants/notifications";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getEasterDate } from "../utils/liturgicalCalendar";

// ── Configure how notifications appear when app is foregrounded ───────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ── Request permissions ───────────────────────────────────────────────────────
export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.warn("Notifications only work on physical devices.");
    return false;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("sanctify", {
      name: "Sanctify",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: "default",
    });
  }
  return true;
}

// ── Cancel a specific notification by its id tag ──────────────────────────────
export async function cancelNotification(id: NotificationId) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const toCancel = scheduled.filter((n) => n.content.data?.sanctifyId === id);
  await Promise.all(
    toCancel.map((n) =>
      Notifications.cancelScheduledNotificationAsync(n.identifier),
    ),
  );
}

// ── Cancel ALL Sanctify notifications ─────────────────────────────────────────
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// ── Schedule helpers ──────────────────────────────────────────────────────────

async function scheduleDailyAt(
  id: NotificationId,
  title: string,
  body: string,
  hour: number,
  minute: number,
) {
  await cancelNotification(id);
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
      data: { sanctifyId: id },
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    } as Notifications.NotificationTriggerInput,
  });
}

async function scheduleOnDate(
  id: string,
  title: string,
  body: string,
  date: Date,
) {
  if (date < new Date()) return; // Skip past dates
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
      data: { sanctifyId: id },
    },
    trigger: {
      date,
    } as Notifications.NotificationTriggerInput,
  });
}

// ── Individual schedulers ─────────────────────────────────────────────────────

export async function scheduleAngelusMorning() {
  await scheduleDailyAt(
    "angelus_morning",
    "🔔 Morning Angelus",
    "The Angel of the Lord declared unto Mary... Pause and pray.",
    6,
    0,
  );
}

export async function scheduleAngelusNoon() {
  await scheduleDailyAt(
    "angelus_noon",
    "🔔 Noon Angelus",
    "And the Word was made Flesh. Take a moment to pray the Angelus.",
    12,
    0,
  );
}

export async function scheduleAngelusEvening() {
  await scheduleDailyAt(
    "angelus_evening",
    "🔔 Evening Angelus",
    "Let us pray the Angelus together as the day ends.",
    18,
    0,
  );
}

export async function scheduleDivineMercy() {
  await scheduleDailyAt(
    "divine_mercy",
    "🕊️ Divine Mercy Hour",
    "The Hour of Mercy — 3 PM. Pray the Chaplet for souls.",
    15,
    0,
  );
}

export async function scheduleDailyReading(hour: number, minute: number) {
  await scheduleDailyAt(
    "daily_reading",
    "📖 Today's Mass Readings",
    "Today's readings are ready. Open Sanctify to reflect.",
    hour,
    minute,
  );
}

export async function scheduleSaintOfDay(hour: number, minute: number) {
  await scheduleDailyAt(
    "saint_of_day",
    "👑 Saint of the Day",
    "Discover today's saint and ask for their intercession.",
    hour,
    minute,
  );
}

export async function scheduleCustomPrayer(hour: number, minute: number) {
  await scheduleDailyAt(
    "custom_prayer",
    "🙏 Time to Pray",
    "Don't let the day end without spending time with God.",
    hour,
    minute,
  );
}

export async function scheduleHolyDays() {
  await cancelNotification("holy_day");
  const year = new Date().getFullYear();

  for (const hd of HOLY_DAYS) {
    const date = new Date(year, hd.month, hd.day, 7, 0, 0);
    await scheduleOnDate(
      `holy_day_${hd.name}`,
      "✝️ Holy Day of Obligation",
      `Today is ${hd.name} — a Holy Day of Obligation. Attend Mass if you are able.`,
      date,
    );
  }
}

export async function scheduleLentenFasting() {
  await cancelNotification("lenten_fast");
  const year = new Date().getFullYear();
  const easter = getEasterDate(year);

  // Ash Wednesday = Easter - 46 days
  const ashWed = new Date(easter);
  ashWed.setDate(easter.getDate() - 46);
  ashWed.setHours(7, 0, 0, 0);

  // Good Friday = Easter - 2 days
  const goodFri = new Date(easter);
  goodFri.setDate(easter.getDate() - 2);
  goodFri.setHours(7, 0, 0, 0);

  await scheduleOnDate(
    "lenten_fast_ash",
    "🌿 Ash Wednesday — Fast & Abstinence",
    "Today is Ash Wednesday. Catholics aged 18–59 are called to fast. Attend Mass and receive ashes.",
    ashWed,
  );

  await scheduleOnDate(
    "lenten_fast_friday",
    "✝️ Good Friday — Fast & Abstinence",
    "Today is Good Friday. Fast and abstain from meat. Attend the Liturgy of the Lord's Passion if possible.",
    goodFri,
  );
}

// ── Master scheduler — call this when preferences change ─────────────────────
export async function applyNotificationPreferences(
  prefs: Record<
    NotificationId,
    { enabled: boolean; hour?: number; minute?: number }
  >,
) {
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  const p = prefs;

  if (p.angelus_morning.enabled) await scheduleAngelusMorning();
  else await cancelNotification("angelus_morning");

  if (p.angelus_noon.enabled) await scheduleAngelusNoon();
  else await cancelNotification("angelus_noon");

  if (p.angelus_evening.enabled) await scheduleAngelusEvening();
  else await cancelNotification("angelus_evening");

  if (p.divine_mercy.enabled) await scheduleDivineMercy();
  else await cancelNotification("divine_mercy");

  if (p.daily_reading.enabled)
    await scheduleDailyReading(
      p.daily_reading.hour ?? 7,
      p.daily_reading.minute ?? 0,
    );
  else await cancelNotification("daily_reading");

  if (p.saint_of_day.enabled)
    await scheduleSaintOfDay(
      p.saint_of_day.hour ?? 8,
      p.saint_of_day.minute ?? 0,
    );
  else await cancelNotification("saint_of_day");

  if (p.custom_prayer.enabled)
    await scheduleCustomPrayer(
      p.custom_prayer.hour ?? 21,
      p.custom_prayer.minute ?? 0,
    );
  else await cancelNotification("custom_prayer");

  if (p.holy_day.enabled) await scheduleHolyDays();
  else await cancelNotification("holy_day");

  if (p.lenten_fast.enabled) await scheduleLentenFasting();
  else await cancelNotification("lenten_fast");
}
