import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LENTEN_DAYS, LentenDay } from "@/constants/lenten";
import { useSeasonalStore } from "@/stores/seasonalStore";
import { useThemeStore } from "@/stores/themeStore";

const TYPE_CONFIG = {
  fast: { color: "#7C3AED", emoji: "🌿", label: "Fast" },
  pray: { color: "#0369A1", emoji: "🙏", label: "Pray" },
  give: { color: "#166534", emoji: "💚", label: "Give" },
  reflect: { color: "#B45309", emoji: "✝️", label: "Reflect" },
};

export default function LentenJourneyScreen() {
  const { theme } = useThemeStore();
  const {
    hydrate,
    hydrated,
    lentenCompleted,
    completeLentenDay,
    isLentenDayDone,
  } = useSeasonalStore();
  const router = useRouter();
  const [selected, setSelected] = useState<LentenDay | null>(null);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, []);

  const completedCount = lentenCompleted.length;
  const pct = Math.round((completedCount / 40) * 100);

  const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    topBar: { flexDirection: "row", alignItems: "center", padding: 16, gap: 8 },
    topTitle: {
      flex: 1,
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
    },
    scroll: { padding: 20, paddingBottom: 40 },
    hero: {
      borderRadius: 20,
      padding: 20,
      backgroundColor: "#7C3AED",
      marginBottom: 20,
      gap: 8,
    },
    heroTitle: { fontSize: 22, fontWeight: "900", color: "#fff" },
    heroSub: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
    progressBar: {
      height: 8,
      backgroundColor: "rgba(255,255,255,0.3)",
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFil: { height: 8, backgroundColor: "#fff", borderRadius: 4 },
    progressLbl: {
      fontSize: 13,
      color: "rgba(255,255,255,0.9)",
      fontWeight: "700",
    },
    statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
    statBox: {
      flex: 1,
      borderRadius: 14,
      padding: 14,
      backgroundColor: theme.surface,
      alignItems: "center",
      gap: 4,
    },
    statNum: { fontSize: 24, fontWeight: "900", color: theme.primary },
    statLabel: { fontSize: 12, color: theme.textMuted, textAlign: "center" },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
    dayDot: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    dayNum: { fontSize: 12, fontWeight: "700" },
    detailCard: {
      borderRadius: 20,
      padding: 20,
      backgroundColor: theme.surface,
      gap: 12,
    },
    detailTag: {
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 2,
      textTransform: "uppercase",
    },
    detailTitle: { fontSize: 22, fontWeight: "900", color: theme.text },
    detailScrip: { fontSize: 13, color: theme.textMuted, fontStyle: "italic" },
    detailSect: {
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 1,
      color: theme.textMuted,
      textTransform: "uppercase",
      marginTop: 4,
    },
    detailText: { fontSize: 15, color: theme.text, lineHeight: 26 },
    detailPray: {
      borderRadius: 14,
      padding: 16,
      backgroundColor: theme.background,
      gap: 6,
    },
    prayLabel: {
      fontSize: 11,
      fontWeight: "800",
      color: "#7C3AED",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    prayText: {
      fontSize: 15,
      color: theme.text,
      lineHeight: 26,
      fontStyle: "italic",
    },
    doneBtn: {
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
      backgroundColor: "#166534",
    },
    doneBtnLbl: { color: "#fff", fontWeight: "800", fontSize: 15 },
    doneBtn2: {
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
      backgroundColor: theme.background,
    },
    sectionLbl: {
      fontSize: 13,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 10,
    },
  });

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>
        <Text style={s.topTitle}>🌿 Lenten Journey</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={s.hero}>
          <Text style={s.heroTitle}>40-Day Lenten Challenge</Text>
          <Text style={s.heroSub}>Fast. Pray. Give. One day at a time.</Text>
          <View style={s.progressBar}>
            <View style={[s.progressFil, { width: `${pct}%` }]} />
          </View>
          <Text style={s.progressLbl}>
            {completedCount}/40 days completed ({pct}%)
          </Text>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
            const count = LENTEN_DAYS.filter(
              (d) => d.type === type && isLentenDayDone(d.day),
            ).length;
            return (
              <View key={type} style={s.statBox}>
                <Text style={{ fontSize: 20 }}>{cfg.emoji}</Text>
                <Text style={[s.statNum, { color: cfg.color, fontSize: 18 }]}>
                  {count}
                </Text>
                <Text style={s.statLabel}>{cfg.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Day Grid */}
        <Text style={s.sectionLbl}>All 40 Days</Text>
        <View style={s.grid}>
          {LENTEN_DAYS.map((d) => {
            const done = isLentenDayDone(d.day);
            const cfg = TYPE_CONFIG[d.type];
            const isSelected = selected?.day === d.day;
            return (
              <TouchableOpacity
                key={d.day}
                style={[
                  s.dayDot,
                  {
                    backgroundColor: done ? cfg.color : theme.surface,
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: cfg.color,
                  },
                ]}
                onPress={() => setSelected(selected?.day === d.day ? null : d)}
              >
                {done ? (
                  <MaterialCommunityIcons name="check" size={20} color="#fff" />
                ) : (
                  <Text
                    style={[
                      s.dayNum,
                      { color: isSelected ? cfg.color : theme.textMuted },
                    ]}
                  >
                    {d.day}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Detail Card */}
        {selected && (
          <View style={s.detailCard}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text
                style={[
                  s.detailTag,
                  { color: TYPE_CONFIG[selected.type].color },
                ]}
              >
                {TYPE_CONFIG[selected.type].emoji} Day {selected.day} ·{" "}
                {TYPE_CONFIG[selected.type].label}
              </Text>
            </View>
            <Text style={s.detailTitle}>{selected.title}</Text>
            <Text style={s.detailScrip}>{selected.scripture}</Text>

            <Text style={s.detailSect}>Reflection</Text>
            <Text style={s.detailText}>{selected.reflection}</Text>

            {selected.fast && (
              <>
                <Text style={s.detailSect}>Fast</Text>
                <Text style={s.detailText}>{selected.fast}</Text>
              </>
            )}
            {selected.almsgiving && (
              <>
                <Text style={s.detailSect}>Almsgiving</Text>
                <Text style={s.detailText}>{selected.almsgiving}</Text>
              </>
            )}

            <View style={s.detailPray}>
              <Text style={s.prayLabel}>Prayer</Text>
              <Text style={s.prayText}>{selected.prayer}</Text>
            </View>

            {isLentenDayDone(selected.day) ? (
              <View style={s.doneBtn2}>
                <Text style={{ color: "#166534", fontWeight: "700" }}>
                  ✅ Completed
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={s.doneBtn}
                onPress={() => completeLentenDay(selected.day)}
              >
                <Text style={s.doneBtnLbl}>
                  Mark Day {selected.day} Complete
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
