import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/themeStore";

const MENU = [
  {
    icon: "church",
    color: "#166534",
    title: "Parish Finder",
    sub: "Find Catholic churches near you",
    route: "/community/parishes",
  },
  {
    icon: "candle",
    color: "#B45309",
    title: "Adoration Finder",
    sub: "Locate Eucharistic Adoration chapels",
    route: "/community/adoration",
  },
  {
    icon: "hands-pray",
    color: "#6B21A8",
    title: "Global Prayer Wall",
    sub: "Post intentions & pray for others worldwide",
    route: "/community/prayer-wall",
  },
];

export default function CommunityHubScreen() {
  const { theme } = useThemeStore();
  const router = useRouter();

  const s = StyleSheet.create({
    safe:      { flex: 1, backgroundColor: theme.background },
    topBar:    { flexDirection: "row", alignItems: "center", padding: 16, gap: 8 },
    backBtn:   { padding: 4 },
    topTitle:  { flex: 1, fontSize: 17, fontWeight: "700", color: theme.text, textAlign: "center" },
    scroll:    { padding: 20, paddingBottom: 40, gap: 14 },
    heading:   { fontSize: 26, fontWeight: "800", color: theme.text },
    sub:       { fontSize: 14, color: theme.textMuted, lineHeight: 20, marginTop: 4 },
    banner:    { borderRadius: 20, padding: 20, backgroundColor: theme.primary, gap: 6 },
    bannerTtl: { fontSize: 18, fontWeight: "800", color: "#fff" },
    bannerSub: { fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 20 },
    sectionLbl:{ fontSize: 12, fontWeight: "800", letterSpacing: 2, color: theme.textMuted, textTransform: "uppercase" },
    card:      { borderRadius: 16, padding: 18, backgroundColor: theme.surface, flexDirection: "row", alignItems: "center", gap: 14 },
    iconBox:   { width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center" },
    cardTitle: { fontSize: 16, fontWeight: "700", color: theme.text },
    cardSub:   { fontSize: 13, color: theme.textMuted, marginTop: 2 },
  });

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={s.topTitle}>Community</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.heading}>🕍 Parish & Community</Text>
        <Text style={s.sub}>Connect with the local and global Church.</Text>

        <View style={s.banner}>
          <Text style={s.bannerTtl}>🌍 You Are Not Alone</Text>
          <Text style={s.bannerSub}>
            Over a billion Catholics are praying around the world right now.
            Find your local parish, adore Jesus in the Eucharist, and join
            the global prayer wall.
          </Text>
        </View>

        <Text style={s.sectionLbl}>Explore</Text>

        {MENU.map(item => (
          <TouchableOpacity
            key={item.route}
            style={s.card}
            onPress={() => router.push(item.route as never)}
          >
            <View style={[s.iconBox, { backgroundColor: item.color + "22" }]}>
              <MaterialCommunityIcons name={item.icon as any} size={26} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>{item.title}</Text>
              <Text style={s.cardSub}>{item.sub}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}