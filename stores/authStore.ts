import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "../lib/supabase";

// 🔁 Replace with your Web Client ID from Google Cloud Console
const GOOGLE_WEB_CLIENT_ID =
  "1021355009817-19erk4ct538k29gmhfav6ir16256k2ik.apps.googleusercontent.com";

function getGoogleSignin() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const {
      GoogleSignin,
    } = require("@react-native-google-signin/google-signin");
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      scopes: ["profile", "email"],
    });
    return GoogleSignin;
  } catch (e) {
    console.warn("GoogleSignin is not available in this runtime:", e);
    return null;
  }
}

export const isGoogleSigninAvailable = () => getGoogleSignin() !== null;

interface AuthStore {
  session: Session | null;
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  error: string | null;

  hydrate: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInGuest: () => void;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  session: null,
  user: null,
  isGuest: false,
  loading: false,
  error: null,

  hydrate: async () => {
    set({ loading: true });
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      set({ session, user: session?.user ?? null });

      // Listen for auth state changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null });
      });
    } catch (e) {
      console.warn("Auth hydration error:", e);
    } finally {
      set({ loading: false });
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const GoogleSignin = getGoogleSignin();
      if (!GoogleSignin) {
        throw new Error(
          "Google Sign-In is not available in this runtime. Use a development build or configure a web-based sign in flow.",
        );
      }

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) throw new Error("No ID token returned from Google.");

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });

      if (error) throw error;
      set({ session: data.session, user: data.user, isGuest: false });
    } catch (e: any) {
      const msg = e?.message ?? "Google Sign-In failed. Please try again.";
      set({ error: msg });
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      const GoogleSignin = getGoogleSignin();
      if (GoogleSignin) {
        await GoogleSignin.signOut();
      }
      await supabase.auth.signOut();
      set({ session: null, user: null, isGuest: false });
    } catch (e) {
      console.warn("Sign out error:", e);
    } finally {
      set({ loading: false });
    }
  },

  signInGuest: () => {
    set({ session: null, user: null, isGuest: true });
  },

  clearError: () => set({ error: null }),
}));
