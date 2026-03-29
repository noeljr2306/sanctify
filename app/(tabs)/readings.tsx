import { useReadingsStore } from "@/stores/readingsStore";
import { useThemeStore } from "@/stores/themeStore";
import { Reading } from "@/types/reading.types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function ReadingsScreen() {
  const { theme } = useThemeStore();
  const { readings, loading, error, loadReadings } = useReadingsStore();
  const [activeTab, setActiveTab] = useState<"readings" | "lectio" | "saved">(
    "readings",
  );

  useEffect(() => {
    loadReadings();
  }, []);

  const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
    title: {
      fontSize: 28,
      fontWeight: "900",
      color: theme.text,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 15,
      color: theme.primary,
      fontWeight: "700",
      marginTop: 4,
      textTransform: "uppercase",
      letterSpacing: 1,
    },

    // Modern Pill Tabs
    tabContainer: {
      paddingHorizontal: 20,
      marginBottom: 10,
    },
    tabRow: {
      flexDirection: "row",
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.surface === "#fff" ? "#f0f0f0" : "transparent",
    },
    tabBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: "center",
    },
    activeTab: {
      backgroundColor: theme.primary,
      elevation: 3,
      shadowColor: theme.primary,
      shadowOpacity: 0.3,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
    },
    tabLabel: { fontSize: 13, fontWeight: "700" },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
  });

  if (loading)
    return (
      <SafeAreaView style={[s.safe, s.center]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text
          style={{ marginTop: 12, color: theme.textMuted, fontWeight: "600" }}
        >
          Preparing the Word...
        </Text>
      </SafeAreaView>
    );

  if (error || !readings)
    return (
      <SafeAreaView style={[s.safe, s.center]}>
        <MaterialCommunityIcons
          name="wifi-off"
          size={48}
          color={theme.textMuted}
        />
        <Text
          style={{
            marginTop: 12,
            color: theme.text,
            fontWeight: "600",
            textAlign: "center",
            paddingHorizontal: 40,
          }}
        >
          {error || "Unable to load today's readings"}
        </Text>
        <TouchableOpacity
          style={{
            marginTop: 20,
            backgroundColor: theme.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
          onPress={loadReadings}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={s.header}>
        <Text style={s.title}>Daily Word</Text>
        <Text style={s.subtitle}>{readings?.liturgicalDay || "Today"}</Text>
      </View>

      <View style={s.tabContainer}>
        <View style={s.tabRow}>
          {[
            { id: "readings", label: "Readings", icon: "book-open-variant" },
            { id: "lectio", label: "Lectio", icon: "candle" },
            { id: "saved", label: "Saved", icon: "bookmark" },
          ].map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[s.tabBtn, activeTab === t.id && s.activeTab]}
              onPress={() => setActiveTab(t.id as any)}
            >
              <Text
                style={[
                  s.tabLabel,
                  { color: activeTab === t.id ? "#fff" : theme.textMuted },
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === "readings" && (
        <ReadingsTab readings={readings} theme={theme} />
      )}
      {activeTab === "lectio" && (
        <LectioDivinaTab readings={readings} theme={theme} />
      )}
      {activeTab === "saved" && <SavedVersesTab theme={theme} />}
    </SafeAreaView>
  );
}

// ── Readings List ──────────────────────────────────────────────────────────────
function ReadingsTab({ readings, theme }: any) {
  const { saveVerse, savedVerses } = useReadingsStore();

  const ReadingCard = ({
    reading,
    isGospel = false,
  }: {
    reading: Reading;
    isGospel?: boolean;
  }) => {
    const isSaved = savedVerses.some((v) => v.reference === reading.reference);

    return (
      <View
        style={[
          rs.card,
          isGospel && {
            borderColor: theme.primary,
            borderWidth: 1,
            backgroundColor: theme.surface,
          },
        ]}
      >
        <View style={rs.cardHeader}>
          <View>
            <Text style={[rs.tag, isGospel && { color: theme.primary }]}>
              {reading.title}
            </Text>
            <Text style={rs.ref}>{reading.reference}</Text>
          </View>
          <TouchableOpacity
            onPress={() => saveVerse(reading.reference, reading.text)}
          >
            <MaterialCommunityIcons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isSaved ? theme.primary : theme.textMuted}
            />
          </TouchableOpacity>
        </View>
        <Text style={[rs.body, isGospel && rs.gospelText]}>{reading.text}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={rs.container}
      showsVerticalScrollIndicator={false}
    >
      <ReadingCard reading={readings.firstReading} />
      <ReadingCard reading={readings.psalm} />
      {readings.secondReading && (
        <ReadingCard reading={readings.secondReading} />
      )}
      <ReadingCard reading={readings.gospel} isGospel />

      <View style={rs.reflectionCard}>
        <Text style={rs.reflectionTitle}>Points for Reflection</Text>
        {readings.reflectionQuestions.map((q: string, i: number) => (
          <View key={i} style={rs.qRow}>
            <Text style={{ color: theme.primary, fontWeight: "900" }}>
              {i + 1}
            </Text>
            <Text style={rs.qText}>{q}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const rs = StyleSheet.create({
  container: { padding: 20, gap: 20, paddingBottom: 60 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tag: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "#999",
    marginBottom: 4,
  },
  ref: { fontSize: 18, fontWeight: "800", color: "#222" },
  body: { fontSize: 17, lineHeight: 28, color: "#444", fontFamily: "System" },
  gospelText: { fontWeight: "500", color: "#111" },
  reflectionCard: { padding: 10, marginTop: 10 },
  reflectionTitle: { fontSize: 20, fontWeight: "800", marginBottom: 15 },
  qRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  qText: { flex: 1, fontSize: 15, lineHeight: 22, color: "#555" },
});

// ── Lectio Divina (Meditation Style) ──────────────────────────────────────────
function LectioDivinaTab({ readings, theme }: any) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      label: "Read",
      icon: "book-open-variant",
      inst: "Read the Gospel slowly...",
      content: readings.gospel.text,
    },
    {
      label: "Meditate",
      icon: "brain",
      inst: "What phrase sticks out?",
      content:
        "Focus on one word or phrase that resonates with your soul today.",
    },
    {
      label: "Pray",
      icon: "hands-pray",
      inst: "Talk to God...",
      content: "Conversation with the Lord about His Word.",
    },
    {
      label: "Contemplate",
      icon: "meditation",
      inst: "Rest in Him...",
      content: "Be still. No words are needed now.",
    },
  ];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Progress Bar */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 30 }}>
        {steps.map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              backgroundColor: i <= step ? theme.primary : theme.surface,
            }}
          />
        ))}
      </View>

      <View style={{ flex: 1, alignItems: "center" }}>
        <MaterialCommunityIcons
          name={steps[step].icon as any}
          size={48}
          color={theme.primary}
        />
        <Text style={{ fontSize: 24, fontWeight: "800", marginTop: 12 }}>
          {steps[step].label}
        </Text>
        <Text
          style={{
            textAlign: "center",
            color: theme.textMuted,
            marginTop: 8,
            fontStyle: "italic",
          }}
        >
          {steps[step].inst}
        </Text>

        <View style={{ flex: 1, justifyContent: "center", width: "100%" }}>
          <ScrollView
            style={{
              backgroundColor: theme.surface,
              borderRadius: 24,
              padding: 25,
              maxHeight: "80%",
            }}
          >
            <Text style={{ fontSize: 18, lineHeight: 32, textAlign: "center" }}>
              {steps[step].content}
            </Text>
          </ScrollView>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: theme.primary,
            width: "100%",
            padding: 18,
            borderRadius: 20,
            alignItems: "center",
            marginBottom: 20,
          }}
          onPress={() => setStep((s) => (s + 1) % steps.length)}
        >
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
            {step === 3 ? "Finish Prayer" : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Saved Verses ──────────────────────────────────────────────────────────
function SavedVersesTab({ theme }: any) {
  const { savedVerses, removeSavedVerse } = useReadingsStore();

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      {savedVerses.map((v, i) => (
        <View
          key={i}
          style={{
            backgroundColor: theme.surface,
            padding: 20,
            borderRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "800", color: theme.primary }}>
              {v.reference}
            </Text>
            <TouchableOpacity onPress={() => removeSavedVerse(v.reference)}>
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color={theme.textMuted}
              />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 15, lineHeight: 22, color: theme.text }}>
            &apos;{v.text}&apos;
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
