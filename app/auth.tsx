import { supabase } from "@/lib/supabase";
import { isGoogleSigninAvailable, useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Seasonal solid background colors
const SEASON_BG: Record<string, string> = {
  advent: "#1A0A2E",
  christmas: "#1A1A2E",
  ordinary_time: "#0A1F0A",
  lent: "#1E0A3C",
  holy_week: "#1A0000",
  easter: "#FFFBEB",
  pentecost: "#1A0000",
};

// Seasonal accent colors (for glow & text)
const SEASON_ACCENT: Record<string, string> = {
  advent: "#A855F7",
  christmas: "#F59E0B",
  ordinary_time: "#22C55E",
  lent: "#7C3AED",
  holy_week: "#EF4444",
  easter: "#D97706",
  pentecost: "#DC2626",
};

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID =
  "1021355009817-19erk4ct538k29gmhfav6ir16256k2ik.apps.googleusercontent.com";

export default function AuthScreen() {
  const { theme, liturgicalDay } = useThemeStore();
  const { signInWithGoogle, signInGuest, loading, error, clearError } =
    useAuthStore();
  const router = useRouter();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    androidClientId: GOOGLE_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
    scopes: ["profile", "email"],
    redirectUri: "https://auth.expo.io/@alto/sanctify",
  });

  const googleAvailable = isGoogleSigninAvailable();

  const season = liturgicalDay.season;
  const bgColor = SEASON_BG[season] ?? "#0A0A1A";
  const accentColor = SEASON_ACCENT[season] ?? theme.primary;
  const isLightSeason = season === "easter";

  // Animations
  const crossScale = useRef(new Animated.Value(0.6)).current;
  const crossOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.8)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entry animation sequence
    Animated.sequence([
      // Cross appears
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
        Animated.spring(glowScale, {
          toValue: 1,
          tension: 50,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),
      // Title fades in
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Buttons fade in
      Animated.timing(btnOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1.15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("Sign In Error", error, [
        { text: "OK", onPress: clearError },
      ]);
    }
  }, [error]);

  useEffect(() => {
    const processGoogleResponse = async () => {
      if (response?.type === "success") {
        const idToken = response.authentication?.idToken;
        if (!idToken) {
          Alert.alert("Sign In Error", "Google did not return an ID token.");
          return;
        }

        try {
          const { data, error: authError } =
            await supabase.auth.signInWithIdToken({
              provider: "google",
              token: idToken,
            });

          if (authError) throw authError;

          // Rehydrate state after success
          await useAuthStore.getState().hydrate();
          router.replace("/(tabs)" as never);
        } catch (e: any) {
          Alert.alert("Sign In Error", e?.message ?? "Google sign in failed.");
        }
      }
    };

    processGoogleResponse();
  }, [response]);

  const handleGoogle = async () => {
    if (googleAvailable) {
      await signInWithGoogle();
    } else if (request) {
      await promptAsync();
    } else {
      Alert.alert(
        "Google sign in unavailable",
        "Please try again in a moment.",
      );
    }
  };

  const handleGuest = () => {
    signInGuest();
    router.replace("/(tabs)" as never);
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: bgColor },
    safe: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 60,
    },
    topSection: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 0,
    },
    glowOuter: { justifyContent: "center", alignItems: "center" },
    glow: {
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: accentColor,
      opacity: 0.12,
      position: "absolute",
    },
    glowMid: {
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: accentColor,
      opacity: 0.1,
      position: "absolute",
    },
    crossWrap: {
      width: 140,
      height: 140,
      justifyContent: "center",
      alignItems: "center",
    },
    crossImg: { width: 120, height: 120, tintColor: "#FFFFFF" },
    // If no image, show a fallback cross icon
    crossFallback: { opacity: 1 },
    titleBlock: { alignItems: "center", gap: 6, marginTop: 28 },
    appName: {
      fontSize: 42,
      fontWeight: "900",
      letterSpacing: 3,
      color: "#FFFFFF",
      textShadowColor: accentColor,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 20,
    },
    tagline: {
      fontSize: 15,
      color: "rgba(255,255,255,0.6)",
      letterSpacing: 1,
      fontStyle: "italic",
    },
    seasonPill: {
      marginTop: 12,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: accentColor + "60",
      backgroundColor: accentColor + "18",
    },
    seasonText: {
      fontSize: 13,
      fontWeight: "700",
      color: accentColor,
      letterSpacing: 1,
    },
    bottomSection: { width: "100%", paddingHorizontal: 32, gap: 14 },
    googleBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      borderRadius: 16,
      paddingVertical: 16,
      backgroundColor: "#FFFFFF",
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
    googleLbl: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
    guestBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 16,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
      backgroundColor: "rgba(255,255,255,0.06)",
    },
    guestLbl: {
      fontSize: 15,
      fontWeight: "600",
      color: "rgba(255,255,255,0.7)",
    },
    disclaimer: {
      fontSize: 11,
      color: "rgba(255,255,255,0.3)",
      textAlign: "center",
      lineHeight: 18,
    },
  });

  return (
    <View style={s.container}>
      <SafeAreaView style={s.safe}>
        {/* ── Top: Cross + Title ── */}
        <View style={s.topSection}>
          {/* Glow rings behind cross */}
          <Animated.View
            style={[s.glowOuter, { transform: [{ scale: glowPulse }] }]}
          >
            <Animated.View
              style={[s.glow, { transform: [{ scale: glowScale }] }]}
            />
            <Animated.View
              style={[s.glowMid, { transform: [{ scale: glowScale }] }]}
            />

            {/* Cross */}
            <Animated.View
              style={[
                s.crossWrap,
                { opacity: crossOpacity, transform: [{ scale: crossScale }] },
              ]}
            >
              {/* 
                Place your cross image at assets/cross.png
                The tintColor makes it white regardless of the original color
              */}
              <Image
                source={require("../assets/images/logo.png")}
                style={s.crossImg}
                resizeMode="contain"
              />
            </Animated.View>
          </Animated.View>

          {/* App name + tagline */}
          <Animated.View style={[s.titleBlock, { opacity: titleOpacity }]}>
            <Text style={s.appName}>Sanctify</Text>
            <Text style={s.tagline}>A Catholic Companion</Text>
            <View style={s.seasonPill}>
              <Text style={s.seasonText}>
                {theme.emoji} {liturgicalDay.seasonLabel.toUpperCase()}
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* ── Bottom: Auth buttons ── */}
        <Animated.View style={[s.bottomSection, { opacity: btnOpacity }]}>
          {/* Google Sign In */}
          <TouchableOpacity
            style={s.googleBtn}
            onPress={handleGoogle}
            disabled={loading || (!googleAvailable && !request)}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#1A1A1A" />
            ) : (
              <>
                {/* Google G logo using text — replace with an SVG if preferred */}
                <Text
                  style={{ fontSize: 20, fontWeight: "900", color: "#4285F4" }}
                >
                  G
                </Text>
                <Text style={s.googleLbl}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>
          {!googleAvailable && (
            <Text style={[s.disclaimer, { color: "#FFD700", marginTop: 8 }]}>
              Google native sign-in is unavailable in Expo Go. Install the dev
              client to use Google sign-in, or continue as guest.
            </Text>
          )}

          {/* Guest / Skip */}
          <TouchableOpacity
            style={s.guestBtn}
            onPress={handleGuest}
            disabled={loading}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons
              name="account-outline"
              size={18}
              color="rgba(255,255,255,0.6)"
            />
            <Text style={s.guestLbl}>Continue as Guest</Text>
          </TouchableOpacity>

          <Text style={s.disclaimer}>
            By continuing, you agree to our Terms of Service.{"\n"}
            Your data is stored privately and never sold.
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
