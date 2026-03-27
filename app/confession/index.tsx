import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useConfessionStore } from "@/stores/confessionStore";
import { useThemeStore } from "@/stores/themeStore";
import { AgeGroup } from "@/types/confession.types";

const AGE_GROUPS: {
  id: AgeGroup;
  label: string;
  emoji: string;
  desc: string;
}[] = [
  {
    id: "adult",
    label: "Adults",
    emoji: "🧑",
    desc: "Full examination based on the 10 Commandments",
  },
  {
    id: "teen",
    label: "Teens",
    emoji: "🧒",
    desc: "Age-appropriate questions for teenagers",
  },
  {
    id: "child",
    label: "Children",
    emoji: "👦",
    desc: "Simple questions for young children",
  },
];

export default function ConfessionHubScreen() {
  const { theme } = useThemeStore();
  const {
    hydrate,
    hydrated,
    ageGroup,
    setAgeGroup,
    lastConfession,
    daysSinceLastConfession,
  } = useConfessionStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) hydrate();
  }, []);

  const days = daysSinceLastConfession();

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
    scroll: { padding: 20, gap: 16, paddingBottom: 40 },
    heading: { fontSize: 26, fontWeight: "800", color: theme.text },
    sub: { fontSize: 14, color: theme.textMuted, lineHeight: 20, marginTop: 4 },
    lastBox: {
      borderRadius: 16,
      padding: 16,
      backgroundColor: theme.surface,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    lastNum: { fontSize: 32, fontWeight: "900", color: theme.primary },
    lastLabel: { fontSize: 14, color: theme.text, fontWeight: "600" },
    lastSub: { fontSize: 12, color: theme.textMuted },
    sectionLbl: {
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 2,
      color: theme.textMuted,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    ageCard: {
      borderRadius: 14,
      padding: 16,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    ageEmoji: { fontSize: 28 },
    ageLabel: { fontSize: 15, fontWeight: "700" },
    ageDesc: { fontSize: 13 },
    actionCard: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    actionIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    actionTitle: { fontSize: 15, fontWeight: "700", color: theme.text },
    actionSub: { fontSize: 13, color: theme.textMuted, marginTop: 2 },
  });

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
        <Text style={s.topTitle}>Confession</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.heading}>✝️ Prepare for Confession</Text>
        <Text style={s.sub}>
          The Sacrament of Reconciliation is one of the greatest gifts of the
          Church — a direct encounter with God&apos;s mercy.
        </Text>

        {/* Last confession tracker */}
        <View style={s.lastBox}>
          {days !== null ? (
            <>
              <Text style={s.lastNum}>{days}</Text>
              <View>
                <Text style={s.lastLabel}>days since last confession</Text>
                <Text style={s.lastSub}>Last: {lastConfession}</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 28 }}>🕊️</Text>
              <View>
                <Text style={s.lastLabel}>No record yet</Text>
                <Text style={s.lastSub}>
                  Tap &apos;I went to confession&apos; after receiving the sacrament.
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Age group selector */}
        <Text style={s.sectionLbl}>Examination for</Text>
        {AGE_GROUPS.map((g) => (
          <TouchableOpacity
            key={g.id}
            style={[
              s.ageCard,
              {
                backgroundColor:
                  ageGroup === g.id ? theme.primary : theme.surface,
                borderWidth: 2,
                borderColor: ageGroup === g.id ? theme.primary : "transparent",
              },
            ]}
            onPress={() => setAgeGroup(g.id)}
          >
            <Text style={s.ageEmoji}>{g.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  s.ageLabel,
                  { color: ageGroup === g.id ? "#fff" : theme.text },
                ]}
              >
                {g.label}
              </Text>
              <Text
                style={[
                  s.ageDesc,
                  {
                    color:
                      ageGroup === g.id
                        ? "rgba(255,255,255,0.8)"
                        : theme.textMuted,
                  },
                ]}
              >
                {g.desc}
              </Text>
            </View>
            {ageGroup === g.id && (
              <MaterialCommunityIcons
                name="check-circle"
                size={22}
                color="#fff"
              />
            )}
          </TouchableOpacity>
        ))}

        {/* Action Cards */}
        <Text style={[s.sectionLbl, { marginTop: 8 }]}>Get Ready</Text>

        {[
          {
            icon: "format-list-checks",
            color: "#7C3AED",
            title: "Examination of Conscience",
            sub: "Review your life against the Commandments",
            route: "/confession/examination",
          },
          {
            icon: "walk",
            color: "#0369A1",
            title: "Confession Walkthrough",
            sub: "Step-by-step guide through the sacrament",
            route: "/confession/walkthrough",
          },
          {
            icon: "map-marker-radius",
            color: "#B45309",
            title: "Find Confession Near Me",
            sub: "Locate parishes with confession times",
            route: "/confession/finder",
          },
        ].map((action) => (
          <TouchableOpacity
            key={action.route}
            style={[s.actionCard, { backgroundColor: theme.surface }]}
            onPress={() => router.push(action.route as never)}
          >
            <View
              style={[s.actionIcon, { backgroundColor: action.color + "22" }]}
            >
              <MaterialCommunityIcons
                name={action.icon as any}
                size={24}
                color={action.color}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.actionTitle}>{action.title}</Text>
              <Text style={s.actionSub}>{action.sub}</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={theme.textMuted}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
