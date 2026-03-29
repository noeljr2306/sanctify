export type SoulState =
  | "peaceful"
  | "grateful"
  | "struggling"
  | "seeking"
  | "joyful"
  | "sorrowful";

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  prompt: string; // Gospel-tied prompt
  reflection: string; // User's written reflection
  gratitude: string[]; // Up to 3 gratitude items
  soulState: SoulState;
  createdAt: string; // ISO timestamp
}
