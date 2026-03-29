import { useEffect, useState } from "react";
import {
  ScrollView, View, Text, TouchableOpacity, StyleSheet,
  TextInput, Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/themeStore";
import { useSeasonalStore } from "@/stores/seasonalStore";

type Tab = "chaplets" | "novenas";

export default function ChapletsScreen() {
  const { theme } = useThemeStore();
  const { hydrate, hydrated, chaplets, novenas, addChaplet, deleteChaplet, startNovena, completeNovenaDay, deleteNovena } = useSeasonalStore();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("chaplets");
  const [showChapletForm, setShowChapletForm] = useState(false);
  const [showNovenaForm, setShowNovenaForm] = useState(false);

  // Chaplet form state
  const [chapletTitle, setChapletTitle] = useState("");
  const [steps, setSteps] = useState([{ label: "", prayer: "", repeat: 1 }]);

  // Novena form state
  const [novenaTitle, setNovenaTitle] = useState("");

  useEffect(() => { if (!hydrated) hydrate(); }, []);

  const addStep = () => setSteps(s => [...s, { label: "", prayer: "", repeat: 1 }]);
  const removeStep = (i: number) => setSteps(s => s.filter((_, idx) => idx !== i));
  const updateStep = (i: number, field: string, val: string | number) =>
    setSteps(s => s.map((step, idx) => idx === i ? { ...step, [field]: val } : step));

  const handleSaveChaplet = () => {
    if (!chapletTitle.trim()) { Alert.alert("Name required"); return; }
    if (steps.some(s => !s.label.trim() || !s.prayer.trim())) {
      Alert.alert("All steps need a label and prayer."); return;
    }
    addChaplet({ title: chapletTitle.trim(), steps });
    setChapletTitle(""); setSteps([{ label: "", prayer: "", repeat: 1 }]);
    setShowChapletForm(false);
  };

  const handleStartNovena = () => {
    if (!novenaTitle.trim()) { Alert.alert("Novena name required"); return; }
    startNovena(novenaTitle.trim(), new Date().toISOString().split("T")[0]);
    setNovenaTitle(""); setShowNovenaForm(false);
  };

  const today = new Date().toISOString().split("T")[0];

  const getNovenaDay = (novena: typeof novenas[0]) => {
    const start = new Date(novena.startDate);
    const diff = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.min(diff + 1, 9);
  };

  const s = StyleSheet.create({
    safe:       { flex: 1, backgroundColor: theme.background },
    topBar:     { flexDirection: "row", alignItems: "center", padding: 16, gap: 8 },
    topTitle:   { flex: 1, fontSize: 17, fontWeight: "700", color: theme.text, textAlign: "center" },
    tabRow:     { flexDirection: "row", marginHorizontal: 16, gap: 8, marginBottom: 8 },
    tabBtn:     { flex: 1, paddingVertical: 9, borderRadius: 12, alignItems: "center" },
    tabLabel:   { fontSize: 13, fontWeight: "700" },
    scroll:     { padding: 16, paddingBottom: 80 },
    addBtn:     { borderRadius: 14, paddingVertical: 14, alignItems: "center", backgroundColor: theme.primary, marginBottom: 16 },
    addBtnLbl:  { color: "#fff", fontWeight: "700", fontSize: 14 },
    formBox:    { borderRadius: 16, padding: 16, backgroundColor: theme.surface, marginBottom: 16, gap: 10 },
    formTitle:  { fontSize: 16, fontWeight: "700", color: theme.text },
    input:      { borderRadius: 12, padding: 12, backgroundColor: theme.background, color: theme.text, fontSize: 14 },
    stepBox:    { borderRadius: 12, padding: 12, backgroundColor: theme.background, gap: 8 },
    stepNum:    { fontSize: 12, fontWeight: "800", color: theme.primary },
    stepInput:  { borderRadius: 10, padding: 10, backgroundColor: theme.surface, color: theme.text, fontSize: 13 },
    stepRow:    { flexDirection: "row", alignItems: "center", gap: 8 },
    repeatBox:  { flexDirection: "row", alignItems: "center", gap: 6 },
    repeatLbl:  { fontSize: 13, color: theme.textMuted },
    repeatNum:  { fontSize: 15, fontWeight: "700", color: theme.text, width: 28, textAlign: "center" },
    adjBtn:     { width: 28, height: 28, borderRadius: 14, backgroundColor: theme.surface, justifyContent: "center", alignItems: "center" },
    formBtns:   { flexDirection: "row", gap: 8, marginTop: 4 },
    cancelBtn:  { flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: "center", backgroundColor: theme.background },
    saveBtn:    { flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: "center", backgroundColor: theme.primary },
    btnLbl:     { fontWeight: "700", fontSize: 14 },
    card:       { borderRadius: 16, padding: 16, backgroundColor: theme.surface, marginBottom: 12, gap: 8 },
    cardTitle:  { fontSize: 16, fontWeight: "700", color: theme.text },
    cardSub:    { fontSize: 13, color: theme.textMuted },
    cardRow:    { flexDirection: "row", alignItems: "center", gap: 8 },
    dotsRow:    { flexDirection: "row", gap: 6, flexWrap: "wrap" },
    dot:        { width: 28, height: 28, borderRadius: 14, justifyContent: "center", alignItems: "center" },
    dotNum:     { fontSize: 11, fontWeight: "700" },
    emptyText:  { color: theme.textMuted, textAlign: "center", marginTop: 40, fontSize: 14 },
    addStepBtn: { borderRadius: 10, paddingVertical: 10, alignItems: "center", backgroundColor: theme.background },
  });

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={s.topTitle}>📿 Chaplets & Novenas</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={s.tabRow}>
          {(["chaplets", "novenas"] as Tab[]).map(t => (
            <TouchableOpacity key={t} style={[s.tabBtn, { backgroundColor: tab === t ? theme.primary : theme.surface }]} onPress={() => setTab(t)}>
              <Text style={[s.tabLabel, { color: tab === t ? "#fff" : theme.textMuted }]}>
                {t === "chaplets" ? `📿 Chaplets (${chaplets.length})` : `🕯️ Novenas (${novenas.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* ── CHAPLETS ── */}
          {tab === "chaplets" && (
            <>
              <TouchableOpacity style={s.addBtn} onPress={() => setShowChapletForm(!showChapletForm)}>
                <Text style={s.addBtnLbl}>+ Build a Custom Chaplet</Text>
              </TouchableOpacity>

              {showChapletForm && (
                <View style={s.formBox}>
                  <Text style={s.formTitle}>New Chaplet</Text>
                  <TextInput style={s.input} placeholder="Chaplet name..." placeholderTextColor={theme.textMuted} value={chapletTitle} onChangeText={setChapletTitle} />

                  {steps.map((step, i) => (
                    <View key={i} style={s.stepBox}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={s.stepNum}>Step {i + 1}</Text>
                        {steps.length > 1 && (
                          <TouchableOpacity onPress={() => removeStep(i)}>
                            <MaterialCommunityIcons name="close" size={16} color={theme.textMuted} />
                          </TouchableOpacity>
                        )}
                      </View>
                      <TextInput style={s.stepInput} placeholder="Label (e.g. Our Father)" placeholderTextColor={theme.textMuted} value={step.label} onChangeText={v => updateStep(i, "label", v)} />
                      <TextInput style={[s.stepInput, { minHeight: 60, textAlignVertical: "top" }]} placeholder="Prayer text..." placeholderTextColor={theme.textMuted} value={step.prayer} onChangeText={v => updateStep(i, "prayer", v)} multiline />
                      <View style={s.repeatBox}>
                        <Text style={s.repeatLbl}>Repeat:</Text>
                        <TouchableOpacity style={s.adjBtn} onPress={() => updateStep(i, "repeat", Math.max(1, step.repeat - 1))}>
                          <MaterialCommunityIcons name="minus" size={14} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={s.repeatNum}>{step.repeat}</Text>
                        <TouchableOpacity style={s.adjBtn} onPress={() => updateStep(i, "repeat", step.repeat + 1)}>
                          <MaterialCommunityIcons name="plus" size={14} color={theme.text} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}

                  <TouchableOpacity style={s.addStepBtn} onPress={addStep}>
                    <Text style={{ color: theme.primary, fontWeight: "700" }}>+ Add Step</Text>
                  </TouchableOpacity>

                  <View style={s.formBtns}>
                    <TouchableOpacity style={s.cancelBtn} onPress={() => setShowChapletForm(false)}>
                      <Text style={[s.btnLbl, { color: theme.textMuted }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.saveBtn} onPress={handleSaveChaplet}>
                      <Text style={[s.btnLbl, { color: "#fff" }]}>Save Chaplet</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {chaplets.length === 0 && !showChapletForm
                ? <Text style={s.emptyText}>No custom chaplets yet.{"\n"}Build your first one above!</Text>
                : chaplets.map(c => (
                  <View key={c.id} style={s.card}>
                    <View style={s.cardRow}>
                      <Text style={[s.cardTitle, { flex: 1 }]}>📿 {c.title}</Text>
                      <TouchableOpacity onPress={() => Alert.alert("Delete", `Delete "${c.title}"?`, [
                        { text: "Cancel", style: "cancel" },
                        { text: "Delete", style: "destructive", onPress: () => deleteChaplet(c.id) },
                      ])}>
                        <MaterialCommunityIcons name="trash-can-outline" size={18} color={theme.textMuted} />
                      </TouchableOpacity>
                    </View>
                    <Text style={s.cardSub}>{c.steps.length} steps · Created {c.createdAt.split("T")[0]}</Text>
                    {c.steps.map((step, i) => (
                      <Text key={i} style={{ fontSize: 13, color: theme.textMuted }}>
                        {i + 1}. {step.label} {step.repeat > 1 ? `×${step.repeat}` : ""}
                      </Text>
                    ))}
                  </View>
                ))
              }
            </>
          )}

          {/* ── NOVENAS ── */}
          {tab === "novenas" && (
            <>
              <TouchableOpacity style={[s.addBtn, { backgroundColor: "#B45309" }]} onPress={() => setShowNovenaForm(!showNovenaForm)}>
                <Text style={s.addBtnLbl}>+ Start a 9-Day Novena</Text>
              </TouchableOpacity>

              {showNovenaForm && (
                <View style={s.formBox}>
                  <Text style={s.formTitle}>New Novena</Text>
                  <Text style={{ fontSize: 13, color: theme.textMuted }}>A novena is 9 days of consecutive prayer for a specific intention or feast day.</Text>
                  <TextInput style={s.input} placeholder="Novena name or intention..." placeholderTextColor={theme.textMuted} value={novenaTitle} onChangeText={setNovenaTitle} />
                  <View style={s.formBtns}>
                    <TouchableOpacity style={s.cancelBtn} onPress={() => setShowNovenaForm(false)}>
                      <Text style={[s.btnLbl, { color: theme.textMuted }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.saveBtn, { backgroundColor: "#B45309" }]} onPress={handleStartNovena}>
                      <Text style={[s.btnLbl, { color: "#fff" }]}>Begin Novena</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {novenas.length === 0 && !showNovenaForm
                ? <Text style={s.emptyText}>No novenas in progress.{"\n"}Start one above!</Text>
                : novenas.map(n => {
                  const currentDay = getNovenaDay(n);
                  const done = n.completedDays.includes(currentDay);
                  const finished = n.completedDays.length >= 9;
                  return (
                    <View key={n.id} style={s.card}>
                      <View style={s.cardRow}>
                        <Text style={[s.cardTitle, { flex: 1 }]}>🕯️ {n.title}</Text>
                        <TouchableOpacity onPress={() => deleteNovena(n.id)}>
                          <MaterialCommunityIcons name="trash-can-outline" size={18} color={theme.textMuted} />
                        </TouchableOpacity>
                      </View>
                      <Text style={s.cardSub}>Day {Math.min(currentDay, 9)} of 9 · {n.completedDays.length}/9 completed</Text>

                      {/* Day dots */}
                      <View style={s.dotsRow}>
                        {Array.from({ length: 9 }, (_, i) => i + 1).map(day => {
                          const isDone = n.completedDays.includes(day);
                          return (
                            <View key={day} style={[s.dot, { backgroundColor: isDone ? "#B45309" : theme.background }]}>
                              {isDone
                                ? <MaterialCommunityIcons name="check" size={14} color="#fff" />
                                : <Text style={[s.dotNum, { color: day === currentDay ? "#B45309" : theme.textMuted }]}>{day}</Text>
                              }
                            </View>
                          );
                        })}
                      </View>

                      {!finished && !done && (
                        <TouchableOpacity
                          style={[s.saveBtn, { backgroundColor: "#B45309" }]}
                          onPress={() => completeNovenaDay(n.id, currentDay)}
                        >
                          <Text style={[s.btnLbl, { color: "#fff" }]}>✅ Mark Day {currentDay} Complete</Text>
                        </TouchableOpacity>
                      )}
                      {finished && (
                        <View style={[s.cancelBtn, { backgroundColor: "#16653422" }]}>
                          <Text style={{ color: "#166534", fontWeight: "700" }}>🎉 Novena Complete!</Text>
                        </View>
                      )}
                    </View>
                  );
                })
              }
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}