import { useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/themeStore";
import { useJournalStore } from "@/stores/journalStore";
import { getTodayCatechism } from "@/constants/catechism";
import { getTodayPrompt } from "@/constants/journalPrompts";
import { getBadgeForPoints } from "@/constants/quiz";

export default function FormationHubScreen() {
  const { theme } = useThemeStore();
  const { hydrate, hydrated, quizPoints, getTodayEntry, entries } = useJournalStore();
  const router = useRouter();

  useEffect(() => { if (!hydrated) hydrate(); }, []);

  const catechism = getTodayCatechism();
  const todayEntry = getTodayEntry();
  const badge = getBadgeForPoints(quizPoints);
  const prompt = getTodayPrompt();

  const s = StyleSheet.create({
    safe:       { flex: 1, backgroundColor: theme.background },
    topBar:     { flexDirection: "row", alignItems: "center", padding: 16, gap: 8 },
    backBtn:    { padding: 4 },
    topTitle:   { flex: 1, fontSize: 17, fontWeight: "700", color: theme.text, textAlign: "center" },
    scroll:     { padding: 20, paddingBottom: 40, gap: 16 },
    heading:    { fontSize: 26, fontWeight: "800", color: theme.text },
    sub:        { fontSize: 14, color: theme.textMuted, marginTop: 4 },
    statsRow:   { flexDirection: "row", gap: 10 },
    statBox:    { flex: 1, borderRadius: 14, padding: 14, backgroundColor: theme.surface, alignItems: "center", gap: 4 },
    statNum:    { fontSize: 24, fontWeight: "900", color: theme.primary },
    statLabel:  { fontSize: 12, color: theme.textMuted, textAlign: "center" },
    card:       { borderRadius: 16, padding: 18, backgroundColor: theme.surface, gap: 8 },
    cardTag:    { fontSize: 11, fontWeight: "800", letterSpacing: 2, color: theme.primary, textTransform: "uppercase" },
    cardTitle:  { fontSize: 16, fontWeight: "700", color: theme.text },
    cardBody:   { fontSize: 14, color: theme.textMuted, lineHeight: 22 },
    cardBtn:    { borderRadius: 10, paddingVertical: 10, alignItems: "center", marginTop: 4 },
    cardBtnLbl: { fontWeight: "700", fontSize: 14 },
    menuItem:   { borderRadius: 16, padding: 16, backgroundColor: theme.surface, flexDirection: "row", alignItems: "center", gap: 14 },
    menuIcon:   { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
    menuTitle:  { fontSize: 15, fontWeight: "700", color: theme.text },
    menuSub:    { fontSize: 13, color: theme.textMuted, marginTop: 2 },
    sectionLbl: { fontSize: 12, fontWeight: "800", letterSpacing: 2, color: theme.textMuted, textTransform: "uppercase" },
    badgeRow:   { flexDirection: "row", alignItems: "center", gap: 10 },
    badgeEmoji: { fontSize: 32 },
    badgeName:  { fontSize: 16, fontWeight: "800", color: theme.text },
    badgeSub:   { fontSize: 13, color: theme.textMuted },
  });

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={s.topTitle}>Faith Formation</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.heading}>📚 Faith Formation</Text>
        <Text style={s.sub}>Grow in knowledge and love of the Catholic faith.</Text>

        {/* Stats */}
        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.statNum}>{entries.length}</Text>
            <Text style={s.statLabel}>Journal entries</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statNum}>{quizPoints}</Text>
            <Text style={s.statLabel}>Faith points</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statNum}>{badge.emoji}</Text>
            <Text style={s.statLabel}>{badge.label}</Text>
          </View>
        </View>

        {/* Today's Journal Prompt */}
        <Text style={s.sectionLbl}>Today</Text>
        <View style={s.card}>
          <Text style={s.cardTag}>✍️ Daily Reflection</Text>
          <Text style={s.cardTitle}>{prompt}</Text>
          {todayEntry ? (
            <Text style={[s.cardBody, { fontStyle: "italic" }]} numberOfLines={3}>
              &apos;{todayEntry.reflection}&apos;
            </Text>
          ) : (
            <Text style={s.cardBody}>You haven&apos;t written today&apos;s reflection yet.</Text>
          )}
          <TouchableOpacity
            style={[s.cardBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.push("/formation/journal" as never)}
          >
            <Text style={[s.cardBtnLbl, { color: "#fff" }]}>
              {todayEntry ? "Edit Today's Entry" : "Write Today's Reflection"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Catechism of the Day */}
        <View style={s.card}>
          <Text style={s.cardTag}>📜 {catechism.paragraph}</Text>
          <Text style={s.cardTitle}>{catechism.title}</Text>
          <Text style={s.cardBody} numberOfLines={3}>{catechism.text}</Text>
          <TouchableOpacity
            style={[s.cardBtn, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.primary }]}
            onPress={() => router.push("/formation/catechism" as never)}
          >
            <Text style={[s.cardBtnLbl, { color: theme.primary }]}>Read More</Text>
          </TouchableOpacity>
        </View>

        {/* Menu */}
        <Text style={s.sectionLbl}>Explore</Text>
        {[
          { icon: "notebook-edit",     color: "#6B21A8", title: "Spiritual Journal",     sub: `${entries.length} entries written`,          route: "/formation/journal"    },
          { icon: "book-open-variant", color: "#B45309", title: "Catechism of the Day",  sub: "Daily bite-sized CCC teachings",             route: "/formation/catechism"  },
          { icon: "help-circle",       color: "#0369A1", title: "Catholic Q&A",          sub: "Answers to common faith questions",          route: "/formation/qa"         },
          { icon: "trophy",            color: "#166534", title: "Faith Quiz",             sub: `${quizPoints} pts · Badge: ${badge.label}`,  route: "/formation/quiz"       },
        ].map(item => (
          <TouchableOpacity
            key={item.route}
            style={s.menuItem}
            onPress={() => router.push(item.route as never)}
          >
            <View style={[s.menuIcon, { backgroundColor: item.color + "22" }]}>
              <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.menuTitle}>{item.title}</Text>
              <Text style={s.menuSub}>{item.sub}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}