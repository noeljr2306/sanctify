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
import { usePrayerStore } from "@/stores/prayerStore";
import { useThemeStore } from "@/stores/themeStore";

interface Step {
  label: string;
  instruction: string;
  prayer: string;
  repeat?: number;
}

const STEPS: Step[] = [
  {
    label: "Opening",
    instruction: "Begin with the Sign of the Cross, then pray:",
    prayer:
      "You expired, Jesus, but the source of life gushed forth for souls, and the ocean of mercy opened up for the whole world. O Fount of Life, unfathomable Divine Mercy, envelop the whole world and empty Yourself out upon us.",
  },
  {
    label: "Our Father",
    instruction: "Pray one Our Father.",
    prayer:
      "Our Father, Who art in Heaven, hallowed be Thy name; Thy Kingdom come, Thy will be done on earth as it is in Heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.",
  },
  {
    label: "Hail Mary",
    instruction: "Pray one Hail Mary.",
    prayer:
      "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
  },
  {
    label: "Apostles' Creed",
    instruction: "Pray the Apostles' Creed.",
    prayer:
      "I believe in God, the Father Almighty, Creator of Heaven and earth; and in Jesus Christ, His only Son, Our Lord, Who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried. He descended into Hell; the third day He rose again from the dead; He ascended into Heaven, and sitteth at the right hand of God, the Father almighty; from thence He shall come to judge the living and the dead. I believe in the Holy Spirit, the holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body and life everlasting. Amen.",
  },
  ...[1, 2, 3, 4, 5]
    .map((d) => ({
      label: `Decade ${d} — Our Father`,
      instruction: `On the large bead before decade ${d}, pray:`,
      prayer:
        "Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world.",
    }))
    .flatMap((s, i) => [
      s,
      {
        label: `Decade ${i + 1} — 10 Hail Marys`,
        instruction: "On each of the 10 small beads, pray:",
        prayer:
          "For the sake of His sorrowful Passion, have mercy on us and on the whole world.",
        repeat: 10,
      },
    ]),
  {
    label: "Closing Doxology",
    instruction: "Pray three times:",
    prayer:
      "Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world.",
    repeat: 3,
  },
  {
    label: "Optional Closing",
    instruction: "Conclude with this prayer from St. Faustina's diary:",
    prayer:
      "Eternal God, in whom mercy is endless and the treasury of compassion inexhaustible, look kindly upon us and increase Your mercy in us, that in difficult moments we might not despair nor become despondent, but with great confidence submit ourselves to Your holy will, which is Love and Mercy itself. Amen.",
  },
];

export default function DivineMercyScreen() {
  const { theme } = useThemeStore();
  const { recordPrayer } = usePrayerStore();
  const router = useRouter();
  const [stepIdx, setStepIdx] = useState(0);

  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;
  const progress = Math.round(((stepIdx + 1) / STEPS.length) * 100);

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
    scroll: { padding: 20, paddingBottom: 40 },
    progressBar: {
      height: 6,
      backgroundColor: theme.surface,
      borderRadius: 3,
      marginHorizontal: 20,
      marginBottom: 4,
    },
    progressFill: { height: 6, backgroundColor: "#BE123C", borderRadius: 3 },
    progressLbl: {
      textAlign: "right",
      marginHorizontal: 20,
      fontSize: 12,
      color: theme.textMuted,
      marginBottom: 16,
    },
    stepLabel: {
      fontSize: 13,
      fontWeight: "700",
      color: "#BE123C",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 8,
    },
    instruction: {
      fontSize: 14,
      color: theme.textMuted,
      fontStyle: "italic",
      marginBottom: 16,
      lineHeight: 20,
    },
    prayBox: {
      borderRadius: 20,
      padding: 24,
      backgroundColor: theme.surface,
      marginBottom: 24,
    },
    prayText: { fontSize: 17, color: theme.text, lineHeight: 30 },
    repeatBadge: {
      alignSelf: "flex-start",
      backgroundColor: "#BE123C",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginBottom: 12,
    },
    repeatText: { color: "#fff", fontSize: 12, fontWeight: "700" },
    navRow: { flexDirection: "row", gap: 12 },
    navBtn: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
    },
    navLabel: { fontSize: 15, fontWeight: "700", color: "#fff" },
  });

  const advance = () => {
    if (isLast) {
      recordPrayer();
      router.back();
    } else {
      setStepIdx((i) => i + 1);
    }
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
        <Text style={s.topTitle}>🕊️ Divine Mercy Chaplet</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Progress */}
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={s.progressLbl}>
        {stepIdx + 1} / {STEPS.length}
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        <Text style={s.stepLabel}>{step.label}</Text>
        <Text style={s.instruction}>{step.instruction}</Text>

        {step.repeat && (
          <View style={s.repeatBadge}>
            <Text style={s.repeatText}>× {step.repeat}</Text>
          </View>
        )}

        <View style={s.prayBox}>
          <Text style={s.prayText}>{step.prayer}</Text>
        </View>

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
            style={[s.navBtn, { backgroundColor: "#BE123C" }]}
            onPress={advance}
          >
            <Text style={s.navLabel}>
              {isLast ? "✅ Finish Chaplet" : "Next →"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
