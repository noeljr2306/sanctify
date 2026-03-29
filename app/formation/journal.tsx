import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getTodayPrompt } from "@/constants/journalPrompts";
import { useJournalStore } from "@/stores/journalStore";
import { useThemeStore } from "@/stores/themeStore";
import { JournalEntry, SoulState } from "@/types/journal.types";

const SOUL_STATES: { id: SoulState; emoji: string; label: string }[] = [
  { id: "peaceful", emoji: "😌", label: "Peaceful" },
  { id: "grateful", emoji: "🙏", label: "Grateful" },
  { id: "joyful", emoji: "😊", label: "Joyful" },
  { id: "seeking", emoji: "🔍", label: "Seeking" },
  { id: "struggling", emoji: "😔", label: "Struggling" },
  { id: "sorrowful", emoji: "😢", label: "Sorrowful" },
];

type Tab = "write" | "history";

export default function JournalScreen() {
  const { theme } = useThemeStore();
  const { entries, addEntry, deleteEntry, getTodayEntry } = useJournalStore();
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];
  const todayEntry = getTodayEntry();
  const prompt = getTodayPrompt();

  const [tab, setTab] = useState<Tab>("write");
  const [reflection, setReflection] = useState(todayEntry?.reflection ?? "");
  const [soulState, setSoulState] = useState<SoulState>(
    todayEntry?.soulState ?? "peaceful",
  );
  const [gratitude, setGratitude] = useState<string[]>(
    todayEntry?.gratitude ?? ["", "", ""],
  );
  const [saved, setSaved] = useState(!!todayEntry);

  const handleSave = () => {
    if (!reflection.trim()) {
      Alert.alert("Empty Reflection", "Please write something before saving.");
      return;
    }
    if (todayEntry) deleteEntry(todayEntry.id); // replace existing
    addEntry({
      date: today,
      prompt,
      reflection: reflection.trim(),
      gratitude: gratitude.filter((g) => g.trim()),
      soulState,
    });
    setSaved(true);
    Alert.alert("✅ Saved", "Your reflection has been saved.");
  };

  const handleDelete = (entry: JournalEntry) => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteEntry(entry.id),
      },
    ]);
  };

  const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    topBar: { flexDirection: "row", alignItems: "center", padding: 16, gap: 8 },
    backBtn: { padding: 4 },
    topTitle: {
      flex: 1,
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
    },
    tabRow: {
      flexDirection: "row",
      marginHorizontal: 20,
      gap: 8,
      marginBottom: 8,
    },
    tabBtn: {
      flex: 1,
      paddingVertical: 9,
      borderRadius: 12,
      alignItems: "center",
    },
    tabLabel: { fontSize: 13, fontWeight: "700" },
    scroll: { padding: 20, paddingBottom: 60 },
    sectionLbl: {
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 2,
      color: theme.textMuted,
      textTransform: "uppercase",
      marginBottom: 8,
      marginTop: 16,
    },
    promptBox: {
      borderRadius: 14,
      padding: 16,
      backgroundColor: theme.surface,
      marginBottom: 4,
    },
    promptText: {
      fontSize: 15,
      color: theme.text,
      fontStyle: "italic",
      lineHeight: 24,
    },
    input: {
      borderRadius: 14,
      padding: 16,
      backgroundColor: theme.surface,
      color: theme.text,
      fontSize: 15,
      lineHeight: 24,
      minHeight: 140,
      textAlignVertical: "top",
    },
    gratInput: {
      borderRadius: 12,
      padding: 14,
      backgroundColor: theme.surface,
      color: theme.text,
      fontSize: 14,
      marginBottom: 8,
    },
    statesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    stateBtn: {
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    stateLabel: { fontSize: 13, fontWeight: "600" },
    saveBtn: {
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 20,
      backgroundColor: theme.primary,
    },
    saveBtnLbl: { color: "#fff", fontWeight: "800", fontSize: 16 },
    histCard: {
      borderRadius: 16,
      padding: 16,
      backgroundColor: theme.surface,
      marginBottom: 12,
    },
    histDate: { fontSize: 13, fontWeight: "700", color: theme.primary },
    histState: { fontSize: 13, color: theme.textMuted, marginBottom: 6 },
    histText: { fontSize: 14, color: theme.text, lineHeight: 22 },
    histPrompt: {
      fontSize: 12,
      color: theme.textMuted,
      fontStyle: "italic",
      marginTop: 6,
    },
    emptyText: {
      color: theme.textMuted,
      textAlign: "center",
      marginTop: 60,
      fontSize: 15,
    },
  });

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={s.topBar}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.text}
            />
          </TouchableOpacity>
          <Text style={s.topTitle}>✍️ Spiritual Journal</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={s.tabRow}>
          {(["write", "history"] as Tab[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                s.tabBtn,
                { backgroundColor: tab === t ? theme.primary : theme.surface },
              ]}
              onPress={() => setTab(t)}
            >
              <Text
                style={[
                  s.tabLabel,
                  { color: tab === t ? "#fff" : theme.textMuted },
                ]}
              >
                {t === "write" ? "✍️ Today" : `📚 History (${entries.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === "write" ? (
          <ScrollView
            contentContainerStyle={s.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Prompt */}
            <Text style={s.sectionLbl}>Today&apos;s Reflection Prompt</Text>
            <View style={s.promptBox}>
              <Text style={s.promptText}>&apos;{prompt}&apos;</Text>
            </View>

            {/* Soul State */}
            <Text style={s.sectionLbl}>How is your soul today?</Text>
            <View style={s.statesRow}>
              {SOUL_STATES.map((ss) => (
                <TouchableOpacity
                  key={ss.id}
                  style={[
                    s.stateBtn,
                    {
                      backgroundColor:
                        soulState === ss.id ? theme.primary : theme.surface,
                    },
                  ]}
                  onPress={() => setSoulState(ss.id)}
                >
                  <Text>{ss.emoji}</Text>
                  <Text
                    style={[
                      s.stateLabel,
                      { color: soulState === ss.id ? "#fff" : theme.textMuted },
                    ]}
                  >
                    {ss.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Reflection */}
            <Text style={s.sectionLbl}>Your Reflection</Text>
            <TextInput
              style={s.input}
              multiline
              placeholder="Write your reflection here..."
              placeholderTextColor={theme.textMuted}
              value={reflection}
              onChangeText={(t) => {
                setReflection(t);
                setSaved(false);
              }}
            />

            {/* Gratitude */}
            <Text style={s.sectionLbl}>3 Things I&apos;m Grateful For</Text>
            {gratitude.map((g, i) => (
              <TextInput
                key={i}
                style={s.gratInput}
                placeholder={`Gratitude ${i + 1}...`}
                placeholderTextColor={theme.textMuted}
                value={g}
                onChangeText={(v) => {
                  const next = [...gratitude];
                  next[i] = v;
                  setGratitude(next);
                  setSaved(false);
                }}
              />
            ))}

            <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
              <Text style={s.saveBtnLbl}>
                {saved ? "✅ Saved" : "Save Reflection"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={s.scroll}
            showsVerticalScrollIndicator={false}
          >
            {entries.length === 0 ? (
              <Text style={s.emptyText}>
                No journal entries yet.{"\n"}Write your first reflection today!
                🙏
              </Text>
            ) : (
              entries.map((e) => {
                const ss = SOUL_STATES.find((s) => s.id === e.soulState);
                return (
                  <View key={e.id} style={s.histCard}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={s.histDate}>{e.date}</Text>
                      <TouchableOpacity onPress={() => handleDelete(e)}>
                        <MaterialCommunityIcons
                          name="trash-can-outline"
                          size={18}
                          color={theme.textMuted}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={s.histState}>
                      {ss?.emoji} {ss?.label}
                    </Text>
                    <Text style={s.histText} numberOfLines={4}>
                      {e.reflection}
                    </Text>
                    {e.gratitude.length > 0 && (
                      <Text style={[s.histState, { marginTop: 6 }]}>
                        🙏 {e.gratitude.filter(Boolean).join(" · ")}
                      </Text>
                    )}
                    <Text style={s.histPrompt}>&apos;{e.prompt}&apos;</Text>
                  </View>
                );
              })
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
