import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Chip, Surface } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "@/stores/themeStore";

// Install: npx expo install expo-linear-gradient

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDate(d: Date) {
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function HomeScreen() {
  const { theme, liturgicalDay } = useThemeStore();
  const today = new Date();

  const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    scroll: { flex: 1 },
    hero: {
      paddingHorizontal: 24,
      paddingTop: 48,
      paddingBottom: 32,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
    },
    appName: {
      fontSize: 13,
      fontWeight: "700",
      letterSpacing: 4,
      color: theme.textMuted,
      textTransform: "uppercase",
      marginBottom: 4,
    },
    emoji: { fontSize: 40, marginBottom: 8 },
    seasonLabel: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 4,
    },
    dayName: { fontSize: 16, color: theme.textMuted, marginBottom: 12 },
    dateText: { fontSize: 13, color: theme.textMuted },
    content: { padding: 20, gap: 16 },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "700",
      letterSpacing: 2,
      color: theme.textMuted,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    card: { borderRadius: 16, padding: 16, backgroundColor: theme.surface },
    cardTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 4,
    },
    cardBody: { fontSize: 14, color: theme.textMuted, lineHeight: 20 },
    countdownBox: {
      borderRadius: 16,
      padding: 16,
      backgroundColor: theme.surface,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    countdownNum: { fontSize: 36, fontWeight: "900", color: theme.primary },
    countdownLbl: { fontSize: 14, color: theme.textMuted },
    countdownSub: { fontSize: 12, color: theme.textMuted },
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  });

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <LinearGradient
          colors={theme.gradient as [string, string]}
          style={s.hero}
        >
          <Text style={s.appName}>✝ Sanctify</Text>
          <Text style={s.emoji}>{theme.emoji}</Text>
          <Text style={s.seasonLabel}>{liturgicalDay.seasonLabel}</Text>
          <Text style={s.dayName}>{liturgicalDay.dayName}</Text>
          <Text style={s.dateText}>{formatDate(today)}</Text>
        </LinearGradient>

        <View style={s.content}>
          {/* Countdown */}
          {liturgicalDay.countdown && (
            <>
              <Text style={s.sectionTitle}>Upcoming</Text>
              <View style={s.countdownBox}>
                <Text style={s.countdownNum}>
                  {liturgicalDay.countdown.days}
                </Text>
                <View>
                  <Text style={s.cardTitle}>
                    days until {liturgicalDay.countdown.label}
                  </Text>
                  <Text style={s.countdownSub}>Keep the faith 🙏</Text>
                </View>
              </View>
            </>
          )}

          {/* Saint of the Day placeholder */}
          <Text style={s.sectionTitle}>Saint of the Day</Text>
          <Surface style={s.card} elevation={0}>
            <Text style={s.cardTitle}>🕊️ Saint of the Day</Text>
            <Text style={s.cardBody}>
              Loading saint data... {"\n"}(We'll wire in real data in Phase 2)
            </Text>
          </Surface>

          {/* Quick Actions */}
          <Text style={s.sectionTitle}>Quick Actions</Text>
          <View style={s.chipRow}>
            {[
              "🙏 Morning Prayer",
              "📖 Today's Readings",
              "📿 Rosary",
              "✝️ Confession Prep",
            ].map((label) => (
              <Chip
                key={label}
                style={{ backgroundColor: theme.surface }}
                textStyle={{ color: theme.text, fontSize: 13 }}
              >
                {label}
              </Chip>
            ))}
          </View>

          {/* Daily Readings teaser */}
          <Text style={s.sectionTitle}>Today's Gospel</Text>
          <Surface style={s.card} elevation={0}>
            <Text style={s.cardTitle}>📖 Daily Readings</Text>
            <Text style={s.cardBody}>
              Mass readings will appear here once we wire in the USCCB API in
              Phase 3.
            </Text>
          </Surface>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
