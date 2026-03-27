export type PrayerCategory =
  | "daily"
  | "rosary"
  | "divine_mercy"
  | "seasonal"
  | "emergency"
  | "liturgy_of_hours";

export interface Prayer {
  id: string;
  title: string;
  category: PrayerCategory;
  excerpt: string; // Short preview text
  body: string; // Full prayer text
  tags?: string[];
}

export interface RosaryMystery {
  type: "joyful" | "sorrowful" | "glorious" | "luminous";
  label: string;
  days: string; // Which days of the week
  mysteries: {
    number: number;
    title: string;
    scripture: string;
    reflection: string;
  }[];
}

export type ChapletStep =
  | { kind: "intro"; label: string; text: string }
  | { kind: "ourFather"; label: string; text: string }
  | {
      kind: "hailMary";
      label: string;
      text: string;
      count: number;
      intention: string;
    }
  | { kind: "eternal"; label: string; text: string }
  | { kind: "closing"; label: string; text: string };
