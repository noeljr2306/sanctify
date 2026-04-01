/**
 * Daily Mass Readings via Aelf.org API
 * Free, no API key, returns accurate Catholic liturgical readings
 * Docs: https://api.aelf.org
 */

import { DailyReadings, Reading } from "@/types/reading.types";
import { getLiturgicalDay } from "../utils/liturgicalCalendar";

function todayISO(): string {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

function formatDate(): string {
  const d = new Date();
  // Aelf uses DD/MM/YYYY
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function generateReflections(gospelRef: string): string[] {
  return [
    `What word or phrase from today's Gospel (${gospelRef}) stands out to you?`,
    "How does this passage speak to something happening in your life right now?",
    "What is Jesus asking of you through this Scripture today?",
    "How can you live out this Gospel message in a concrete way today?",
  ];
}

function fallbackReadings(): DailyReadings {
  const litDay = getLiturgicalDay();
  return {
    date: todayISO(),
    liturgicalDay: litDay.dayName,
    firstReading: {
      title: "First Reading",
      reference: "Unavailable",
      text: "Could not load today's readings. Please check your internet connection.",
    },
    psalm: { title: "Responsorial Psalm", reference: "", text: "" },
    gospel: {
      title: "Gospel",
      reference: "Unavailable",
      text: "Could not load today's Gospel. Please check your internet connection.",
    },
    reflectionQuestions: [
      "Take a moment of silent prayer.",
      "Ask God to speak to your heart today.",
    ],
  };
}

export async function fetchDailyReadings(): Promise<DailyReadings> {
  try {
    const date = formatDate();
    // Aelf API - free, accurate Catholic readings, no key needed
    const url = `https://api.aelf.org/v1/messes/${date}/france`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const messe = data?.messes?.[0]; // First Mass of the day
    if (!messe) throw new Error("No Mass data");

    const lectures = messe.lectures ?? [];
    const litDay = getLiturgicalDay();

    let firstReading: Reading = fallbackReadings().firstReading;
    let psalm: Reading = fallbackReadings().psalm;
    let secondReading: Reading | undefined;
    let gospel: Reading = fallbackReadings().gospel;

    for (const l of lectures) {
      const type: string = (l.type ?? "").toLowerCase();
      const ref = l.ref ?? "";
      const text = l.contenu ?? l.intro_lue ?? "";

      if (
        type.includes("lecture_1") ||
        type === "première lecture" ||
        type.includes("1")
      ) {
        firstReading = { title: "First Reading", reference: ref, text };
      } else if (type.includes("psaume") || type.includes("psalm")) {
        psalm = { title: "Responsorial Psalm", reference: ref, text };
      } else if (
        type.includes("lecture_2") ||
        type.includes("2ème") ||
        type.includes("second")
      ) {
        secondReading = { title: "Second Reading", reference: ref, text };
      } else if (
        type.includes("evangile") ||
        type.includes("gospel") ||
        type.includes("évangile")
      ) {
        gospel = { title: "Gospel", reference: ref, text };
      }
    }

    return {
      date: todayISO(),
      liturgicalDay: messe.nom ?? litDay.dayName,
      firstReading,
      psalm,
      secondReading,
      gospel,
      reflectionQuestions: generateReflections(gospel.reference),
    };
  } catch (e) {
    console.warn("Readings fetch error:", e);

    // Fallback to USCCB direct reading page as plain text
    try {
      return await fetchUSCCBFallback();
    } catch {
      return fallbackReadings();
    }
  }
}

// Secondary fallback using the Universalis API (free)
async function fetchUSCCBFallback(): Promise<DailyReadings> {
  const d = new Date();
  const url = `https://universalis.com/${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}/jsonpmass.js`;
  const res = await fetch(url);
  const text = await res.text();

  // Universalis returns JSONP — strip the wrapper
  const json = text.replace(/^.*?\(/, "").replace(/\);?\s*$/, "");
  const data = JSON.parse(json);

  const litDay = getLiturgicalDay();
  const readings: Reading[] =
    data?.Mass?.map((item: any) => ({
      title: item.heading ?? "Reading",
      reference: item.source ?? "",
      text: (item.text ?? []).join("\n"),
    })) ?? [];

  const firstReading =
    readings.find(
      (r) =>
        r.title.toLowerCase().includes("reading") &&
        !r.title.toLowerCase().includes("second"),
    ) ?? fallbackReadings().firstReading;
  const psalm =
    readings.find((r) => r.title.toLowerCase().includes("psalm")) ??
    fallbackReadings().psalm;
  const secondReading = readings.find((r) =>
    r.title.toLowerCase().includes("second"),
  );
  const gospel =
    readings.find((r) => r.title.toLowerCase().includes("gospel")) ??
    fallbackReadings().gospel;

  return {
    date: todayISO(),
    liturgicalDay: data?.dayname?.[0] ?? litDay.dayName,
    firstReading,
    psalm,
    secondReading,
    gospel,
    reflectionQuestions: generateReflections(gospel.reference),
  };
}
