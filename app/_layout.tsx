import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { useThemeStore } from "../stores/themeStore";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { theme, liturgicalDay, refresh } = useThemeStore();

  useEffect(() => {
    refresh(); // Refresh on app open
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

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={paperTheme}>
        <StatusBar style={theme.paperTheme === "dark" ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
    </QueryClientProvider>
  );
}
