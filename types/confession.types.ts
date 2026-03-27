export type AgeGroup = "adult" | "teen" | "child";

export interface ExaminationItem {
  id: string;
  commandment: string;
  question: string;
  checked: boolean;
}

export interface ExaminationSection {
  id: string;
  title: string; // e.g. "First Commandment"
  subtitle: string; // e.g. "I am the Lord your God..."
  items: ExaminationItem[];
}

export interface ConfessionStep {
  id: string;
  title: string;
  instruction: string;
  prayer?: string;
  tip?: string;
}
