import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthStore {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;

  hydrate: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  user: null,
  loading: false,
  error: null,

  hydrate: async () => {
    set({ loading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, user: session?.user ?? null });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null });
      });
    } catch (e) {
      console.warn("Auth hydration error:", e);
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password, fullName) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });
      if (error) throw error;
      set({ session: data.session, user: data.user });
    } catch (e: any) {
      set({ error: e?.message ?? "Sign up failed. Please try again." });
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      set({ session: data.session, user: data.user });
    } catch (e: any) {
      set({ error: e?.message ?? "Sign in failed. Please check your credentials." });
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await supabase.auth.signOut();
      set({ session: null, user: null });
    } catch (e) {
      console.warn("Sign out error:", e);
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));