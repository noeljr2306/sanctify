import { useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/themeStore";
import { useSeasonalStore } from "@/stores/seasonalStore";

const MENU = [
  { icon: "leaf",           color: "#7C3AED", title: "Lenten Journey",     sub: "40-day challenge: Fast, Pray, Give",        route: "/seasonal/lent"     },
  { icon: "candle",         color: "#4A0E72", title: "Advent Calendar",    sub: "24-day scripture, prayer & activity guide", route: "/seasonal/advent"   },
  { icon: "rosette",        color: "#B45309", title: "Chaplets & Novenas", sub: "Build chaplets & track 9-day novenas",      route: "/seasonal/chaplets" },
  { icon: "emoticon-happy", color: "#0369A1", title: "Children's Prayers", sub: "Simple illustrated prayers for kids",       route: "/seasonal/children" },
];

export default function SeasonalHubScreen() {
  const { theme } = useThemeStore();
  const { hydrate, hydrated, lentenCompleted, adventCompleted, chaplets, novenas } = useSeasonalStore();
  const router = useRouter();

  useEffect(() => { if (!hydrated) hydrate(); }, []);

  const s = StyleSheet.create({
    safe:      { flex: 1, backgroundColor: theme.background },
    topBar:    { flexDirection: "row", alignItems: "center", padding: 16, gap: 8 },
    topTitle:  { flex: 1, fontSize: 17, fontWeight: "700", color: theme.text, textAlign: "center" },
    scroll:    { padding: 20, paddingBottom: 40, gap: 14 },
    heading:   { fontSize: 26, fontWeight: "800", color: theme.text },
    sub:       { fontSize: 14, color: theme.textMuted, lineHeight: 20, marginTop: 4 },
    statsRow:  { flexDirection: "row", gap: 10 },
    statBox:   { flex: 1, borderRadius: 14, padding: 14, backgroundColor: theme.surface, alignItems: "center", gap: 4 },
    statNum:   { fontSize: 22, fontWeight: "900", color: theme.primary },
    statLabel: { fontSize: 11, color: theme.textMuted, textAlign: "center" },
    sectionLbl:{ fontSize: 12, fontWeight: "800", letterSpacing: 2, color: theme.textMuted, textTransform: "uppercase" },
    card:      { borderRadius: 16, padding: 18, backgroundColor: theme.surface, flexDirection: "row", alignItems: "center", gap: 14 },
    iconBox:   { width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center" },
    cardTitle: { fontSize: 16, fontWeight: "700", color: theme.text },
    cardSub:   { fontSize: 13, color: theme.textMuted, marginTop: 2 },
  });

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={s.topTitle}>Seasonal Features</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.heading}>🌿 Seasonal & Family</Text>
        <Text style={s.sub}>Journey through the liturgical year with your family.</Text>

        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.statNum}>{lentenCompleted.length}/40</Text>
            <Text style={s.statLabel}>Lenten days</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statNum}>{adventCompleted.length}/24</Text>
            <Text style={s.statLabel}>Advent days</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statNum}>{chaplets.length}</Text>
            <Text style={s.statLabel}>Chaplets built</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statNum}>{novenas.length}</Text>
            <Text style={s.statLabel}>Novenas</Text>
          </View>
        </View>

        <Text style={s.sectionLbl}>Features</Text>

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