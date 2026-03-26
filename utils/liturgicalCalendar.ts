/**
 * Sanctify – Liturgical Calendar Engine
 * Determines the current liturgical season, week, and day name.
 */

export type LiturgicalSeason =
  | "advent"
  | "christmas"
  | "ordinary_time"
  | "lent"
  | "holy_week"
  | "easter"
  | "pentecost";

export interface LiturgicalDay {
  season: LiturgicalSeason;
  seasonLabel: string;
  weekNumber: number;
  dayName: string; // e.g. "2nd Sunday of Lent"
  color: LiturgicalColor;
  countdown?: {
    // Days until next major season
    label: string;
    days: number;
  };
}

export type LiturgicalColor = "purple" | "white" | "green" | "red" | "rose";

// ─── Easter Computation (Computus Algorithm) ─────────────────────────────────

export function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 1-based
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// ─── Key Liturgical Date Calculations ────────────────────────────────────────

export function getLiturgicalDates(year: number) {
  const easter = getEasterDate(year);

  const ashWednesday = new Date(easter);
  ashWednesday.setDate(easter.getDate() - 46);

  const palmSunday = new Date(easter);
  palmSunday.setDate(easter.getDate() - 7);

  const ascension = new Date(easter);
  ascension.setDate(easter.getDate() + 39);

  const pentecost = new Date(easter);
  pentecost.setDate(easter.getDate() + 49);

  const trinitySunday = new Date(pentecost);
  trinitySunday.setDate(pentecost.getDate() + 7);

  // Advent starts 4 Sundays before Christmas
  const christmas = new Date(year, 11, 25);
  const christmasWeekday = christmas.getDay(); // 0=Sun
  const daysToSunday = christmasWeekday === 0 ? 0 : 7 - christmasWeekday;
  const advent1 = new Date(
    year,
    11,
    25 - 21 - (daysToSunday === 0 ? 7 : daysToSunday),
  );

  return {
    easter,
    ashWednesday,
    palmSunday,
    ascension,
    pentecost,
    trinitySunday,
    christmas,
    advent1,
  };
}

// ─── Core Season Resolver ─────────────────────────────────────────────────────

