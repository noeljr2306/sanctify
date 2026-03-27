import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PRAYERS } from "@/constants/prayers";
import { usePrayerStore } from "@/stores/prayerStore";
import { useThemeStore } from "@/stores/themeStore";

export default function PrayerReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useThemeStore();
  const { isFavorite, toggleFavorite, recordPrayer } = usePrayerStore();
  const router = useRouter();

  const prayer = PRAYERS.find((p) => p.id === id);
  const fav = prayer ? isFavorite(prayer.id) : false;

  // Mark prayer as done when screen opens
  useEffect(() => {
    if (prayer) recordPrayer();
  }, []);

  if (!prayer) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: theme.textMuted }}>Prayer not found.</Text>
      </SafeAreaView>
    );
  }

  const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    topBar: { flexDirection: "row", alignItems: "center", padding: 16, gap: 8 },
    backBtn: { padding: 4 },
    topTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
    },
    iconBtn: { padding: 4 },
    scroll: { padding: 24, paddingTop: 8 },
    title: {
      fontSize: 26,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 16,
    },
    divider: {
      height: 2,
      backgroundColor: theme.primary,
      width: 48,
      borderRadius: 1,
      marginBottom: 20,
      opacity: 0.6,
    },
    body: {
      fontSize: 17,
      color: theme.text,
      lineHeight: 30,
      letterSpacing: 0.2,
    },
    doneBox: {
      margin: 24,
      marginTop: 32,
      borderRadius: 16,
      padding: 16,
      backgroundColor: theme.surface,
      alignItems: "center",
    },
    doneText: {
      color: theme.text,
      fontWeight: "700",
      fontSize: 15,
      marginTop: 8,
    },
    doneSub: { color: theme.textMuted, fontSize: 13, marginTop: 4 },
  });

  const handleShare = () =>
    Share.share({ message: `${prayer.title}\n\n${prayer.body}` });

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
        <Text style={s.topTitle} numberOfLines={1}>
          {prayer.title}
        </Text>
        <TouchableOpacity
          style={s.iconBtn}
          onPress={() => toggleFavorite(prayer.id)}
        >
          <MaterialCommunityIcons
            name={fav ? "heart" : "heart-outline"}
            size={24}
            color={fav ? "#EF4444" : theme.textMuted}
          />
        </TouchableOpacity>
        <TouchableOpacity style={s.iconBtn} onPress={handleShare}>
          <MaterialCommunityIcons
            name="share-outline"
            size={24}
            color={theme.textMuted}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        <Text style={s.title}>{prayer.title}</Text>
        <View style={s.divider} />
        <Text style={s.body}>{prayer.body}</Text>

        {/* Done box */}
        <View style={s.doneBox}>
          <Text style={{ fontSize: 32 }}>✅</Text>
          <Text style={s.doneText}>Prayer Recorded</Text>
          <Text style={s.doneSub}>Your streak has been updated 🔥</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
