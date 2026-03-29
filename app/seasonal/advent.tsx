import { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/themeStore";
import { useSeasonalStore } from "@/stores/seasonalStore";
import { ADVENT_DAYS, AdventDay } from "@/constants/advent";

const CANDLE_COLORS = {
  purple: "#7C3AED",
  rose:   "#DB2777",
  white:  "#F59E0B",
};

const THEME_COLORS: Record<string, string> = {
  Hope:  "#0369A1",
  Peace: "#166534",
  Joy:   "#DB2777",
  Love:  "#B45309",
};

export default function AdventCalendarScreen() {
  const { theme } = useThemeStore();
  const { hydrate, hydrated, adventCompleted, completeAdventDay, isAdventDayDone } = useSeasonalStore();
  const router = useRouter();
  const [selected, setSelected] = useState<AdventDay | null>(null);

  useEffect(() => { if (!hydrated) hydrate(); }, []);

  // Determine lit candles based on week
  const maxWeek = Math.max(...adventCompleted.map(d => ADVENT_DAYS.find(a => a.day === d)?.candleWeek ?? 0), 0);

  const s = StyleSheet.create({
    safe:       { flex: 1, backgroundColor: theme.background },
    topBar:     { flexDirection: "row", alignItems: "center", padding: 16, gap: 8 },
    topTitle:   { flex: 1, fontSize: 17, fontWeight: "700", color: theme.text, textAlign: "center" },
    scroll:     { padding: 20, paddingBottom: 40 },
    hero:       { borderRadius: 20, padding: 20, backgroundColor: "#4A0E72", marginBottom: 20, gap: 10 },
    heroTitle:  { fontSize: 22, fontWeight: "900", color: "#fff" },
    heroSub:    { fontSize: 13, color: "rgba(255,255,255,0.8)" },
    candleRow:  { flexDirection: "row", justifyContent: "center", gap: 16, marginVertical: 8 },
    candle:     { alignItems: "center", gap: 4 },
    candleFlame:{ fontSize: 24 },
    candleBody: { width: 16, height: 40, borderRadius: 4 },
    candleLbl:  { fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: "700" },
    completedLbl:{ fontSize: 13, color: "rgba(255,255,255,0.9)", fontWeight: "700" },
    grid:       { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
    dayBox:     { width: "22%", aspectRatio: 1, borderRadius: 14, justifyContent: "center", alignItems: "center", gap: 2 },
    dayDate:    { fontSize: 9, fontWeight: "700" },
    dayNum:     { fontSize: 15, fontWeight: "900" },
    detailCard: { borderRadius: 20, padding: 20, backgroundColor: theme.surface, gap: 12 },
    themeTag:   { fontSize: 11, fontWeight: "800", letterSpacing: 2, textTransform: "uppercase" },
    detailTitle:{ fontSize: 22, fontWeight: "900", color: theme.text },
    detailDate: { fontSize: 14, color: theme.textMuted },
    scriptBox:  { borderRadius: 14, padding: 16, backgroundColor: theme.background, gap: 4 },
    scriptRef:  { fontSize: 12, fontWeight: "800", color: theme.primary, textTransform: "uppercase", letterSpacing: 1 },
    scriptText: { fontSize: 15, color: theme.text, lineHeight: 26, fontStyle: "italic" },
    sectionLbl: { fontSize: 12, fontWeight: "800", color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1 },
    bodyText:   { fontSize: 15, color: theme.text, lineHeight: 24 },
    prayBox:    { borderRadius: 14, padding: 16, backgroundColor: "#4A0E7222", gap: 6 },
    prayLabel:  { fontSize: 11, fontWeight: "800", color: "#7C3AED", textTransform: "uppercase", letterSpacing: 1 },
    prayText:   { fontSize: 15, color: theme.text, lineHeight: 26, fontStyle: "italic" },
    doneBtn:    { borderRadius: 14, paddingVertical: 14, alignItems: "center", backgroundColor: "#7C3AED" },
    doneBtnLbl: { color: "#fff", fontWeight: "800", fontSize: 15 },
    doneBox:    { borderRadius: 14, paddingVertical: 14, alignItems: "center", backgroundColor: theme.background },
    gridLabel:  { fontSize: 13, fontWeight: "800", color: theme.text, marginBottom: 10 },
  });

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={s.topTitle}>🕯️ Advent Calendar</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={s.hero}>
          <Text style={s.heroTitle}>Advent Calendar 2025</Text>
          <Text style={s.heroSub}>Hope · Peace · Joy · Love</Text>

          {/* Advent Wreath */}
          <View style={s.candleRow}>
            {[
              { week: 1, color: "purple", label: "Hope"  },
              { week: 2, color: "purple", label: "Peace" },
              { week: 3, color: "rose",   label: "Joy"   },
              { week: 4, color: "purple", label: "Love"  },
            ].map((c, i) => {
              const lit = maxWeek >= c.week;
              return (
                <View key={i} style={s.candle}>
                  <Text style={s.candleFlame}>{lit ? "🔥" : "  "}</Text>
                  <View style={[s.candleBody, {
                    backgroundColor: lit
                      ? CANDLE_COLORS[c.color as keyof typeof CANDLE_COLORS]
                      : "rgba(255,255,255,0.2)",
                  }]} />
                  <Text style={s.candleLbl}>{c.label}</Text>
                </View>
              );
            })}
          </View>
          <Text style={s.completedLbl}>{adventCompleted.length}/24 days opened</Text>
        </View>

        {/* Calendar Grid */}
        <Text style={s.gridLabel}>Open Each Day</Text>
        <View style={s.grid}>
          {ADVENT_DAYS.map(d => {
            const done = isAdventDayDone(d.day);
            const themeColor = THEME_COLORS[d.theme] ?? "#7C3AED";
            const candleColor = CANDLE_COLORS[d.candleColor];
            const isSelected = selected?.day === d.day;
            return (
              <TouchableOpacity
                key={d.day}
                style={[s.dayBox, {
                  backgroundColor: done ? candleColor : theme.surface,
                  borderWidth: isSelected ? 2 : 0,
                  borderColor: candleColor,
                }]}
                onPress={() => setSelected(selected?.day === d.day ? null : d)}
              >
                {done ? (
                  <MaterialCommunityIcons name="check" size={22} color="#fff" />
                ) : (
                  <>
                    <Text style={[s.dayDate, { color: theme.textMuted }]}>{d.date.replace("Dec ", "")}</Text>
                    <Text style={[s.dayNum, { color: isSelected ? candleColor : theme.text }]}>{d.day}</Text>
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Detail Card */}
        {selected && (
          <View style={s.detailCard}>
            <Text style={[s.themeTag, { color: THEME_COLORS[selected.theme] }]}>
              🕯️ {selected.date} · Week {selected.candleWeek} · {selected.theme}
            </Text>
            <Text style={s.detailTitle}>{selected.title}</Text>

            <View style={s.scriptBox}>
              <Text style={s.scriptRef}>{selected.scripture}</Text>
              <Text style={s.scriptText}>{selected.scriptureText}</Text>
            </View>

            <Text style={s.sectionLbl}>Today&apos;s Activity</Text>
            <Text style={s.bodyText}>{selected.activity}</Text>

            <View style={s.prayBox}>
              <Text style={s.prayLabel}>Prayer</Text>
              <Text style={s.prayText}>{selected.prayer}</Text>
            </View>

            {isAdventDayDone(selected.day) ? (
              <View style={s.doneBox}>
                <Text style={{ color: "#166534", fontWeight: "700" }}>✅ Day Opened</Text>
              </View>
            ) : (
              <TouchableOpacity style={s.doneBtn} onPress={() => completeAdventDay(selected.day)}>
                <Text style={s.doneBtnLbl}>Open Day {selected.day} 🕯️</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}