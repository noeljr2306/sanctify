import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "@/stores/themeStore";

interface APlace {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  openingHours?: string;
}

// Search for adoration chapels & catholic chapels via OSM
async function fetchAdoration(lat: number, lng: number): Promise<APlace[]> {
  const query = `
    [out:json][timeout:30];
    (
      node["amenity"="place_of_worship"]["religion"="christian"]["denomination"="catholic"]["name"~"adoration|chapel|eucharist",i](around:20000,${lat},${lng});
      way["amenity"="place_of_worship"]["religion"="christian"]["denomination"="catholic"]["name"~"adoration|chapel|eucharist",i](around:20000,${lat},${lng});
      node["amenity"="place_of_worship"]["religion"="christian"]["denomination"="catholic"](around:15000,${lat},${lng});
      way["amenity"="place_of_worship"]["religion"="christian"]["denomination"="catholic"](around:15000,${lat},${lng});
    );
    out center 30;
  `;
  const res = await fetch(
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
  );
  const data = await res.json();
  return (data.elements ?? [])
    .map((el: any) => {
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;
      if (!elLat || !elLng) return null;
      return {
        id: String(el.id),
        name: el.tags?.name ?? "Catholic Chapel",
        latitude: elLat,
        longitude: elLng,
        address:
          [el.tags?.["addr:street"], el.tags?.["addr:city"]]
            .filter(Boolean)
            .join(", ") || "Address unavailable",
        openingHours: el.tags?.opening_hours,
      };
    })
    .filter(Boolean) as APlace[];
}

const ADORATION_GUIDE = [
  {
    emoji: "🕯️",
    step: "Arrive & Settle",
    desc: "Enter quietly. Genuflect before the Blessed Sacrament. Find a comfortable place to kneel or sit.",
  },
  {
    emoji: "📖",
    step: "Open with Scripture",
    desc: "Read a short passage slowly. Let the words sink in before the Lord.",
  },
  {
    emoji: "🤫",
    step: "Silent Prayer",
    desc: "Simply be present. Don't feel pressured to speak. Rest in God's presence.",
  },
  {
    emoji: "🙏",
    step: "Intercession",
    desc: "Bring your intentions and those of others before Jesus in the Eucharist.",
  },
  {
    emoji: "✝️",
    step: "Act of Consecration",
    desc: "Offer yourself to Jesus through Mary. Ask for grace to live this day well.",
  },
  {
    emoji: "🕊️",
    step: "Close in Gratitude",
    desc: "Thank God for the gift of His presence. Leave with peace.",
  },
];

