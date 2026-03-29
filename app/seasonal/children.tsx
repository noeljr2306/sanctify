import { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/themeStore";
import { CHILDREN_PRAYERS, ChildPrayer } from "@/constants/childrenPrayers";

type AgeFilter = "all" | "little" | "older";

const AGE_FILTERS: { id: AgeFilter; label: string; emoji: string }[] = [
  { id: "all",    label: "All",        emoji: "👶" },
  { id: "little", label: "Little",     emoji: "🌟" },
  { id: "older",  label: "Older Kids", emoji: "📖" },
];

const BG_COLORS = [
  "#6B21A8", "#0369A1", "#166534", "#B45309", "#BE123C", "#0891B2", "#7C3AED",
];

export default function ChildrenPrayersScreen() {
  const { theme } = useThemeStore();
  const router = useRouter();
  const [ageFilter, setAgeFilter] = useState<AgeFilter>("all");
  const [selected, setSelected] = useState<ChildPrayer | null>(null);

  const filtered = CHILDREN_PRAYERS.filter(p =>
    ageFilter === "all" || p.ageGroup === "all" || p.ageGroup === ageFilter
  );

  const s = StyleSheet.create({
    safe:       { flex: 1, backgroundColor: theme.background },
    topBar:     { flexDirection: "row", alignItems: "center", padding: 16, gap: 8 },
    topTitle:   { flex: 1, fontSize: 17, fontWeight: "700", color: theme.text, textAlign: "center" },
    filterRow:  { flexDirection: "row", marginHorizontal: 16, gap: 8, marginBottom: 8 },
    filterBtn:  { flex: 1, paddingVertical: 9, borderRadius: 12, alignItems: "center" },
    filterLbl:  { fontSize: 13, fontWeight: "700" },
    scroll:     { padding: 16, paddingBottom: 40 },
    grid:       { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    card:       { width: "47%", borderRadius: 20, padding: 20, gap: 8, minHeight: 120, justifyContent: "space-between" },
    cardEmoji:  { fontSize: 36 },
    cardTitle:  { fontSize: 14, fontWeight: "800", color: "#fff", lineHeight: 20 },
    cardWhen:   { fontSize: 11, color: "rgba(255,255,255,0.75)" },
    detailOverlay:{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
    detailSheet:{ borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, gap: 16, maxHeight: "85%", backgroundColor: theme.surface },
    detailEmoji:{ fontSize: 48, textAlign: "center" },
    detailTitle:{ fontSize: 24, fontWeight: "900", color: theme.text, textAlign: "center" },
    detailWhen: { fontSize: 14, color: theme.textMuted, textAlign: "center", fontStyle: "italic" },
    prayText:   { fontSize: 20, color: theme.text, lineHeight: 36, textAlign: "center", fontStyle: "italic" },
    closeBtn:   { borderRadius: 14, paddingVertical: 14, alignItems: "center", backgroundColor: theme.primary },
    closeBtnLbl:{ color: "#fff", fontWeight: "800", fontSize: 15 },
  });

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={s.topTitle}>👦 Children&apos;s Prayers</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Age filter */}
      <View style={s.filterRow}>
        {AGE_FILTERS.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[s.filterBtn, { backgroundColor: ageFilter === f.id ? theme.primary : theme.surface }]}
            onPress={() => setAgeFilter(f.id)}
          >
            <Text style={[s.filterLbl, { color: ageFilter === f.id ? "#fff" : theme.textMuted }]}>
              {f.emoji} {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.grid}>
          {filtered.map((prayer, idx) => (
            <TouchableOpacity
              key={prayer.id}
              style={[s.card, { backgroundColor: BG_COLORS[idx % BG_COLORS.length] }]}
              onPress={() => setSelected(prayer)}
            >
              <Text style={s.cardEmoji}>{prayer.emoji}</Text>
              <Text style={s.cardTitle}>{prayer.title}</Text>
              <Text style={s.cardWhen}>{prayer.when}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Prayer detail sheet */}
      {selected && (
        <TouchableOpacity
          style={s.detailOverlay}
          activeOpacity={1}
          onPress={() => setSelected(null)}
        >
          <TouchableOpacity activeOpacity={1} style={s.detailSheet} onPress={() => {}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={s.detailEmoji}>{selected.emoji}</Text>
              <Text style={s.detailTitle}>{selected.title}</Text>
              <Text style={s.detailWhen}>{selected.when}</Text>
              <Text style={[s.prayText, { marginVertical: 16 }]}>{selected.prayer}</Text>
              <TouchableOpacity style={s.closeBtn} onPress={() => setSelected(null)}>
                <Text style={s.closeBtnLbl}>Amen 🙏</Text>
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}