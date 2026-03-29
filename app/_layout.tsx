import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { theme, refresh } = useThemeStore();
  const { session, isGuest, hydrate } = useAuthStore();

  useEffect(() => {
    refresh();
    hydrate();
  }, []);

  const paperTheme =
    theme.paperTheme === "dark"
      ? {
          ...MD3DarkTheme,
          colors: {
            ...MD3DarkTheme.colors,
            primary: theme.primary,
            secondary: theme.secondary,
            background: theme.background,
            surface: theme.surface,
          },
        }
      : {
          ...MD3LightTheme,
          colors: {
            ...MD3LightTheme.colors,
            primary: theme.primary,
            secondary: theme.secondary,
            background: theme.background,
            surface: theme.surface,
          },
        };

  const segments = useSegments();
  const isOnAuth = segments[0] === "auth";
  const isOnTabs = segments[0] === "(tabs)";

  if (!session && !isGuest && !isOnAuth) {
    return <Redirect href="/auth" />;
  }

  if ((session || isGuest) && isOnAuth) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={paperTheme}>
        <StatusBar style={theme.paperTheme === "dark" ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" options={{ animation: "fade" }} />
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
        </Stack>
      </PaperProvider>
    </QueryClientProvider>
  );
}
