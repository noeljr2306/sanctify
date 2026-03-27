import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RosaryMystery } from "@/constants/prayers.types";
import { ROSARY_MYSTERIES, ROSARY_PRAYERS } from "@/constants/roasry";
import { usePrayerStore } from "@/stores/prayerStore";
import { useThemeStore } from "@/stores/themeStore";

type Screen = "picker" | "mystery" | "praying";

interface PrayingState {
  mystery: RosaryMystery;
  mysteryIdx: number; // 0–4 (which mystery)
  beadIdx: number; // position in bead sequence
}

// Bead sequence for one mystery:
// OurFather → 10× HailMary → GloryBe → Fatima → (repeat)
type BeadKind =
  | "ourFather"
  | "hailMary"
  | "gloryBe"
  | "fatima"
  | "start"
  | "end";

function buildBeadSequence(mysteryCount: number) {
  const beads: { kind: BeadKind; mystery?: number; hailNum?: number }[] = [];
  beads.push({ kind: "start" }); // Apostle's Creed
  beads.push({ kind: "ourFather" }); // Initial Our Father
  for (let h = 1; h <= 3; h++) beads.push({ kind: "hailMary", hailNum: h }); // 3 Hail Marys
  beads.push({ kind: "gloryBe" });
  for (let m = 0; m < mysteryCount; m++) {
    beads.push({ kind: "ourFather", mystery: m });
    for (let h = 1; h <= 10; h++)
      beads.push({ kind: "hailMary", mystery: m, hailNum: h });
    beads.push({ kind: "gloryBe", mystery: m });
    beads.push({ kind: "fatima", mystery: m });
  }
  beads.push({ kind: "end" });
  return beads;
}

const BEADS = buildBeadSequence(5);
const BEAD_LABELS: Record<BeadKind, string> = {
  start: "Apostles' Creed",
  ourFather: "Our Father",
  hailMary: "Hail Mary",
  gloryBe: "Glory Be",
  fatima: "Fatima Prayer",
  end: "Hail Holy Queen",
};

