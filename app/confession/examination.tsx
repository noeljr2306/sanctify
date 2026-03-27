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
import { useConfessionStore } from "@/stores/confessionStore";
import { useThemeStore } from "@/stores/themeStore";

export default function ExaminationScreen() {
  const { theme } = useThemeStore();
  const { examination, toggleItem, resetExamination, ageGroup } =
    useConfessionStore();
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(
    examination[0]?.id ?? null,
  );

  const totalChecked = examination.reduce(
    (acc, s) => acc + s.items.filter((i) => i.checked).length,
    0,
  );
  const totalItems = examination.reduce((acc, s) => acc + s.items.length, 0);

  const handleReset = () => {
    Alert.alert("Reset Examination", "Clear all your checked items?", [
      { text: "Cancel", style: "cancel" },
      { text: "Reset", style: "destructive", onPress: resetExamination },
    ]);
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
    progressFill: {
      height: 6,
      backgroundColor: theme.primary,
      borderRadius: 3,
    },
    progressLbl: {
      marginHorizontal: 20,
      fontSize: 12,
      color: theme.textMuted,
      marginBottom: 12,
    },
    scroll: { paddingHorizontal: 20, paddingBottom: 40 },
    section: {
      marginBottom: 12,
      borderRadius: 16,
      backgroundColor: theme.surface,
      overflow: "hidden",
    },
    sectionHdr: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      gap: 10,
    },
    sectionTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight: "700",
      color: theme.text,
    },
    sectionSub: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 2,
      fontStyle: "italic",
    },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
    badgeText: { fontSize: 11, fontWeight: "700", color: "#fff" },
    item: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: theme.background,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 1,
    },
    itemText: { flex: 1, fontSize: 14, lineHeight: 22 },
    doneBtn: {
      margin: 20,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      backgroundColor: theme.primary,
    },
    doneBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  });

  const pct = totalItems > 0 ? totalChecked / totalItems : 0;

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
        <Text style={s.topTitle}>Examination of Conscience</Text>
        <TouchableOpacity onPress={handleReset} style={{ padding: 4 }}>
          <MaterialCommunityIcons
            name="refresh"
            size={22}
            color={theme.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${pct * 100}%` }]} />
      </View>
      <Text style={s.progressLbl}>
        {totalChecked} of {totalItems} reviewed
      </Text>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {examination.map((section) => {
          const checkedInSection = section.items.filter(
            (i) => i.checked,
          ).length;
          const isExpanded = expanded === section.id;

          return (
            <View key={section.id} style={s.section}>
              {/* Section Header */}
              <TouchableOpacity
                style={s.sectionHdr}
                onPress={() => setExpanded(isExpanded ? null : section.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={s.sectionTitle}>{section.title}</Text>
                  <Text style={s.sectionSub}>{section.subtitle}</Text>
                </View>
                {checkedInSection > 0 && (
                  <View style={[s.badge, { backgroundColor: theme.primary }]}>
                    <Text style={s.badgeText}>{checkedInSection}</Text>
                  </View>
                )}
                <MaterialCommunityIcons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={theme.textMuted}
                />
              </TouchableOpacity>

              {/* Items */}
              {isExpanded &&
                section.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={s.item}
                    onPress={() => toggleItem(section.id, item.id)}
                  >
                    <View
                      style={[
                        s.checkbox,
                        {
                          borderColor: item.checked
                            ? theme.primary
                            : theme.textMuted,
                          backgroundColor: item.checked
                            ? theme.primary
                            : "transparent",
                        },
                      ]}
                    >
                      {item.checked && (
                        <MaterialCommunityIcons
                          name="check"
                          size={14}
                          color="#fff"
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        s.itemText,
                        { color: item.checked ? theme.textMuted : theme.text },
                      ]}
                    >
                      {item.question}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          );
        })}

        <TouchableOpacity
          style={s.doneBtn}
          onPress={() => router.push("/confession/walkthrough" as never)}
        >
          <Text style={s.doneBtnText}>Ready for Confession →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
