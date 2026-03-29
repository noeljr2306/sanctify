import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FAITH_BADGES,
  getBadgeForPoints,
  QUIZ_QUESTIONS,
} from "@/constants/quiz";
import { useJournalStore } from "@/stores/journalStore";
import { useThemeStore } from "@/stores/themeStore";

type QuizState = "list" | "question" | "result";

export default function QuizScreen() {
  const { theme } = useThemeStore();
  const { quizPoints, recordQuizAnswer, hasAnswered } = useJournalStore();
  const router = useRouter();

  const [state, setState] = useState<QuizState>("list");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);

  const unanswered = QUIZ_QUESTIONS.filter((q) => !hasAnswered(q.id));
  const current = unanswered[currentIdx];
  const badge = getBadgeForPoints(quizPoints);
  const nextBadge = FAITH_BADGES.find((b) => b.requiredPoints > quizPoints);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    const correct = idx === current.correctIndex;
    setSelected(idx);
    setWasCorrect(correct);
    recordQuizAnswer(current.id, correct, current.points);
    if (correct) setSessionScore((s) => s + current.points);
    setSessionAnswered((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIdx < unanswered.length - 2) {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setWasCorrect(null);
    } else {
      setState("result");
    }
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
    scroll: { padding: 20, paddingBottom: 40, gap: 16 },
    badgeCard: {
      borderRadius: 20,
      padding: 20,
      backgroundColor: theme.primary,
      gap: 6,
    },
    badgeEmoji: { fontSize: 40 },
    badgeName: { fontSize: 22, fontWeight: "900", color: "#fff" },
    badgeDesc: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
    progressRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    progressBar: {
      flex: 1,
      height: 8,
      backgroundColor: "rgba(255,255,255,0.3)",
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: { height: 8, backgroundColor: "#fff", borderRadius: 4 },
    progressLbl: { fontSize: 12, color: "rgba(255,255,255,0.8)" },
    statsRow: { flexDirection: "row", gap: 10 },
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
    sectionLbl: {
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 2,
      color: theme.textMuted,
      textTransform: "uppercase",
    },
    allDoneBox: {
      borderRadius: 16,
      padding: 24,
      backgroundColor: theme.surface,
      alignItems: "center",
      gap: 8,
    },
    allDoneEmoji: { fontSize: 40 },
    allDoneText: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
    },
    allDoneSub: { fontSize: 14, color: theme.textMuted, textAlign: "center" },
    startBtn: {
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      backgroundColor: theme.primary,
    },
    startBtnLbl: { color: "#fff", fontWeight: "800", fontSize: 16 },
    qCard: {
      borderRadius: 16,
      padding: 20,
      backgroundColor: theme.surface,
      gap: 6,
    },
    qCategory: {
      fontSize: 11,
      fontWeight: "800",
      color: theme.primary,
      textTransform: "uppercase",
      letterSpacing: 2,
    },
    qPoints: { fontSize: 12, color: theme.textMuted },
    qText: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
      lineHeight: 26,
    },
    option: {
      borderRadius: 14,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    optionText: { flex: 1, fontSize: 15, fontWeight: "600" },
    explanation: { borderRadius: 14, padding: 16, gap: 6 },
    expLabel: {
      fontSize: 12,
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    expText: { fontSize: 14, lineHeight: 22 },
    nextBtn: { borderRadius: 14, paddingVertical: 14, alignItems: "center" },
    nextBtnLbl: { fontWeight: "800", fontSize: 15, color: "#fff" },
    resultCard: {
      borderRadius: 20,
      padding: 24,
      backgroundColor: theme.surface,
      alignItems: "center",
      gap: 12,
    },
    resultEmoji: { fontSize: 60 },
    resultScore: { fontSize: 36, fontWeight: "900", color: theme.primary },
    resultLabel: { fontSize: 18, fontWeight: "700", color: theme.text },
    resultSub: { fontSize: 14, color: theme.textMuted, textAlign: "center" },
  });

  // ── LIST view ──────────────────────────────────────────────────────────────
  if (state === "list") {
    const nextPct = nextBadge
      ? Math.min((quizPoints / nextBadge.requiredPoints) * 100, 100)
      : 100;

    return (
      <SafeAreaView style={s.safe} edges={["top"]}>
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.text}
            />
          </TouchableOpacity>
          <Text style={s.topTitle}>🏆 Faith Quiz</Text>
          <View style={{ width: 32 }} />
        </View>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Badge Card */}
          <View style={s.badgeCard}>
            <Text style={s.badgeEmoji}>{badge.emoji}</Text>
            <Text style={s.badgeName}>{badge.label}</Text>
            <Text style={s.badgeDesc}>{badge.description}</Text>
            {nextBadge && (
              <View style={s.progressRow}>
                <View style={s.progressBar}>
                  <View style={[s.progressFill, { width: `${nextPct}%` }]} />
                </View>
                <Text style={s.progressLbl}>
                  {quizPoints}/{nextBadge.requiredPoints} → {nextBadge.emoji}
                </Text>
              </View>
            )}
          </View>

          {/* Stats */}
          <View style={s.statsRow}>
            <View style={s.statBox}>
              <Text style={s.statNum}>{quizPoints}</Text>
              <Text style={s.statLabel}>Total points</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statNum}>
                {QUIZ_QUESTIONS.length - unanswered.length}
              </Text>
              <Text style={s.statLabel}>Answered</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statNum}>{unanswered.length}</Text>
              <Text style={s.statLabel}>Remaining</Text>
            </View>
          </View>

          {/* All Badges */}
          <Text style={s.sectionLbl}>All Badges</Text>
          {FAITH_BADGES.map((b) => (
            <View
              key={b.id}
              style={[
                s.statBox,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  padding: 16,
                  marginBottom: 8,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 28,
                  opacity: quizPoints >= b.requiredPoints ? 1 : 0.3,
                }}
              >
                {b.emoji}
              </Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    s.statLabel,
                    {
                      fontWeight: "700",
                      fontSize: 14,
                      color: theme.text,
                      textAlign: "left",
                    },
                  ]}
                >
                  {b.label}
                </Text>
                <Text style={[s.statLabel, { textAlign: "left" }]}>
                  {b.description}
                </Text>
              </View>
              {quizPoints >= b.requiredPoints && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={theme.primary}
                />
              )}
            </View>
          ))}

          {unanswered.length === 0 ? (
            <View style={s.allDoneBox}>
              <Text style={s.allDoneEmoji}>🎉</Text>
              <Text style={s.allDoneText}>You&apos;ve answered all questions!</Text>
              <Text style={s.allDoneSub}>
                More questions coming soon. Check back after updates.
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={s.startBtn}
              onPress={() => {
                setCurrentIdx(0);
                setSelected(null);
                setWasCorrect(null);
                setSessionScore(0);
                setSessionAnswered(0);
                setState("question");
              }}
            >
              <Text style={s.startBtnLbl}>
                Start Quiz ({unanswered.length} questions) →
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── RESULT view ────────────────────────────────────────────────────────────
  if (state === "result") {
    return (
      <SafeAreaView style={s.safe} edges={["top"]}>
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => setState("list")}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.text}
            />
          </TouchableOpacity>
          <Text style={s.topTitle}>Quiz Complete!</Text>
          <View style={{ width: 32 }} />
        </View>
        <ScrollView
          contentContainerStyle={[s.scroll, { justifyContent: "center" }]}
        >
          <View style={s.resultCard}>
            <Text style={s.resultEmoji}>{sessionScore > 0 ? "🎉" : "📖"}</Text>
            <Text style={s.resultScore}>+{sessionScore} pts</Text>
            <Text style={s.resultLabel}>Session Complete!</Text>
            <Text style={s.resultSub}>
              You answered {sessionAnswered} questions this session. Total
              points: {quizPoints}
            </Text>
            <Text style={{ fontSize: 32 }}>
              {getBadgeForPoints(quizPoints).emoji}
            </Text>
            <Text style={[s.resultLabel, { fontSize: 16 }]}>
              {getBadgeForPoints(quizPoints).label}
            </Text>
          </View>
          <TouchableOpacity
            style={[s.startBtn, { marginTop: 8 }]}
            onPress={() => setState("list")}
          >
            <Text style={s.startBtnLbl}>Back to Quiz Hub</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── QUESTION view ──────────────────────────────────────────────────────────
  if (!current) {
    setState("result");
    return null;
  }

  const getOptionColor = (idx: number) => {
    if (selected === null) return theme.surface;
    if (idx === current.correctIndex) return "#166534";
    if (idx === selected && !wasCorrect) return "#991B1B";
    return theme.surface;
  };

  const getOptionTextColor = (idx: number) => {
    if (selected === null) return theme.text;
    if (idx === current.correctIndex) return "#fff";
    if (idx === selected && !wasCorrect) return "#fff";
    return theme.textMuted;
  };

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => setState("list")}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>
        <Text style={s.topTitle}>
          {currentIdx + 1} / {unanswered.length}
        </Text>
        <Text style={{ color: theme.primary, fontWeight: "700" }}>
          {quizPoints}pts
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.qCard}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={s.qCategory}>{current.category}</Text>
            <Text style={s.qPoints}>+{current.points} pts</Text>
          </View>
          <Text style={s.qText}>{current.question}</Text>
        </View>

        {current.options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[s.option, { backgroundColor: getOptionColor(i) }]}
            onPress={() => handleAnswer(i)}
            disabled={selected !== null}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "rgba(0,0,0,0.1)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: getOptionTextColor(i), fontWeight: "700" }}>
                {["A", "B", "C", "D"][i]}
              </Text>
            </View>
            <Text style={[s.optionText, { color: getOptionTextColor(i) }]}>
              {opt}
            </Text>
            {selected !== null && i === current.correctIndex && (
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color="#fff"
              />
            )}
            {selected === i && !wasCorrect && (
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color="#fff"
              />
            )}
          </TouchableOpacity>
        ))}

        {selected !== null && (
          <>
            <View
              style={[
                s.explanation,
                { backgroundColor: wasCorrect ? "#16653420" : "#99182020" },
              ]}
            >
              <Text
                style={[
                  s.expLabel,
                  { color: wasCorrect ? "#166534" : "#991B1B" },
                ]}
              >
                {wasCorrect ? "✅ Correct!" : "❌ Incorrect"}
              </Text>
              <Text style={[s.expText, { color: theme.text }]}>
                {current.explanation}
              </Text>
            </View>
            <TouchableOpacity
              style={[s.nextBtn, { backgroundColor: theme.primary }]}
              onPress={handleNext}
            >
              <Text style={s.nextBtnLbl}>
                {currentIdx < unanswered.length - 2
                  ? "Next Question →"
                  : "See Results →"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
