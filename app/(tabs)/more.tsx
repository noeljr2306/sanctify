import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "@/stores/themeStore";

export default function MoreScreen() {
  const { theme } = useThemeStore();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 40 }}>⚙️</Text>
      <Text
        style={{
          color: theme.text,
          fontSize: 20,
          fontWeight: "700",
          marginTop: 8,
        }}
      >
        More
      </Text>
      <Text style={{ color: theme.textMuted, marginTop: 4 }}>
        Settings & More coming soon
      </Text>
    </SafeAreaView>
  );
}
