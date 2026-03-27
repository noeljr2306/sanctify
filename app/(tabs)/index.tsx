import { useThemeStore } from "@/stores/themeStore";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Surface } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

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
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export default function HomeScreen() {
  const { theme, liturgicalDay } = useThemeStore();
  const today = new Date();

  const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    scroll: { flex: 1 },
    header: {
      paddingHorizontal: 24,
      paddingTop: 40,
      paddingBottom: 40,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      overflow: "hidden",
      position: "relative",
    },
    headerBgEmoji: {
      position: "absolute",
      right: -20,
      bottom: -10,
      fontSize: 120,
      opacity: 0.15,
    },
    appName: {
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 2,
      color: "rgba(255,255,255,0.7)",
      textTransform: "uppercase",
      marginBottom: 20,
    },
    seasonLabel: {
      fontSize: 34,
      fontWeight: "900",
      color: "#fff",
      letterSpacing: -0.5,
    },
    dayName: {
      fontSize: 18,
      color: "rgba(255,255,255,0.9)",
      fontWeight: "500",
      marginBottom: 4,
    },
    dateText: {
      fontSize: 14,
      color: "rgba(255,255,255,0.6)",
      fontWeight: "600",
    },
    content: { padding: 20, marginTop: -20 },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      marginTop: 24,
      paddingHorizontal: 4,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: theme.text,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    card: {
      borderRadius: 20,
      padding: 20,
      backgroundColor: theme.surface,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 6,
    },
    cardBody: { fontSize: 15, color: theme.textMuted, lineHeight: 22 },
    countdownCard: {
      backgroundColor: theme.primary,
      borderRadius: 20,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
    },
    countdownNum: {
      fontSize: 42,
      fontWeight: "900",
      color: "#fff",
      marginRight: 15,
    },
    countdownText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    actionGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 12,
    },
    actionButton: {
      width: "48%",
      backgroundColor: theme.surface,
      padding: 16,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      elevation: 1,
    },
    actionEmoji: { fontSize: 24, marginBottom: 8 },
  });

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Editorial Style Header */}
        <LinearGradient
          colors={theme.gradient as [string, string, ...string[]]}
          style={s.header}
        >
          <Text style={s.headerBgEmoji}>{theme.emoji}</Text>
          <Text style={s.appName}>✝ Sanctify</Text>
          <View>
            <Text style={s.dayName}>{liturgicalDay.dayName}</Text>
            <Text style={s.seasonLabel}>{liturgicalDay.seasonLabel}</Text>
            <Text style={s.dateText}>{formatDate(today)}</Text>
          </View>
        </LinearGradient>

        <View style={s.content}>
          {/* Featured Countdown */}
          {liturgicalDay.countdown && (
            <TouchableOpacity activeOpacity={0.9}>
              <Surface style={s.countdownCard} elevation={4}>
                <Text style={s.countdownNum}>
                  {liturgicalDay.countdown.days}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.countdownText}>
                    Days until {liturgicalDay.countdown.label}
                  </Text>
                  <Text
                    style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}
                  >
                    Keep the faith 🙏
                  </Text>
                </View>
              </Surface>
            </TouchableOpacity>
          )}

          {/* Quick Actions Grid */}
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Spiritual Tools</Text>
          </View>
          <View style={s.actionGrid}>
            {[
              { label: "Morning Prayer", icon: "🙏" },
              { label: "Readings", icon: "📖" },
              { label: "Rosary", icon: "📿" },
              { label: "Confession", icon: "✝️" },
            ].map((item) => (
              <TouchableOpacity key={item.label} style={s.actionButton}>
                <Text style={s.actionEmoji}>{item.icon}</Text>
                <Text
                  style={{ color: theme.text, fontWeight: "600", fontSize: 13 }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Saint of the Day */}
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Daily Patron</Text>
          </View>
          <Surface style={s.card}>
            <Text style={s.cardTitle}>🕊️ Saint of the Day</Text>
            <Text style={s.cardBody}>
              The lives of the saints offer us a blueprint for holiness. Data
              will sync in the next update.
            </Text>
          </Surface>

          {/* Gospel Teaser */}
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>The Holy Gospel</Text>
          </View>
          <Surface style={[s.card, { marginBottom: 40 }]}>
            <Text style={s.cardTitle}>📖 Today&apos;s Word</Text>
            <Text style={s.cardBody}>
              &apos;Go into all the world and proclaim the gospel to the whole
              creation.&apos; — Mark 16:15
            </Text>
          </Surface>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
