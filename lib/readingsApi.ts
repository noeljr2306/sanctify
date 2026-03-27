/**
 * Fetches daily Mass readings from the USCCB website.
 * Since USCCB doesn't have a public JSON API, we scrape their
 * daily readings page and parse the HTML.
 *
 * Endpoint: https://bible.usccb.org/bible/readings/{MMDDYY}.cfm
 */

import { DailyReadings, Reading } from "@/types/reading.types";
import { getLiturgicalDay } from "../utils/liturgicalCalendar";
function todayCode(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}${dd}${yy}`;
}

function dateStr(): string {
  return new Date().toISOString().split("T")[0];
}

// Strip HTML tags from a string
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Parse a reading block from the USCCB HTML
function parseReading(html: string, titleHint: string): Reading | null {
  try {
    // Extract the reading reference (e.g. "Isaiah 40:1-11")
    const refMatch = html.match(/<h3[^>]*class="[^"]*reading[^"]*"[^>]*>(.*?)<\/h3>/is)
      ?? html.match(/<strong>(.*?)<\/strong>/i);
    const reference = refMatch ? stripHtml(refMatch[1]) : titleHint;

    // Extract the body text
    const bodyMatch = html.match(/<div[^>]*class="[^"]*reading-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
      ?? html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);

    let text = "";
    if (Array.isArray(bodyMatch)) {
      text = bodyMatch.map(stripHtml).join("\n\n");
    } else if (bodyMatch) {
      text = stripHtml(bodyMatch[1]);
    }

    return { title: titleHint, reference, text: text || "Text unavailable." };
  } catch {
    return null;
  }
}

// Generate reflection questions from the gospel reference
function generateReflections(gospelRef: string): string[] {
  return [
    `What word or phrase from today's Gospel (${gospelRef}) stands out to you?`,
    "How does this passage speak to something happening in your life right now?",
    "What is Jesus asking of you through this Scripture today?",
    "How can you live out this Gospel message in a concrete way today?",
  ];
}

// ── Fallback: returns a placeholder when the network fetch fails ──────────────
function fallbackReadings(): DailyReadings {
  const litDay = getLiturgicalDay();
  return {
    date: dateStr(),
    liturgicalDay: litDay.dayName,
    firstReading: {
      title: "First Reading",
      reference: "Unable to load",
      text: "Could not fetch today's readings. Please check your connection and try again.",
    },
    psalm: {
      title: "Responsorial Psalm",
      reference: "",
      text: "",
    },
    gospel: {
      title: "Gospel",
      reference: "Unable to load",
      text: "Could not fetch today's Gospel. Please check your connection and try again.",
    },
    reflectionQuestions: [
      "Take a moment of silent prayer.",
      "Ask God to speak to your heart today.",
    ],
  };
}

// ── Main fetch function ───────────────────────────────────────────────────────
export async function fetchDailyReadings(): Promise<DailyReadings> {
  try {
    const code = todayCode();
    const url = `https://bible.usccb.org/bible/readings/${code}.cfm`;

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const litDay = getLiturgicalDay();

    // ── Parse sections by their heading labels ─────────────────────────────
    // Split the page by reading section divs
    const sectionRegex = /<div[^>]*class="[^"]*b-verse[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]*class="[^"]*b-verse|$)/gi;
    const sections: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = sectionRegex.exec(html)) !== null) {
      sections.push(m[1]);
    }

    // Identify sections by keywords
    const find = (keyword: string) =>
      sections.find(s => s.toLowerCase().includes(keyword.toLowerCase())) ?? "";

    const firstReadingHtml = find("first reading");
    const psalmHtml = find("responsorial psalm");
    const secondReadingHtml = find("second reading");
    const gospelHtml = find("gospel");

    const firstReading = parseReading(firstReadingHtml, "First Reading")
      ?? fallbackReadings().firstReading;
    const psalm = parseReading(psalmHtml, "Responsorial Psalm")
      ?? fallbackReadings().psalm;
    const gospel = parseReading(gospelHtml, "Gospel")
      ?? fallbackReadings().gospel;
    const secondReading = secondReadingHtml
      ? parseReading(secondReadingHtml, "Second Reading") ?? undefined
      : undefined;

    return {
      date: dateStr(),
      liturgicalDay: litDay.dayName,
      firstReading,
      psalm,
      secondReading: secondReading ?? undefined,
      gospel,
      reflectionQuestions: generateReflections(gospel.reference),
    };
  } catch (e) {
    console.warn("Readings fetch error:", e);
    return fallbackReadings();
  }
}