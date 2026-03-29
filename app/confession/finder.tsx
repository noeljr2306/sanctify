import { useThemeStore } from "@/stores/themeStore";
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

interface Parish {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

// Uses Overpass API — completely free, no key needed
async function fetchNearbyParishes(
  lat: number,
  lng: number,
): Promise<Parish[]> {
  const radius = 8000; // 8km
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="place_of_worship"]["religion"="christian"]["denomination"="catholic"](around:${radius},${lat},${lng});
      way["amenity"="place_of_worship"]["religion"="christian"]["denomination"="catholic"](around:${radius},${lat},${lng});
    );
    out center 20;
  `;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();

  return (data.elements ?? [])
    .map((el: any) => {
      const lat = el.lat ?? el.center?.lat;
      const lng = el.lon ?? el.center?.lon;
      if (!lat || !lng) return null;
      return {
        id: String(el.id),
        name: el.tags?.name ?? "Catholic Church",
        latitude: lat,
        longitude: lng,
        address:
          [
            el.tags?.["addr:housenumber"],
            el.tags?.["addr:street"],
            el.tags?.["addr:city"],
          ]
            .filter(Boolean)
            .join(" ") || "Address unavailable",
      };
    })
    .filter(Boolean) as Parish[];
}

export default function ConfessionFinderScreen() {
  const { theme } = useThemeStore();
  const router = useRouter();

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [selected, setSelected] = useState<Parish | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"map" | "list">("map");

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission denied. Please enable it in Settings.");
          setLoading(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        const { latitude: lat, longitude: lng } = loc.coords;
        setLocation({ lat, lng });
        const results = await fetchNearbyParishes(lat, lng);
        setParishes(results);
      } catch {
        setError(
          "Could not fetch nearby parishes. Please check your connection.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openDirections = (parish: Parish) => {
    const url =
      Platform.OS === "ios"
        ? `maps://?daddr=${parish.latitude},${parish.longitude}`
        : `geo:${parish.latitude},${parish.longitude}?q=${encodeURIComponent(parish.name)}`;
    Linking.openURL(url);
  };

  const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    topBar: { flexDirection: "row", alignItems: "center", padding: 16, gap: 8 },
    backBtn: { padding: 4 },
    topTitle: {
      flex: 1,
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
    },
    toggleRow: {
      flexDirection: "row",
      marginHorizontal: 20,
      marginBottom: 8,
      gap: 8,
    },
    toggleBtn: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 10,
      alignItems: "center",
    },
    toggleLabel: { fontSize: 13, fontWeight: "700" },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
      padding: 20,
    },
    errorText: { color: theme.textMuted, textAlign: "center", lineHeight: 22 },
    map: { flex: 1 },
    card: {
      position: "absolute",
      bottom: 24,
      left: 16,
      right: 16,
      borderRadius: 18,
      padding: 18,
      backgroundColor: theme.surface,
      gap: 6,
    },
    cardName: { fontSize: 16, fontWeight: "700", color: theme.text },
    cardAddr: { fontSize: 13, color: theme.textMuted },
    dirBtn: {
      marginTop: 8,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: "center",
      backgroundColor: theme.primary,
    },
    dirBtnLabel: { color: "#fff", fontWeight: "700", fontSize: 14 },
    listScroll: { padding: 16, gap: 10, paddingBottom: 40 },
    listItem: {
      borderRadius: 16,
      padding: 16,
      backgroundColor: theme.surface,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    listName: { fontSize: 15, fontWeight: "700", color: theme.text },
    listAddr: { fontSize: 13, color: theme.textMuted, marginTop: 2 },
    emptyText: { color: theme.textMuted, textAlign: "center", marginTop: 40 },
  });

  if (loading) {
    return (
      <SafeAreaView style={[s.safe, s.center]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={s.errorText}>Finding nearby Catholic churches...</Text>
      </SafeAreaView>
    );
  }

  if (error || !location) {
    return (
      <SafeAreaView style={[s.safe, s.center]}>
        <Text style={{ fontSize: 40 }}>📍</Text>
        <Text style={s.errorText}>{error ?? "Location unavailable."}</Text>
      </SafeAreaView>
    );
  }

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
        <Text style={s.topTitle}>Find Confession ({parishes.length})</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Map / List toggle */}
      <View style={s.toggleRow}>
        {(["map", "list"] as const).map((v) => (
          <TouchableOpacity
            key={v}
            style={[
              s.toggleBtn,
              { backgroundColor: view === v ? theme.primary : theme.surface },
            ]}
            onPress={() => setView(v)}
          >
            <Text
              style={[
                s.toggleLabel,
                { color: view === v ? "#fff" : theme.textMuted },
              ]}
            >
              {v === "map" ? "🗺️ Map" : "📋 List"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* MAP VIEW */}
      {view === "map" && (
        <View style={{ flex: 1 }}>
          <MapView
            style={s.map}
            initialRegion={{
              latitude: location.lat,
              longitude: location.lng,
              latitudeDelta: 0.07,
              longitudeDelta: 0.07,
            }}
          >
            {/* Free OpenStreetMap tiles — no API key needed */}
            <UrlTile
              urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
            />

            {/* User marker */}
            <Marker
              coordinate={{ latitude: location.lat, longitude: location.lng }}
            >
              <View
                style={{
                  backgroundColor: theme.primary,
                  borderRadius: 20,
                  padding: 6,
                }}
              >
                <MaterialCommunityIcons name="account" size={16} color="#fff" />
              </View>
            </Marker>

            {/* Church markers */}
            {parishes.map((p) => (
              <Marker
                key={p.id}
                coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                onPress={() => setSelected(p)}
              >
                <View
                  style={{
                    backgroundColor:
                      selected?.id === p.id ? theme.primary : "#7C3AED",
                    borderRadius: 20,
                    padding: 6,
                  }}
                >
                  <MaterialCommunityIcons name="cross" size={16} color="#fff" />
                </View>
              </Marker>
            ))}
          </MapView>

          {/* Selected parish card */}
          {selected && (
            <View style={s.card}>
              <Text style={s.cardName}>⛪ {selected.name}</Text>
              <Text style={s.cardAddr}>{selected.address}</Text>
              <TouchableOpacity
                style={s.dirBtn}
                onPress={() => openDirections(selected)}
              >
                <Text style={s.dirBtnLabel}>📍 Get Directions</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* LIST VIEW */}
      {view === "list" && (
        <ScrollView
          contentContainerStyle={s.listScroll}
          showsVerticalScrollIndicator={false}
        >
          {parishes.length === 0 ? (
            <Text style={s.emptyText}>No Catholic churches found nearby.</Text>
          ) : (
            parishes.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={s.listItem}
                onPress={() => openDirections(p)}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: "#7C3AED22",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="cross"
                    size={22}
                    color="#7C3AED"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.listName}>{p.name}</Text>
                  <Text style={s.listAddr}>{p.address}</Text>
                </View>
                <MaterialCommunityIcons
                  name="directions"
                  size={22}
                  color={theme.primary}
                />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
