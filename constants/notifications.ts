export type NotificationId =
  | "angelus_morning"
  | "angelus_noon"
  | "angelus_evening"
  | "daily_reading"
  | "saint_of_day"
  | "divine_mercy"
  | "holy_day"
  | "lenten_fast"
  | "custom_prayer";

export interface NotificationSetting {
  id: NotificationId;
  label: string;
  description: string;
  emoji: string;
  defaultEnabled: boolean;
  defaultTime?: { hour: number; minute: number }; // for time-based
  fixed?: boolean; // can't change the time, only toggle
}

export const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: "angelus_morning",
    label: "Morning Angelus",
    description: "Bell reminder to pray the Angelus",
    emoji: "🔔",
    defaultEnabled: true,
    defaultTime: { hour: 6, minute: 0 },
    fixed: true,
  },
  {
    id: "angelus_noon",
    label: "Noon Angelus",
    description: "Bell reminder to pray the Angelus",
    emoji: "🔔",
    defaultEnabled: true,
    defaultTime: { hour: 12, minute: 0 },
    fixed: true,
  },
  {
    id: "angelus_evening",
    label: "Evening Angelus",
    description: "Bell reminder to pray the Angelus",
    emoji: "🔔",
    defaultEnabled: true,
    defaultTime: { hour: 18, minute: 0 },
    fixed: true,
  },
  {
    id: "divine_mercy",
    label: "Divine Mercy Hour",
    description: "Reminder to pray the Divine Mercy Chaplet",
    emoji: "🕊️",
    defaultEnabled: true,
    defaultTime: { hour: 15, minute: 0 },
    fixed: true,
  },
  {
    id: "daily_reading",
    label: "Daily Mass Readings",
    description: "Get today's readings each morning",
    emoji: "📖",
    defaultEnabled: true,
    defaultTime: { hour: 7, minute: 0 },
    fixed: false,
  },
  {
    id: "saint_of_day",
    label: "Saint of the Day",
    description: "Learn about today's saint",
    emoji: "👑",
    defaultEnabled: true,
    defaultTime: { hour: 8, minute: 0 },
    fixed: false,
  },
  {
    id: "holy_day",
    label: "Holy Day Alerts",
    description: "Reminders for Holy Days of Obligation",
    emoji: "✝️",
    defaultEnabled: true,
    fixed: true,
  },
  {
    id: "lenten_fast",
    label: "Lenten Fasting Reminders",
    description: "Ash Wednesday & Good Friday fasting reminder",
    emoji: "🌿",
    defaultEnabled: true,
    fixed: true,
  },
  {
    id: "custom_prayer",
    label: "Personal Prayer Reminder",
    description: "A daily nudge to spend time in prayer",
    emoji: "🙏",
    defaultEnabled: false,
    defaultTime: { hour: 21, minute: 0 },
    fixed: false,
  },
];

// Holy Days of Obligation (month is 0-indexed)
export const HOLY_DAYS = [
  { name: "Mary, Mother of God", month: 0, day: 1 },
  { name: "Ascension Thursday", month: 4, day: 29 }, // varies, approx
  { name: "Assumption of Mary", month: 7, day: 15 },
  { name: "All Saints' Day", month: 10, day: 1 },
  { name: "Immaculate Conception", month: 11, day: 8 },
  { name: "Christmas", month: 11, day: 25 },
];
