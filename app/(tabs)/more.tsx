import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "@/stores/themeStore";

const MENU_ITEMS = [
  {
    section: "Sacraments",
    items: [
      {
        icon: "cross",
        color: "#7C3AED",
        label: "Confession Prep",
        sub: "Examination, walkthrough & finder",
        route: "/confession",
      },
    ],
  },
  {
    section: "Settings",
    items: [
      {
        icon: "bell-ring",
        color: "#6B21A8",
        label: "Notifications",
        sub: "Angelus bells, prayer reminders & alerts",
        route: "/notifications",
      },
    ],
  },
  {
    section: "Coming Soon",
    items: [
      {
        icon: "calendar-heart",
        color: "#0369A1",
        label: "Sacramental Tracker",
        sub: "Baptism, Confirmation anniversaries",
        route: null,
      },
      {
        icon: "book-open-variant",
        color: "#B45309",
        label: "Faith Formation",
        sub: "Journal, Catechism, Q&A & Quiz",
        route: "/formation",
      },
      {
        icon: "map-marker-radius",
        color: "#166534",
        label: "Parish Finder",
        sub: "Find Mass times near you",
        route: null,
      },
      {
        icon: "account-group",
        color: "#BE123C",
        label: "Family Faith",
        sub: "Family rosary, children's prayers",
        route: null,
      },
      {
        icon: "notebook-edit",
        color: "#6B21A8",
        label: "Spiritual Journal",
        sub: "Daily reflections & gratitude",
        route: null,
      },
    ],
  },
];

export default function MoreScreen() {
  const { theme } = useThemeStore();
  const router = useRouter();

  const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    header: { padding: 20, paddingTop: 16 },
    title: { fontSize: 26, fontWeight: "800", color: theme.text },
    subtitle: { fontSize: 14, color: theme.textMuted, marginTop: 2 },
    scroll: { padding: 20, paddingTop: 8, paddingBottom: 40 },
    sectionLbl: {
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 2,
      color: theme.textMuted,
      textTransform: "uppercase",
      marginBottom: 10,
      marginTop: 8,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.surface,
      marginBottom: 10,
    },
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    label: { fontSize: 15, fontWeight: "700", color: theme.text },
    sub: { fontSize: 13, color: theme.textMuted, marginTop: 2 },
    comingSoon: {
      fontSize: 11,
      color: theme.textMuted,
      fontStyle: "italic",
      marginTop: 2,
    },
  });

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={s.header}>
        <Text style={s.title}>⚙️ More</Text>
        <Text style={s.subtitle}>Features & Settings</Text>
      </View>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {MENU_ITEMS.map((section) => (
          <View key={section.section}>
            <Text style={s.sectionLbl}>{section.section}</Text>
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[s.item, !item.route && { opacity: 0.5 }]}
                onPress={() => item.route && router.push(item.route as never)}
                disabled={!item.route}
              >
                <View
                  style={[s.iconBox, { backgroundColor: item.color + "22" }]}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={24}
                    color={item.color}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>{item.label}</Text>
                  <Text style={s.sub}>{item.sub}</Text>
                  {!item.route && <Text style={s.comingSoon}>Coming soon</Text>}
                </View>
                {item.route && (
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={theme.textMuted}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