export default function AdorationScreen() {
  const { theme } = useThemeStore();
  const router = useRouter();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [places, setPlaces] = useState<APlace[]>([]);
  const [selected, setSelected] = useState<APlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"map" | "guide">("map");

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission denied.");
          setLoading(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        const { latitude: lat, longitude: lng } = loc.coords;
        setLocation({ lat, lng });
        const results = await fetchAdoration(lat, lng);
        setPlaces(results);
      } catch {
        setError("Could not fetch adoration chapels.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openDirections = (p: APlace) => {
    const url =
      Platform.OS === "ios"
        ? `maps://?daddr=${p.latitude},${p.longitude}`
        : `geo:${p.latitude},${p.longitude}?q=${encodeURIComponent(p.name)}`;
    Linking.openURL(url);
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
    toggleRow: {
      flexDirection: "row",
      marginHorizontal: 16,
      marginBottom: 8,
      gap: 8,
    },
    toggleBtn: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 10,
      alignItems: "center",
    },
    toggleLbl: { fontSize: 13, fontWeight: "700" },
    map: { flex: 1 },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
      padding: 20,
    },
    errorText: { color: theme.textMuted, textAlign: "center" },
    card: {
      position: "absolute",
      bottom: 24,
      left: 16,
      right: 16,
      borderRadius: 18,
      padding: 18,
      backgroundColor: theme.surface,
      gap: 6,
      elevation: 8,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    },
    cardName: { fontSize: 16, fontWeight: "700", color: theme.text },
    cardAddr: { fontSize: 13, color: theme.textMuted },
    dirBtn: {
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: "center",
      backgroundColor: "#B45309",
      marginTop: 8,
    },
    dirBtnLbl: { color: "#fff", fontWeight: "700", fontSize: 13 },
    scroll: { padding: 20, paddingBottom: 40, gap: 14 },
    guideCard: {
      borderRadius: 16,
      padding: 18,
      backgroundColor: theme.surface,
      flexDirection: "row",
      gap: 14,
      alignItems: "flex-start",
    },
    guideEmoji: { fontSize: 28, marginTop: 2 },
    guideStep: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 4,
    },
    guideDesc: { fontSize: 14, color: theme.textMuted, lineHeight: 22 },
    quoteBox: {
      borderRadius: 16,
      padding: 20,
      backgroundColor: "#B4530922",
      gap: 6,
    },
    quoteText: {
      fontSize: 16,
      color: theme.text,
      fontStyle: "italic",
      lineHeight: 26,
    },
    quoteRef: { fontSize: 13, color: theme.textMuted },
  });

  if (loading)
    return (
      <SafeAreaView style={[s.safe, s.center]}>
        <ActivityIndicator size="large" color="#B45309" />
        <Text style={s.errorText}>Finding Adoration chapels...</Text>
      </SafeAreaView>
    );

  if (error || !location)
    return (
      <SafeAreaView style={[s.safe, s.center]}>
        <Text style={{ fontSize: 40 }}>🕯️</Text>
        <Text style={s.errorText}>{error ?? "Location unavailable."}</Text>
      </SafeAreaView>
    );

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
        <Text style={s.topTitle}>🕯️ Adoration Finder</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={s.toggleRow}>
        {(["map", "guide"] as const).map((v) => (
          <TouchableOpacity
            key={v}
            style={[
              s.toggleBtn,
              { backgroundColor: tab === v ? "#B45309" : theme.surface },
            ]}
            onPress={() => setTab(v)}
          >
            <Text
              style={[
                s.toggleLbl,
                { color: tab === v ? "#fff" : theme.textMuted },
              ]}
            >
              {v === "map" ? `🗺️ Map (${places.length})` : "📖 How to Adore"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* MAP */}
      {tab === "map" && (
        <View style={{ flex: 1 }}>
          <MapView
            style={s.map}
            initialRegion={{
              latitude: location.lat,
              longitude: location.lng,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            onPress={() => setSelected(null)}
          >
            <UrlTile
              urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
            />
            <Marker
              coordinate={{ latitude: location.lat, longitude: location.lng }}
            >
              <View
                style={{
                  backgroundColor: "#B45309",
                  borderRadius: 20,
                  padding: 6,
                }}
              >
                <MaterialCommunityIcons name="account" size={16} color="#fff" />
              </View>
            </Marker>
            {places.map((p) => (
              <Marker
                key={p.id}
                coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                onPress={() => setSelected(p)}
              >
                <View
                  style={{
                    backgroundColor:
                      selected?.id === p.id ? "#B45309" : "#92400E",
                    borderRadius: 20,
                    padding: 6,
                  }}
                >
                  <MaterialCommunityIcons
                    name="candle"
                    size={16}
                    color="#fff"
                  />
                </View>
              </Marker>
            ))}
          </MapView>
          {selected && (
            <View style={s.card}>
              <Text style={s.cardName}>🕯️ {selected.name}</Text>
              <Text style={s.cardAddr}>{selected.address}</Text>
              {selected.openingHours && (
                <Text style={{ fontSize: 12, color: theme.textMuted }}>
                  🕐 {selected.openingHours}
                </Text>
              )}
              <TouchableOpacity
                style={s.dirBtn}
                onPress={() => openDirections(selected)}
              >
                <Text style={s.dirBtnLbl}>📍 Get Directions</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* GUIDE */}
      {tab === "guide" && (
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.quoteBox}>
            <Text style={s.quoteText}>
              &apos;The Eucharist is the secret of my day. It gives strength and
              meaning to all my activities of service to the Church and to the
              whole world.&apos;
            </Text>
            <Text style={s.quoteRef}>— St. John Paul II</Text>
          </View>
          {ADORATION_GUIDE.map((g, i) => (
            <View key={i} style={s.guideCard}>
              <Text style={s.guideEmoji}>{g.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.guideStep}>
                  {i + 1}. {g.step}
                </Text>
                <Text style={s.guideDesc}>{g.desc}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
