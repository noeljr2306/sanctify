import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NOTIFICATION_SETTINGS } from "../constants/notifications";
import { requestNotificationPermissions } from "../lib/notificationScheduler";
import { useNotificationStore } from "../stores/notificationStore";
import { useThemeStore } from "../stores/themeStore";

// Simple time picker using scroll wheels
function TimePicker({
  hour,
  minute,
  onConfirm,
  onClose,
  theme,
}: {
  hour: number;
  minute: number;
  onConfirm: (h: number, m: number) => void;
  onClose: () => void;
  theme: any;
}) {
  const [h, setH] = useState(hour);
  const [m, setM] = useState(minute);

  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const fmt = (n: number) => String(n).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const display12 = h % 12 === 0 ? 12 : h % 12;

  const s = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "flex-end",
    },
    sheet: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      backgroundColor: theme.surface,
    },
    title: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
      marginBottom: 20,
    },
    row: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
      marginBottom: 24,
    },
    timeBox: {
      borderRadius: 12,
      padding: 16,
      minWidth: 70,
      alignItems: "center",
      backgroundColor: theme.background,
    },
    timeLabel: { fontSize: 12, color: theme.textMuted, marginBottom: 4 },
    timeVal: { fontSize: 28, fontWeight: "800", color: theme.text },
    ampmBox: {
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      backgroundColor: theme.background,
    },
    btnRow: { flexDirection: "row", gap: 12 },
    btn: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
    },
    adjRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      marginBottom: 8,
    },
    adjLabel: {
      fontSize: 14,
      color: theme.textMuted,
      width: 60,
      textAlign: "center",
    },
    adjBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <Text style={s.title}>Set Reminder Time</Text>

          {/* Hour adjuster */}
          <View style={s.adjRow}>
            <Text style={s.adjLabel}>Hour</Text>
            <TouchableOpacity
              style={s.adjBtn}
              onPress={() => setH((h) => (h - 1 + 24) % 24)}
            >
              <MaterialCommunityIcons
                name="minus"
                size={18}
                color={theme.text}
              />
            </TouchableOpacity>
            <Text style={[s.timeVal, { width: 50, textAlign: "center" }]}>
              {fmt(display12)}
            </Text>
            <TouchableOpacity
              style={s.adjBtn}
              onPress={() => setH((h) => (h + 1) % 24)}
            >
              <MaterialCommunityIcons
                name="plus"
                size={18}
                color={theme.text}
              />
            </TouchableOpacity>
            <Text
              style={[s.adjLabel, { color: theme.primary, fontWeight: "700" }]}
            >
              {ampm}
            </Text>
          </View>

          {/* Minute adjuster */}
          <View style={s.adjRow}>
            <Text style={s.adjLabel}>Minute</Text>
            <TouchableOpacity
              style={s.adjBtn}
              onPress={() =>
                setM(
                  (m) =>
                    minutes[
                      (minutes.indexOf(m) - 1 + minutes.length) % minutes.length
                    ],
                )
              }
            >
              <MaterialCommunityIcons
                name="minus"
                size={18}
                color={theme.text}
              />
            </TouchableOpacity>
            <Text style={[s.timeVal, { width: 50, textAlign: "center" }]}>
              {fmt(m)}
            </Text>
            <TouchableOpacity
              style={s.adjBtn}
              onPress={() =>
                setM((m) => minutes[(minutes.indexOf(m) + 1) % minutes.length])
              }
            >
              <MaterialCommunityIcons
                name="plus"
                size={18}
                color={theme.text}
              />
            </TouchableOpacity>
            <View style={{ width: 60 }} />
          </View>

          <View style={[s.row, { marginBottom: 20 }]}>
            <Text style={{ color: theme.textMuted, fontSize: 13 }}>
              Reminder will fire daily at {fmt(display12)}:{fmt(m)} {ampm}
            </Text>
          </View>

          <View style={s.btnRow}>
            <TouchableOpacity
              style={[s.btn, { backgroundColor: theme.background }]}
              onPress={onClose}
            >
              <Text style={{ color: theme.textMuted, fontWeight: "700" }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.btn, { backgroundColor: theme.primary }]}
              onPress={() => onConfirm(h, m)}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function NotificationsScreen() {
  const { theme } = useThemeStore();
  const { prefs, hydrate, hydrated, setEnabled, setTime, applyAll } =
    useNotificationStore();
  const router = useRouter();
  const [timePicking, setTimePicking] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  const handleEnableAll = async () => {
    const granted = await requestNotificationPermissions();
    if (!granted) {
      Alert.alert(
        "Permission Required",
        "Please enable notifications for Sanctify in your device Settings.",
        [{ text: "OK" }],
      );
      return;
    }
    await applyAll();
    Alert.alert(
      "✅ Notifications Enabled",
      "Your prayer reminders have been scheduled.",
    );
  };

  const enabledCount = Object.values(prefs).filter(
    (p: any) => p.enabled,
  ).length;

  const fmt12 = (h: number, m: number) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const display = h % 12 === 0 ? 12 : h % 12;
    return `${display}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const pickingId = timePicking
    ? NOTIFICATION_SETTINGS.find(
        (s: (typeof NOTIFICATION_SETTINGS)[0]) => s.id === timePicking,
      )
    : null;

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
    scroll: { padding: 20, paddingBottom: 40 },
    banner: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      backgroundColor: theme.primary,
      gap: 8,
    },
    bannerTitle: { fontSize: 16, fontWeight: "800", color: "#fff" },
    bannerSub: { fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 18 },
    bannerBtn: {
      marginTop: 4,
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.2)",
    },
    bannerBtnLbl: { color: "#fff", fontWeight: "700", fontSize: 14 },
    sectionLbl: {
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 2,
      color: theme.textMuted,
      textTransform: "uppercase",
      marginBottom: 10,
      marginTop: 4,
    },
    item: {
      borderRadius: 16,
      padding: 16,
      backgroundColor: theme.surface,
      marginBottom: 10,
    },
    itemTop: { flexDirection: "row", alignItems: "center", gap: 12 },
    emoji: { fontSize: 24, width: 32, textAlign: "center" },
    itemInfo: { flex: 1 },
    itemLabel: { fontSize: 15, fontWeight: "700", color: theme.text },
    itemDesc: { fontSize: 13, color: theme.textMuted, marginTop: 2 },
    timeBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: theme.background,
    },
    timeLabel: { flex: 1, fontSize: 13, color: theme.textMuted },
    timeValue: { fontSize: 13, fontWeight: "700", color: theme.primary },
    fixedTag: {
      fontSize: 11,
      color: theme.textMuted,
      fontStyle: "italic",
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: theme.background,
    },
    statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
    statBox: {
      flex: 1,
      borderRadius: 14,
      padding: 14,
      backgroundColor: theme.surface,
      alignItems: "center",
      gap: 4,
    },
    statNum: { fontSize: 24, fontWeight: "900", color: theme.primary },
    statLabel: { fontSize: 12, color: theme.textMuted, textAlign: "center" },
  });

  // Group settings
  const angelusGroup = NOTIFICATION_SETTINGS.filter((s: { id: string }) =>
    s.id.startsWith("angelus"),
  );
  const sacramentalGroup = NOTIFICATION_SETTINGS.filter((s: { id: string }) =>
    ["divine_mercy", "holy_day", "lenten_fast"].includes(s.id),
  );
  const personalGroup = NOTIFICATION_SETTINGS.filter((s: { id: string }) =>
    ["daily_reading", "saint_of_day", "custom_prayer"].includes(s.id),
  );

  const renderItem = (setting: (typeof NOTIFICATION_SETTINGS)[0]) => {
    const pref = prefs[setting.id];
    return (
      <View key={setting.id} style={s.item}>
        <View style={s.itemTop}>
          <Text style={s.emoji}>{setting.emoji}</Text>
          <View style={s.itemInfo}>
            <Text style={s.itemLabel}>{setting.label}</Text>
            <Text style={s.itemDesc}>{setting.description}</Text>
          </View>
          <Switch
            value={pref.enabled}
            onValueChange={(v) => setEnabled(setting.id, v)}
            trackColor={{ false: theme.surface, true: theme.primary }}
            thumbColor="#fff"
          />
        </View>

        {/* Time display */}
        {pref.enabled &&
          setting.defaultTime &&
          (setting.fixed ? (
            <Text style={s.fixedTag}>
              🔒 Fixed time:{" "}
              {fmt12(setting.defaultTime.hour, setting.defaultTime.minute)}
            </Text>
          ) : (
            <TouchableOpacity
              style={s.timeBtn}
              onPress={() => setTimePicking(setting.id)}
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={theme.textMuted}
              />
              <Text style={s.timeLabel}>Reminder time</Text>
              <Text style={s.timeValue}>{fmt12(pref.hour, pref.minute)}</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={16}
                color={theme.textMuted}
              />
            </TouchableOpacity>
          ))}
      </View>
    );
  };

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
        <Text style={s.topTitle}>🔔 Notifications</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.statNum}>{enabledCount}</Text>
            <Text style={s.statLabel}>Active reminders</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statNum}>
              {NOTIFICATION_SETTINGS.length - enabledCount}
            </Text>
            <Text style={s.statLabel}>Paused reminders</Text>
          </View>
        </View>

        {/* Enable all banner */}
        <View style={s.banner}>
          <Text style={s.bannerTitle}>🙏 Set Up Prayer Reminders</Text>
          <Text style={s.bannerSub}>
            Schedule all your prayer notifications at once. You can customize
            each one individually below.
          </Text>
          <TouchableOpacity style={s.bannerBtn} onPress={handleEnableAll}>
            <Text style={s.bannerBtnLbl}>✅ Enable All & Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Angelus Bells */}
        <Text style={s.sectionLbl}>🔔 Angelus Bells</Text>
        {angelusGroup.map(renderItem)}

        {/* Sacramental */}
        <Text style={s.sectionLbl}>✝️ Liturgical & Sacramental</Text>
        {sacramentalGroup.map(renderItem)}

        {/* Personal */}
        <Text style={s.sectionLbl}>📖 Daily Faith</Text>
        {personalGroup.map(renderItem)}
      </ScrollView>

      {/* Time Picker Modal */}
      {timePicking && pickingId && (
        <TimePicker
          hour={prefs[timePicking as keyof typeof prefs].hour}
          minute={prefs[timePicking as keyof typeof prefs].minute}
          theme={theme}
          onClose={() => setTimePicking(null)}
          onConfirm={(h, m) => {
            setTime(timePicking as any, h, m);
            setTimePicking(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}