export default function RosaryScreen() {
  const { theme } = useThemeStore();
  const { recordPrayer } = usePrayerStore();
  const router = useRouter();

  const [screen, setScreen] = useState<Screen>("picker");
  const [selected, setSelected] = useState<RosaryMystery | null>(null);
  const [beadIdx, setBeadIdx] = useState(0);

  const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    topBar: { flexDirection: "row", alignItems: "center", padding: 16, gap: 8 },
    backBtn: { padding: 4 },
    topTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
    },
    scroll: { padding: 20, gap: 16 },
    heading: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 4,
    },
    sub: { fontSize: 14, color: theme.textMuted, marginBottom: 16 },
    mystCard: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      backgroundColor: theme.surface,
    },
    mystLabel: { fontSize: 18, fontWeight: "800", color: theme.text },
    mystDays: { fontSize: 13, color: theme.textMuted, marginTop: 2 },
    progress: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: 16,
    },
    bead: { width: 14, height: 14, borderRadius: 7 },
    prayBox: {
      borderRadius: 20,
      padding: 24,
      backgroundColor: theme.surface,
      gap: 12,
    },
    beadLabel: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.primary,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    prayText: { fontSize: 17, color: theme.text, lineHeight: 30 },
    mystTitle: { fontSize: 15, fontWeight: "700", color: theme.tabBarActive },
    mystRef: { fontSize: 13, color: theme.textMuted },
    reflText: {
      fontSize: 14,
      color: theme.textMuted,
      fontStyle: "italic",
      lineHeight: 22,
    },
    navRow: { flexDirection: "row", gap: 12, marginTop: 8 },
    navBtn: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
    },
    navLabel: { fontSize: 15, fontWeight: "700", color: "#fff" },
    counter: { alignItems: "center", marginBottom: 12 },
    counterNum: { fontSize: 13, color: theme.textMuted },
  });

  const getCurrentMysteryForBead = () => {
    const bead = BEADS[beadIdx];
    if (bead?.mystery !== undefined && selected) {
      return selected.mysteries[bead.mystery];
    }
    return null;
  };

  const getBeadPrayerText = () => {
    const bead = BEADS[beadIdx];
    if (!bead) return "";
    switch (bead.kind) {
      case "start":
        return ROSARY_PRAYERS.apostlesCreed;
      case "ourFather":
        return ROSARY_PRAYERS.ourFather;
      case "hailMary":
        return ROSARY_PRAYERS.hailMary;
      case "gloryBe":
        return ROSARY_PRAYERS.gloryBe;
      case "fatima":
        return ROSARY_PRAYERS.fatimaPrayer;
      case "end":
        return ROSARY_PRAYERS.hailHolyQueen;
    }
  };

  const advance = () => {
    if (beadIdx < BEADS.length - 1) {
      setBeadIdx((b) => b + 1);
    } else {
      recordPrayer();
      router.back();
    }
  };

  // ── Picker screen ──────────────────────────────────────────────────────────
  if (screen === "picker") {
    return (
      <SafeAreaView style={s.safe} edges={["top"]}>
        <View style={s.topBar}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.text}
            />
          </TouchableOpacity>
          <Text style={s.topTitle}>The Holy Rosary</Text>
          <View style={{ width: 32 }} />
        </View>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.heading}>📿 Choose Your Mysteries</Text>
          <Text style={s.sub}>
            Each set of mysteries corresponds to different days of the week.
          </Text>
          {ROSARY_MYSTERIES.map((m) => (
            <TouchableOpacity
              key={m.type}
              style={s.mystCard}
              onPress={() => {
                setSelected(m);
                setBeadIdx(0);
                setScreen("praying");
              }}
            >
              <Text style={s.mystLabel}>{m.label}</Text>
              <Text style={s.mystDays}>📅 {m.days}</Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 4,
                  marginTop: 12,
                }}
              >
                {m.mysteries.map((my) => (
                  <Text
                    key={my.number}
                    style={{ fontSize: 12, color: theme.textMuted }}
                  >
                    {my.number}. {my.title}
                    {"   "}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Praying screen ─────────────────────────────────────────────────────────
  const bead = BEADS[beadIdx];
  const currentMystery = getCurrentMysteryForBead();
  const isLast = beadIdx === BEADS.length - 1;

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={() => setScreen("picker")}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>
        <Text style={s.topTitle}>{selected?.label}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Bead Progress */}
        <View style={s.progress}>
          {BEADS.map((_, i) => (
            <View
              key={i}
              style={[
                s.bead,
                {
                  backgroundColor:
                    i < beadIdx
                      ? theme.primary
                      : i === beadIdx
                        ? theme.tabBarActive
                        : theme.surface,
                  transform: [{ scale: i === beadIdx ? 1.4 : 1 }],
                },
              ]}
            />
          ))}
        </View>

        <View style={s.counter}>
          <Text style={s.counterNum}>
            {beadIdx + 1} / {BEADS.length}
          </Text>
        </View>

        {/* Mystery info */}
        {currentMystery && (
          <View style={{ marginBottom: 8 }}>
            <Text style={s.mystTitle}>
              {currentMystery.number}. {currentMystery.title}
            </Text>
            <Text style={s.mystRef}>{currentMystery.scripture}</Text>
            <Text style={[s.reflText, { marginTop: 4 }]}>
              {currentMystery.reflection}
            </Text>
          </View>
        )}

        {/* Prayer Box */}
        <View style={s.prayBox}>
          <Text style={s.beadLabel}>
            {BEAD_LABELS[bead.kind]}
            {bead.kind === "hailMary" && bead.hailNum
              ? ` ${bead.hailNum}/10`
              : ""}
          </Text>
          <Text style={s.prayText}>{getBeadPrayerText()}</Text>
        </View>

        {/* Navigation */}
        <View style={s.navRow}>
          {beadIdx > 0 && (
            <TouchableOpacity
              style={[s.navBtn, { backgroundColor: theme.surface, flex: 0.4 }]}
              onPress={() => setBeadIdx((b) => b - 1)}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color={theme.text}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[s.navBtn, { backgroundColor: theme.primary }]}
            onPress={advance}
          >
            <Text style={s.navLabel}>
              {isLast ? "✅ Finish Rosary" : "Next →"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
