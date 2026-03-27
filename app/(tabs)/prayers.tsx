import { PRAYERS, PRAYER_CATEGORIES } from "@/constants/prayers";
import { PrayerCategory } from "@/constants/prayers.types";
import { usePrayerStore } from "@/stores/prayerStore";
import { useThemeStore } from "@/stores/themeStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrayersScreen() {
  const { theme } = useThemeStore();
  const { favorites, streak, hydrate, hydrated } = usePrayerStore();
  const [activeCategory, setActiveCategory] = useState<
    PrayerCategory | "favorites"
  >("daily");
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) hydrate();
  }, []);

  const filtered =
    activeCategory === "favorites"
      ? PRAYERS.filter((p) => favorites.includes(p.id))
      : activeCategory === "rosary" || activeCategory === "divine_mercy"
        ? []
        : PRAYERS.filter((p) => p.category === activeCategory);

  const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
    title: {
      fontSize: 32,
      fontWeight: "900",
      color: theme.text,
      letterSpacing: -0.5,
    },

    // Modern Streak Card
    streakCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      padding: 12,
      paddingHorizontal: 16,
      borderRadius: 20,
      marginTop: 16,
      borderWidth: 1,
      borderColor: theme.tabBarActive + "30", // Low opacity border
    },
    streakText: { color: theme.tabBarActive, fontWeight: "800", fontSize: 15 },

    // Category Tabs
    catScroll: { paddingLeft: 20, paddingVertical: 16 },
    catBtn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 14,
      marginRight: 10,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    catLabel: { fontSize: 14, fontWeight: "700" },

    content: { padding: 20, gap: 14 },

    // Prayer Item Card
    card: {
      borderRadius: 22,
      padding: 18,
      backgroundColor: theme.surface,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      shadowColor: "#000",
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    iconCircle: {
      width: 50,
      height: 50,
      borderRadius: 15,
      backgroundColor: theme.background, // Subtle contrast
      alignItems: "center",
      justifyContent: "center",
    },
    cardEmoji: { fontSize: 24 },
    cardInfo: { flex: 1 },
    cardTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 4,
    },
    cardExcerpt: { fontSize: 13, color: theme.textMuted, lineHeight: 18 },

    // Featured/Special Cards
    specialCard: {
      borderRadius: 24,
      padding: 24,
      marginBottom: 8,
      overflow: "hidden",
      position: "relative",
    },
    specialTitle: {
      fontSize: 22,
      fontWeight: "900",
      color: "#fff",
      marginBottom: 6,
    },
    specialSub: {
      fontSize: 14,
      color: "rgba(255,255,255,0.8)",
      lineHeight: 20,
      width: "80%",
    },
    bgIcon: { position: "absolute", right: -10, bottom: -10, opacity: 0.2 },

    empty: {
      alignItems: "center",
      justifyContent: "center",
      padding: 60,
      opacity: 0.6,
    },
  });

  const navTo = (id: string) => router.push(`/prayer/${id}` as never);

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={s.header}>
        <Text style={s.title}>Prayer Hub</Text>
        <TouchableOpacity style={s.streakCard}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>🔥</Text>
          <View>
            <Text style={s.streakText}>{streak.current} Day Streak</Text>
            <Text style={{ fontSize: 11, color: theme.textMuted }}>
              Best: {streak.longest} days
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.catScroll}
        >
          {[{ id: "favorites", label: "Favorites" }, ...PRAYER_CATEGORIES].map(
            (cat) => {
              const active = activeCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    s.catBtn,
                    { backgroundColor: active ? theme.primary : theme.surface },
                  ]}
                  onPress={() =>
                    setActiveCategory(cat.id as PrayerCategory | "favorites")
                  }
                >
                  <Text
                    style={[
                      s.catLabel,
                      { color: active ? "#fff" : theme.textMuted },
                    ]}
                  >
                    {"emoji" in cat
                      ? `${cat.emoji} ${cat.label}`
                      : `⭐ ${cat.label}`}
                  </Text>
                </TouchableOpacity>
              );
            },
          )}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
      >
        {/* Rosary Special Card */}
        {activeCategory === "rosary" && (
          <TouchableOpacity
            onPress={() => router.push("/rosary" as never)}
            style={[s.specialCard, { backgroundColor: theme.primary }]}
          >
            <MaterialCommunityIcons
              name="dots-vertical-circle"
              size={100}
              color="#fff"
              style={s.bgIcon}
            />
            <Text style={s.specialTitle}>The Holy Rosary</Text>
            <Text style={s.specialSub}>
              Contemplate the mysteries with a guided bead counter.
            </Text>
          </TouchableOpacity>
        )}

        {/* Divine Mercy Special Card */}
        {activeCategory === "divine_mercy" && (
          <TouchableOpacity
            onPress={() => router.push("/divine-mercy" as never)}
            style={[s.specialCard, { backgroundColor: "#BE123C" }]}
          >
            <MaterialCommunityIcons
              name="heart-pulse"
              size={100}
              color="#fff"
              style={s.bgIcon}
            />
            <Text style={s.specialTitle}>Divine Mercy</Text>
            <Text style={s.specialSub}>
              Pray the chaplet for God&apos;s mercy upon the whole world.
            </Text>
          </TouchableOpacity>
        )}

        {/* Standard Prayer List */}
        {filtered.map((prayer) => (
          <TouchableOpacity
            key={prayer.id}
            style={s.card}
            onPress={() => navTo(prayer.id)}
          >
            <View style={s.iconCircle}>
              <Text style={s.cardEmoji}>
                {prayer.category === "daily"
                  ? "☀️"
                  : prayer.category === "seasonal"
                    ? "✝️"
                    : "🙏"}
              </Text>
            </View>
            <View style={s.cardInfo}>
              <Text style={s.cardTitle}>{prayer.title}</Text>
              <Text style={s.cardExcerpt} numberOfLines={1}>
                {prayer.excerpt}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={theme.textMuted}
            />
          </TouchableOpacity>
        ))}

        {/* Empty State */}
        {filtered.length === 0 &&
          !["rosary", "divine_mercy"].includes(activeCategory) && (
            <View style={s.empty}>
              <MaterialCommunityIcons
                name={
                  activeCategory === "favorites"
                    ? "star-outline"
                    : "book-open-variant"
                }
                size={64}
                color={theme.textMuted}
              />
              <Text
                style={{
                  color: theme.textMuted,
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                {activeCategory === "favorites"
                  ? "Save your favorite prayers here."
                  : "No prayers found."}
              </Text>
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
}
