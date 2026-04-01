import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";

const SEASON_BG: Record<string, string> = {
  advent: "#1A0A2E",
  christmas: "#1A1A2E",
  ordinary_time: "#0A1F0A",
  lent: "#1E0A3C",
  holy_week: "#1A0000",
  easter: "#1A1500",
  pentecost: "#1A0000",
};

const SEASON_ACCENT: Record<string, string> = {
  advent: "#A855F7",
  christmas: "#F59E0B",
  ordinary_time: "#22C55E",
  lent: "#7C3AED",
  holy_week: "#EF4444",
  easter: "#D97706",
  pentecost: "#DC2626",
};

type AuthMode = "welcome" | "signin" | "signup";

export default function AuthScreen() {
  const { theme, liturgicalDay } = useThemeStore();
  const { signIn, signUp, loading, error, clearError } = useAuthStore();
  const router = useRouter();

  const { height: screenHeight } = useWindowDimensions();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardOpen(true),
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardOpen(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  const bgColor = SEASON_BG[liturgicalDay.season] ?? "#0A0A1A";
  const accent = SEASON_ACCENT[liturgicalDay.season] ?? theme.primary;

  const [mode, setMode] = useState<AuthMode>("welcome");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Entry animations
  const crossScale = useRef(new Animated.Value(0.6)).current;
  const crossOpacity = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(1)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(crossScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(crossOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1.12,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  // Animate form in when mode changes
  useEffect(() => {
    if (mode !== "welcome") {
      formOpacity.setValue(0);
      formY.setValue(24);
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(formY, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [mode]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error]);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Please fill in all fields.");
      return;
    }
    await signIn(email, password);
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Password must be at least 6 characters.");
      return;
    }
    await signUp(email, password, fullName);
  };

  const handleGuest = () => router.replace("/(tabs)" as never);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: bgColor },
    safe: { flex: 1 },
    scroll: { flexGrow: 1, justifyContent: "space-between" },

    // ── Logo section ──
    logoSection: { alignItems: "center", paddingTop: 64, paddingBottom: 32 },
    glowOuter: {
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    glow: {
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: accent,
      opacity: 0.1,
      position: "absolute",
    },
    glowInner: {
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: accent,
      opacity: 0.1,
      position: "absolute",
    },
    crossWrap: {
      width: 120,
      height: 120,
      justifyContent: "center",
      alignItems: "center",
    },
    crossImg: { width: 100, height: 100, tintColor: "#FFFFFF" },
    appName: {
      fontSize: 38,
      fontWeight: "900",
      color: "#fff",
      letterSpacing: 3,
      textShadowColor: accent,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 16,
    },
    tagline: {
      fontSize: 14,
      color: "rgba(255,255,255,0.55)",
      letterSpacing: 1,
      fontStyle: "italic",
      marginTop: 4,
    },
    seasonPill: {
      marginTop: 10,
      paddingHorizontal: 14,
      paddingVertical: 5,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: accent + "55",
      backgroundColor: accent + "18",
    },
    seasonText: {
      fontSize: 12,
      fontWeight: "700",
      color: accent,
      letterSpacing: 1,
    },

    // ── Welcome buttons ──
    welcomeSection: { padding: 28, gap: 12 },
    primaryBtn: {
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
      backgroundColor: accent,
    },
    primaryLbl: { fontSize: 16, fontWeight: "800", color: "#fff" },
    secondaryBtn: {
      borderRadius: 16,
      paddingVertical: 15,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
      backgroundColor: "rgba(255,255,255,0.05)",
    },
    secondaryLbl: {
      fontSize: 15,
      fontWeight: "600",
      color: "rgba(255,255,255,0.7)",
    },
    guestBtn: { alignItems: "center", paddingVertical: 10 },
    guestLbl: { fontSize: 14, color: "rgba(255,255,255,0.4)" },

    // ── Form ──
    formSection: { padding: 24, paddingTop: 0, gap: 14 },
    formTitle: {
      fontSize: 24,
      fontWeight: "900",
      color: "#fff",
      marginBottom: 4,
    },
    formSub: { fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 8 },
    inputWrap: {
      borderRadius: 14,
      backgroundColor: "rgba(255,255,255,0.08)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
    },
    input: { flex: 1, paddingVertical: 14, fontSize: 15, color: "#fff" },
    submitBtn: {
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 4,
    },
    submitLbl: { fontSize: 16, fontWeight: "800", color: "#fff" },
    switchRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
      marginTop: 4,
    },
    switchText: { fontSize: 14, color: "rgba(255,255,255,0.5)" },
    switchLink: { fontSize: 14, fontWeight: "700", color: accent },
    backBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingBottom: 8,
    },
    backLbl: { fontSize: 14, color: "rgba(255,255,255,0.5)" },
    divider: {
      height: 1,
      backgroundColor: "rgba(255,255,255,0.08)",
      marginVertical: 4,
    },
  });

  return (
    <View style={s.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "android" ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={s.safe}>
            <ScrollView
              contentContainerStyle={s.scroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {/* ── Logo ── */}
              <View
                style={[
                  s.logoSection,
                  keyboardOpen && { paddingTop: 24, paddingBottom: 12 },
                ]}
              >
                <Animated.View
                  style={[s.glowOuter, { transform: [{ scale: glowPulse }] }]}
                >
                  <View style={s.glow} />
                  <View style={s.glowInner} />
                  <Animated.View
                    style={[
                      s.crossWrap,
                      {
                        opacity: crossOpacity,
                        transform: [{ scale: crossScale }],
                      },
                      keyboardOpen && { width: 70, height: 70 },
                    ]}
                  >
                    <Image
                      source={require("../assets/images/logo.png")}
                      style={[
                        s.crossImg,
                        keyboardOpen && { width: 60, height: 60 },
                      ]}
                      resizeMode="contain"
                    />
                  </Animated.View>
                </Animated.View>
                {!keyboardOpen && (
                  <>
                    <Text style={s.appName}>Sanctify</Text>
                    <Text style={s.tagline}>A Catholic Companion</Text>
                    <View style={s.seasonPill}>
                      <Text style={s.seasonText}>
                        {theme.emoji} {liturgicalDay.seasonLabel.toUpperCase()}
                      </Text>
                    </View>
                  </>
                )}
                {keyboardOpen && (
                  <Text style={[s.appName, { fontSize: 26 }]}>Sanctify</Text>
                )}
              </View>

              {/* ── Welcome Mode ── */}
              {mode === "welcome" && (
                <View style={s.welcomeSection}>
                  <TouchableOpacity
                    style={s.primaryBtn}
                    onPress={() => setMode("signup")}
                  >
                    <Text style={s.primaryLbl}>Create Account</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={s.secondaryBtn}
                    onPress={() => setMode("signin")}
                  >
                    <Text style={s.secondaryLbl}>Sign In</Text>
                  </TouchableOpacity>
                  <View style={s.divider} />
                  <TouchableOpacity style={s.guestBtn} onPress={handleGuest}>
                    <Text style={s.guestLbl}>Continue as Guest</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* ── Sign In Mode ── */}
              {mode === "signin" && (
                <Animated.View
                  style={[
                    s.formSection,
                    {
                      opacity: formOpacity,
                      transform: [{ translateY: formY }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={s.backBtn}
                    onPress={() => setMode("welcome")}
                  >
                    <MaterialCommunityIcons
                      name="arrow-left"
                      size={18}
                      color="rgba(255,255,255,0.5)"
                    />
                    <Text style={s.backLbl}>Back</Text>
                  </TouchableOpacity>

                  <Text style={s.formTitle}>Welcome back 🙏</Text>
                  <Text style={s.formSub}>
                    Sign in to continue your faith journey.
                  </Text>

                  <View style={s.inputWrap}>
                    <MaterialCommunityIcons
                      name="email-outline"
                      size={18}
                      color="rgba(255,255,255,0.4)"
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      style={s.input}
                      placeholder="Email address"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  <View style={s.inputWrap}>
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={18}
                      color="rgba(255,255,255,0.4)"
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      style={s.input}
                      placeholder="Password"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPass}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowPass((v) => !v)}>
                      <MaterialCommunityIcons
                        name={showPass ? "eye-off" : "eye"}
                        size={18}
                        color="rgba(255,255,255,0.4)"
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[s.submitBtn, { backgroundColor: accent }]}
                    onPress={handleSignIn}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={s.submitLbl}>Sign In</Text>
                    )}
                  </TouchableOpacity>

                  <View style={s.switchRow}>
                    <Text style={s.switchText}>Don&apos;t have an account?</Text>
                    <TouchableOpacity onPress={() => setMode("signup")}>
                      <Text style={s.switchLink}>Create one</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              )}

              {/* ── Sign Up Mode ── */}
              {mode === "signup" && (
                <Animated.View
                  style={[
                    s.formSection,
                    {
                      opacity: formOpacity,
                      transform: [{ translateY: formY }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={s.backBtn}
                    onPress={() => setMode("welcome")}
                  >
                    <MaterialCommunityIcons
                      name="arrow-left"
                      size={18}
                      color="rgba(255,255,255,0.5)"
                    />
                    <Text style={s.backLbl}>Back</Text>
                  </TouchableOpacity>

                  <Text style={s.formTitle}>Join Sanctify ✝️</Text>
                  <Text style={s.formSub}>
                    Create your free account to begin.
                  </Text>

                  <View style={s.inputWrap}>
                    <MaterialCommunityIcons
                      name="account-outline"
                      size={18}
                      color="rgba(255,255,255,0.4)"
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      style={s.input}
                      placeholder="Full name"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={s.inputWrap}>
                    <MaterialCommunityIcons
                      name="email-outline"
                      size={18}
                      color="rgba(255,255,255,0.4)"
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      style={s.input}
                      placeholder="Email address"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  <View style={s.inputWrap}>
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={18}
                      color="rgba(255,255,255,0.4)"
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      style={s.input}
                      placeholder="Password (min 6 characters)"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPass}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowPass((v) => !v)}>
                      <MaterialCommunityIcons
                        name={showPass ? "eye-off" : "eye"}
                        size={18}
                        color="rgba(255,255,255,0.4)"
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[s.submitBtn, { backgroundColor: accent }]}
                    onPress={handleSignUp}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={s.submitLbl}>Create Account</Text>
                    )}
                  </TouchableOpacity>

                  <View style={s.switchRow}>
                    <Text style={s.switchText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => setMode("signin")}>
                      <Text style={s.switchLink}>Sign in</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              )}
            </ScrollView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
