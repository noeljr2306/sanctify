import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CONFESSION_STEPS } from "@/constants/confession";
import { useConfessionStore } from "@/stores/confessionStore";
import { useThemeStore } from "@/stores/themeStore";

export default function WalkthroughScreen() {
  const { theme } = useThemeStore();
  const { recordConfession } = useConfessionStore();
  const router = useRouter();
  const [stepIdx, setStepIdx] = useState(0);

  const step = CONFESSION_STEPS[stepIdx];
  const isLast = stepIdx === CONFESSION_STEPS.length - 1;
  const progress = Math.round(((stepIdx + 1) / CONFESSION_STEPS.length) * 100);

  const handleFinish = () => {
    Alert.alert(
      "Record Confession?",
      "Would you like to record today as your last confession date?",
      [
        { text: "Not Yet", style: "cancel", onPress: () => router.back() },
        {
          text: "Yes, Record It",
          onPress: () => {
            recordConfession();
            router.back();
          },
        },
      ],
    );
  };

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
    progressBar: {
      height: 6,
      backgroundColor: theme.surface,
      borderRadius: 3,
      marginHorizontal: 20,
      marginBottom: 4,
    },
    progressFill: { height: 6, backgroundColor: "#0369A1", borderRadius: 3 },
    progressLbl: {
      textAlign: "right",
      marginHorizontal: 20,
      fontSize: 12,
      color: theme.textMuted,
      marginBottom: 8,
    },
    stepsRow: {
      flexDirection: "row",
      paddingHorizontal: 20,
      gap: 4,
      marginBottom: 8,
    },
    stepDot: { flex: 1, height: 4, borderRadius: 2 },
    scroll: { padding: 20, paddingBottom: 40 },
    stepNum: {
      fontSize: 12,
      fontWeight: "800",
      color: "#0369A1",
      textTransform: "uppercase",
      letterSpacing: 2,
      marginBottom: 6,
    },
    stepTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 16,
    },
    instruction: {
      fontSize: 16,
      color: theme.text,
      lineHeight: 26,
      marginBottom: 16,
    },
    prayBox: {
      borderRadius: 16,
      padding: 20,
      backgroundColor: theme.surface,
      marginBottom: 16,
    },
    prayLabel: {
      fontSize: 11,
      fontWeight: "800",
      color: "#0369A1",
      textTransform: "uppercase",
      letterSpacing: 2,
      marginBottom: 8,
    },
    prayText: {
      fontSize: 16,
      color: theme.text,
      lineHeight: 28,
      fontStyle: "italic",
    },
    tipBox: {
      borderRadius: 14,
      padding: 14,
      backgroundColor: "#0369A122",
      flexDirection: "row",
      gap: 10,
      marginBottom: 16,
    },
    tipText: { flex: 1, fontSize: 14, color: theme.text, lineHeight: 22 },
    navRow: { flexDirection: "row", gap: 12, marginTop: 8 },
    navBtn: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
    },
    navLabel: { fontSize: 15, fontWeight: "700", color: "#fff" },
  });

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={s.topBar}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() =>
            stepIdx > 0 ? setStepIdx((i) => i - 1) : router.back()
          }
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>
        <Text style={s.topTitle}>Confession Guide</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Step dots */}
      <View style={s.stepsRow}>
        {CONFESSION_STEPS.map((_, i) => (
          <View
            key={i}
            style={[
              s.stepDot,
              {
                backgroundColor:
                  i < stepIdx
                    ? theme.primary
                    : i === stepIdx
                      ? "#0369A1"
                      : theme.surface,
              },
            ]}
          />
        ))}
      </View>
      <Text style={s.progressLbl}>
        Step {stepIdx + 1} of {CONFESSION_STEPS.length}
      </Text>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.stepNum}>Step {stepIdx + 1}</Text>
        <Text style={s.stepTitle}>{step.title}</Text>
        <Text style={s.instruction}>{step.instruction}</Text>

        {step.prayer && (
          <View style={s.prayBox}>
            <Text style={s.prayLabel}>Prayer</Text>
            <Text style={s.prayText}>{step.prayer}</Text>
          </View>
        )}

        {step.tip && (
          <View style={s.tipBox}>
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={20}
              color="#0369A1"
            />
            <Text style={s.tipText}>{step.tip}</Text>
          </View>
        )}

        <View style={s.navRow}>
          {stepIdx > 0 && (
            <TouchableOpacity
              style={[s.navBtn, { backgroundColor: theme.surface, flex: 0.4 }]}
              onPress={() => setStepIdx((i) => i - 1)}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color={theme.text}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              s.navBtn,
              { backgroundColor: isLast ? "#166534" : "#0369A1" },
            ]}
            onPress={isLast ? handleFinish : () => setStepIdx((i) => i + 1)}
          >
            <Text style={s.navLabel}>
              {isLast ? "✅ I've been to Confession" : "Next →"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
