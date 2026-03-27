export interface Reading {
  title: string; // e.g. "First Reading"
  reference: string; // e.g. "Isaiah 40:1-11"
  text: string; // Full scripture text
}

export interface DailyReadings {
  date: string; // YYYY-MM-DD
  liturgicalDay: string; // e.g. "2nd Sunday of Lent"
  firstReading: Reading;
  psalm: Reading;
  secondReading?: Reading; // Only on Sundays/Feasts
  gospel: Reading;
  reflectionQuestions: string[];
}
