// ─── app/formation/catechism.tsx ─────────────────────────────────────────────
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
import {
  CATECHISM_ENTRIES,
  getTodayCatechism,
} from "@/constants/catechism";
import { useThemeStore } from "@/stores/themeStore";

export default function CatechismScreen() {
  const { theme } = useThemeStore();
  const router = useRouter();
  const today = getTodayCatechism();
  const [selected, setSelected] = useState(today.id);
  const entry = CATECHISM_ENTRIES.find((e) => e.id === selected)!;

  const categories = [...new Set(CATECHISM_ENTRIES.map((e) => e.category))];
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const filtered = activeCategory
    ? CATECHISM_ENTRIES.filter((e) => e.category === activeCategory)
    : CATECHISM_ENTRIES;

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
    catScroll: { paddingHorizontal: 20, paddingVertical: 8, gap: 8 },
    catBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
    },
    catLabel: { fontSize: 12, fontWeight: "700" },
    scroll: { padding: 20, paddingBottom: 40, gap: 12 },
    todayBox: {
      borderRadius: 16,
      padding: 20,
      backgroundColor: theme.primary,
      gap: 6,
      marginBottom: 4,
    },
    todayTag: {
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 2,
      color: "rgba(255,255,255,0.7)",
      textTransform: "uppercase",
    },
    todayPara: {
      fontSize: 13,
      color: "rgba(255,255,255,0.8)",
      fontWeight: "700",
    },
    todayTitle: { fontSize: 20, fontWeight: "800", color: "#fff" },
    todayText: { fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 22 },
    card: {
      borderRadius: 14,
      padding: 16,
      backgroundColor: theme.surface,
      gap: 4,
    },
    cardPara: { fontSize: 11, fontWeight: "700", color: theme.primary },
    cardTitle: { fontSize: 15, fontWeight: "700", color: theme.text },
    cardCat: { fontSize: 12, color: theme.textMuted },
    cardText: {
      fontSize: 14,
      color: theme.textMuted,
      lineHeight: 20,
      marginTop: 4,
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
        <Text style={s.topTitle}>📜 Catechism of the Day</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.catScroll}
      >
        <TouchableOpacity
          style={[
            s.catBtn,
            {
              backgroundColor: !activeCategory ? theme.primary : theme.surface,
            },
          ]}
          onPress={() => setActiveCategory(null)}
        >
          <Text
            style={[
              s.catLabel,
              { color: !activeCategory ? "#fff" : theme.textMuted },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              s.catBtn,
              {
                backgroundColor:
                  activeCategory === c ? theme.primary : theme.surface,
              },
            ]}
            onPress={() => setActiveCategory(c)}
          >
            <Text
              style={[
                s.catLabel,
                { color: activeCategory === c ? "#fff" : theme.textMuted },
              ]}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's highlight */}
        <View style={s.todayBox}>
          <Text style={s.todayTag}>Today&apos;s Teaching</Text>
          <Text style={s.todayPara}>{today.paragraph}</Text>
          <Text style={s.todayTitle}>{today.title}</Text>
          <Text style={s.todayText}>{today.text}</Text>
        </View>

        {filtered
          .filter((e) => e.id !== today.id)
          .map((e) => (
            <View key={e.id} style={s.card}>
              <Text style={s.cardPara}>{e.paragraph}</Text>
              <Text style={s.cardTitle}>{e.title}</Text>
              <Text style={s.cardCat}>{e.category}</Text>
              <Text style={s.cardText}>{e.text}</Text>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
