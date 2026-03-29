import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CATHOLIC_QA, QA_CATEGORIES } from "@/constants/catholicQA";
import { useThemeStore } from "@/stores/themeStore";

export default function QAScreen() {
  const { theme } = useThemeStore();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = CATHOLIC_QA.filter((q) => {
    const matchesCat = !activeCategory || q.category === activeCategory;
    const matchesSearch =
      !search || q.question.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
    searchBox: {
      marginHorizontal: 20,
      marginBottom: 8,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.surface,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    searchInput: { flex: 1, fontSize: 14, color: theme.text },
    catScroll: { paddingHorizontal: 20, paddingBottom: 8, gap: 8 },
    catBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
    },
    catLabel: { fontSize: 12, fontWeight: "700" },
    scroll: { padding: 20, paddingBottom: 40, gap: 10 },
    card: {
      borderRadius: 16,
      backgroundColor: theme.surface,
      overflow: "hidden",
    },
    qRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 10 },
    catTag: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.primary,
      marginBottom: 2,
    },
    question: {
      flex: 1,
      fontSize: 15,
      fontWeight: "700",
      color: theme.text,
      lineHeight: 22,
    },
    answer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      fontSize: 15,
      color: theme.text,
      lineHeight: 26,
    },
    divider: { height: 1, backgroundColor: theme.background },
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
        <Text style={s.topTitle}>❓ Catholic Q&A</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={s.searchBox}>
        <MaterialCommunityIcons
          name="magnify"
          size={18}
          color={theme.textMuted}
        />
        <TextInput
          style={s.searchInput}
          placeholder="Search questions..."
          placeholderTextColor={theme.textMuted}
          value={search}
          onChangeText={setSearch}
        />
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
        {QA_CATEGORIES.map((c) => (
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
        {filtered.map((q) => (
          <View key={q.id} style={s.card}>
            <TouchableOpacity
              style={s.qRow}
              onPress={() => setExpanded(expanded === q.id ? null : q.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={s.catTag}>{q.category}</Text>
                <Text style={s.question}>{q.question}</Text>
              </View>
              <MaterialCommunityIcons
                name={expanded === q.id ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.textMuted}
              />
            </TouchableOpacity>
            {expanded === q.id && (
              <>
                <View style={s.divider} />
                <Text style={s.answer}>{q.answer}</Text>
              </>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
