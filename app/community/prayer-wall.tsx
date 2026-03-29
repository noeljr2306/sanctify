import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrayerIntention, supabase } from "@/lib/supabase";
import { useThemeStore } from "@/stores/themeStore";

const MAX_INTENTION_LENGTH = 280;

export default function PrayerWallScreen() {
  const { theme } = useThemeStore();
  const router = useRouter();

  const [intentions, setIntentions] = useState<PrayerIntention[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [author, setAuthor] = useState("");
  const [intention, setIntention] = useState("");
  const [prayedIds, setPrayedIds] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const flatRef = useRef<FlatList>(null);

  // ── Load intentions ──────────────────────────────────────────────────────
  useEffect(() => {
    loadIntentions();

    // Realtime subscription
    const channel = supabase
      .channel("prayer_wall")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "prayer_intentions" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setIntentions((prev) => [payload.new as PrayerIntention, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setIntentions((prev) =>
              prev.map((i) =>
                i.id === (payload.new as PrayerIntention).id
                  ? (payload.new as PrayerIntention)
                  : i,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadIntentions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("prayer_intentions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      setIntentions(data ?? []);
    } catch {
      Alert.alert("Error", "Could not load prayer intentions.");
    } finally {
      setLoading(false);
    }
  };

  // ── Submit intention ──────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!intention.trim()) {
      Alert.alert("Empty Intention", "Please write your prayer intention.");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("prayer_intentions").insert({
        author: author.trim() || "Anonymous",
        intention: intention.trim(),
        pray_count: 0,
      });
      if (error) throw error;
      setIntention("");
      setAuthor("");
      setShowForm(false);
    } catch {
      Alert.alert("Error", "Could not post your intention. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Pray for intention ────────────────────────────────────────────────────
  const handlePray = async (item: PrayerIntention) => {
    if (prayedIds.has(item.id)) return;
    setPrayedIds((prev) => new Set([...prev, item.id]));
    try {
      await supabase
        .from("prayer_intentions")
        .update({ pray_count: item.pray_count + 1 })
        .eq("id", item.id);
    } catch {
      setPrayedIds((prev) => {
        const n = new Set(prev);
        n.delete(item.id);
        return n;
      });
    }
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    topBar: { flexDirection: "row", alignItems: "center", padding: 16, gap: 8 },
    topTitle: {
      flex: 1,
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
    },
    addBtn: { padding: 4 },
    banner: {
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 14,
      padding: 14,
      backgroundColor: "#6B21A822",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    bannerText: { flex: 1, fontSize: 13, color: theme.text, lineHeight: 20 },
    formBox: {
      marginHorizontal: 16,
      marginBottom: 10,
      borderRadius: 16,
      padding: 16,
      backgroundColor: theme.surface,
      gap: 10,
    },
    formTitle: { fontSize: 15, fontWeight: "700", color: theme.text },
    formInput: {
      borderRadius: 12,
      padding: 12,
      backgroundColor: theme.background,
      color: theme.text,
      fontSize: 14,
    },
    formMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    charCount: { fontSize: 12, color: theme.textMuted },
    formBtns: { flexDirection: "row", gap: 8 },
    cancelBtn: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
      backgroundColor: theme.background,
    },
    submitBtn: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
      backgroundColor: "#6B21A8",
    },
    btnLbl: { fontWeight: "700", fontSize: 14 },
    card: {
      marginHorizontal: 16,
      marginBottom: 10,
      borderRadius: 16,
      padding: 16,
      backgroundColor: theme.surface,
      gap: 8,
    },
    cardTop: { flexDirection: "row", alignItems: "center", gap: 6 },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "#6B21A822",
      justifyContent: "center",
      alignItems: "center",
    },
    authorText: { fontSize: 14, fontWeight: "700", color: theme.text, flex: 1 },
    timeText: { fontSize: 12, color: theme.textMuted },
    intentText: { fontSize: 15, color: theme.text, lineHeight: 24 },
    prayRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    prayBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    prayCount: { fontSize: 13, fontWeight: "700" },
    prayLabel: { fontSize: 13, fontWeight: "600" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    emptyText: { color: theme.textMuted, textAlign: "center", marginTop: 8 },
    fab: {
      position: "absolute",
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "#6B21A8",
      justifyContent: "center",
      alignItems: "center",
      elevation: 6,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
  });

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.text}
            />
          </TouchableOpacity>
          <Text style={s.topTitle}>🙏 Global Prayer Wall</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Banner */}
        <View style={s.banner}>
          <Text style={{ fontSize: 24 }}>🌍</Text>
          <Text style={s.bannerText}>
            Catholics worldwide are praying here. Post your intention and let
            others lift you up.
          </Text>
        </View>

        {/* Post form */}
        {showForm && (
          <View style={s.formBox}>
            <Text style={s.formTitle}>✍️ Share Your Intention</Text>
            <TextInput
              style={s.formInput}
              placeholder="Your name (optional)"
              placeholderTextColor={theme.textMuted}
              value={author}
              onChangeText={setAuthor}
            />
            <TextInput
              style={[s.formInput, { minHeight: 80, textAlignVertical: "top" }]}
              placeholder="Please pray for..."
              placeholderTextColor={theme.textMuted}
              value={intention}
              onChangeText={(t) =>
                setIntention(t.slice(0, MAX_INTENTION_LENGTH))
              }
              multiline
            />
            <View style={s.formMeta}>
              <Text style={s.charCount}>
                {intention.length}/{MAX_INTENTION_LENGTH}
              </Text>
            </View>
            <View style={s.formBtns}>
              <TouchableOpacity
                style={s.cancelBtn}
                onPress={() => setShowForm(false)}
              >
                <Text style={[s.btnLbl, { color: theme.textMuted }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.submitBtn}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={[s.btnLbl, { color: "#fff" }]}>
                    Post Intention
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* List */}
        {loading ? (
          <View style={s.center}>
            <ActivityIndicator size="large" color="#6B21A8" />
          </View>
        ) : (
          <FlatList
            ref={flatRef}
            data={intentions}
            keyExtractor={(i) => i.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 4 }}
            ListEmptyComponent={
              <View style={s.center}>
                <Text style={{ fontSize: 40, marginTop: 40 }}>🙏</Text>
                <Text style={s.emptyText}>
                  No intentions yet.{"\n"}Be the first to post!
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const prayed = prayedIds.has(item.id);
              return (
                <View style={s.card}>
                  <View style={s.cardTop}>
                    <View style={s.avatar}>
                      <Text style={{ fontSize: 14 }}>
                        {item.author.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={s.authorText}>{item.author}</Text>
                    <Text style={s.timeText}>{timeAgo(item.created_at)}</Text>
                  </View>
                  <Text style={s.intentText}>{item.intention}</Text>
                  <View style={s.prayRow}>
                    <TouchableOpacity
                      style={[
                        s.prayBtn,
                        {
                          backgroundColor: prayed
                            ? "#6B21A822"
                            : theme.background,
                        },
                      ]}
                      onPress={() => handlePray(item)}
                      disabled={prayed}
                    >
                      <Text style={{ fontSize: 16 }}>🙏</Text>
                      <Text
                        style={[
                          s.prayCount,
                          { color: prayed ? "#6B21A8" : theme.textMuted },
                        ]}
                      >
                        {item.pray_count + (prayed ? 1 : 0)}
                      </Text>
                      <Text
                        style={[
                          s.prayLabel,
                          { color: prayed ? "#6B21A8" : theme.textMuted },
                        ]}
                      >
                        {prayed ? "Praying" : "Pray"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        )}

        {/* FAB */}
        {!showForm && (
          <TouchableOpacity style={s.fab} onPress={() => setShowForm(true)}>
            <MaterialCommunityIcons name="plus" size={28} color="#fff" />
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