export function getLiturgicalDay(date: Date = new Date()): LiturgicalDay {
  const year = date.getFullYear();
  const dates = getLiturgicalDates(year);
  const nextYearDates = getLiturgicalDates(year + 1);
  const prevYearDates = getLiturgicalDates(year - 1);

  const d = startOfDay(date);

  // ── Holy Week ──
  if (d >= startOfDay(dates.palmSunday) && d < startOfDay(dates.easter)) {
    const dayOffset = daysBetween(dates.palmSunday, d);
    const holyDays = [
      "Palm Sunday",
      "Holy Monday",
      "Holy Tuesday",
      "Holy Wednesday",
      "Holy Thursday (Triduum)",
      "Good Friday",
      "Holy Saturday",
    ];
    return {
      season: "holy_week",
      seasonLabel: "Holy Week",
      weekNumber: 0,
      dayName: holyDays[dayOffset] ?? "Holy Week",
      color:
        dayOffset === 0 || dayOffset === 4
          ? "red"
          : dayOffset === 5
            ? "red"
            : "purple",
      countdown: { label: "Easter", days: daysBetween(d, dates.easter) },
    };
  }

  // ── Easter Season (Easter to Pentecost) ──
  if (d >= startOfDay(dates.easter) && d < startOfDay(dates.pentecost)) {
    const week = Math.floor(daysBetween(dates.easter, d) / 7) + 1;
    const isEasterSunday = daysBetween(dates.easter, d) === 0;
    return {
      season: "easter",
      seasonLabel: "Easter Season",
      weekNumber: week,
      dayName: isEasterSunday ? "Easter Sunday" : `Week ${week} of Easter`,
      color: "white",
    };
  }

  // ── Pentecost Sunday ──
  if (isSameDay(d, dates.pentecost)) {
    return {
      season: "pentecost",
      seasonLabel: "Pentecost",
      weekNumber: 0,
      dayName: "Pentecost Sunday",
      color: "red",
    };
  }

  // ── Lent ──
  if (d >= startOfDay(dates.ashWednesday) && d < startOfDay(dates.palmSunday)) {
    const week = Math.ceil(daysBetween(dates.ashWednesday, d) / 7);
    const isAshWednesday = isSameDay(d, dates.ashWednesday);
    return {
      season: "lent",
      seasonLabel: "Lent",
      weekNumber: week,
      dayName: isAshWednesday
        ? "Ash Wednesday"
        : `${ordinal(week)} Week of Lent`,
      color: week === 4 ? "rose" : "purple", // Laetare Sunday (Week 4)
      countdown: { label: "Easter", days: daysBetween(d, dates.easter) },
    };
  }

  // ── Advent ──
  const adventEnd = new Date(year, 11, 24); // Dec 24
  if (d >= startOfDay(dates.advent1) && d <= startOfDay(adventEnd)) {
    const week = Math.floor(daysBetween(dates.advent1, d) / 7) + 1;
    return {
      season: "advent",
      seasonLabel: "Advent",
      weekNumber: week,
      dayName: `${ordinal(week)} Week of Advent`,
      color: week === 3 ? "rose" : "purple", // Gaudete Sunday (Week 3)
      countdown: {
        label: "Christmas",
        days: daysBetween(d, new Date(year, 11, 25)),
      },
    };
  }

  // ── Check previous year's Advent (Dec) ──
  const prevAdventEnd = new Date(year - 1, 11, 24);
  if (
    d >= startOfDay(prevYearDates.advent1) &&
    d <= startOfDay(prevAdventEnd)
  ) {
    const week = Math.floor(daysBetween(prevYearDates.advent1, d) / 7) + 1;
    return {
      season: "advent",
      seasonLabel: "Advent",
      weekNumber: week,
      dayName: `${ordinal(week)} Week of Advent`,
      color: week === 3 ? "rose" : "purple",
      countdown: {
        label: "Christmas",
        days: daysBetween(d, new Date(year, 11, 25)),
      },
    };
  }

  // ── Christmas Season ──
  const christmasSeasonEnd = new Date(year, 0, 13); // Jan 13 approx (Baptism of the Lord)
  if (
    (d >= new Date(year - 1, 11, 25) && d <= christmasSeasonEnd) ||
    isSameDay(d, new Date(year, 11, 25))
  ) {
    return {
      season: "christmas",
      seasonLabel: "Christmas Season",
      weekNumber: 0,
      dayName: isSameDay(d, new Date(year, 11, 25))
        ? "Christmas Day"
        : "Christmas Season",
      color: "white",
    };
  }

  // ── Ordinary Time (default) ──
  const ordinaryWeek = computeOrdinaryTimeWeek(d, dates, prevYearDates);
  return {
    season: "ordinary_time",
    seasonLabel: "Ordinary Time",
    weekNumber: ordinaryWeek,
    dayName: `${ordinal(ordinaryWeek)} Week in Ordinary Time`,
    color: "green",
    countdown: {
      label: "Advent",
      days: daysBetween(
        d,
        dates.advent1 > d ? dates.advent1 : nextYearDates.advent1,
      ),
    },
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function daysBetween(a: Date, b: Date): number {
  return Math.round(
    (startOfDay(b).getTime() - startOfDay(a).getTime()) / (1000 * 60 * 60 * 24),
  );
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

function computeOrdinaryTimeWeek(
  d: Date,
  dates: ReturnType<typeof getLiturgicalDates>,
  prevDates: ReturnType<typeof getLiturgicalDates>,
): number {
  // Ordinary time occurs in two stretches:
  // 1. After Baptism of Lord (Jan ~13) to Ash Wednesday
  // 2. After Pentecost to Advent
  const baptismOfLord = new Date(d.getFullYear(), 0, 13);
  if (d >= baptismOfLord && d < dates.ashWednesday) {
    return Math.floor(daysBetween(baptismOfLord, d) / 7) + 1;
  }
  // After Pentecost
  return Math.floor(daysBetween(dates.pentecost, d) / 7) + 10;
}
