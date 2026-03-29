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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "@/stores/themeStore";

interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  website?: string;
  openingHours?: string;
}

async function fetchPlaces(
  lat: number,
  lng: number,
  keyword: string,
): Promise<Place[]> {
  const query = `
    [out:json][timeout:30];
    (
      node["amenity"="place_of_worship"]["religion"="christian"]["denomination"="catholic"](around:10000,${lat},${lng});
      way["amenity"="place_of_worship"]["religion"="christian"]["denomination"="catholic"](around:10000,${lat},${lng});
    );
    out center 25;
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
        name: el.tags?.name ?? "Catholic Church",
        latitude: elLat,
        longitude: elLng,
        address:
          [
            el.tags?.["addr:housenumber"],
            el.tags?.["addr:street"],
            el.tags?.["addr:city"],
            el.tags?.["addr:state"],
          ]
            .filter(Boolean)
            .join(", ") || "Address unavailable",
        phone: el.tags?.phone,
        website: el.tags?.website,
        openingHours: el.tags?.opening_hours,
      };
    })
    .filter(Boolean) as Place[];
}

type ViewMode = "map" | "list";

export default function ParishFinderScreen() {
  const { theme } = useThemeStore();
  const router = useRouter();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [places, setPlaces] = useState<Place[]>([]);
  const [filtered, setFiltered] = useState<Place[]>([]);
  const [selected, setSelected] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [search, setSearch] = useState("");

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
        const results = await fetchPlaces(lat, lng, "catholic");
        setPlaces(results);
        setFiltered(results);
      } catch {
        setError("Could not fetch nearby parishes.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(places);
      return;
    }
    setFiltered(
      places.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.address.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, places]);

  const openDirections = (p: Place) => {
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
    searchBox: {
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: theme.surface,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    searchInput: { flex: 1, fontSize: 14, color: theme.text },
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
    errorText: { color: theme.textMuted, textAlign: "center", lineHeight: 22 },
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
    cardMeta: { fontSize: 12, color: theme.textMuted },
    cardBtns: { flexDirection: "row", gap: 8, marginTop: 8 },
    dirBtn: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: "center",
      backgroundColor: theme.primary,
    },
    webBtn: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: "center",
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    dirBtnLbl: { color: "#fff", fontWeight: "700", fontSize: 13 },
    webBtnLbl: { color: theme.primary, fontWeight: "700", fontSize: 13 },
    listScroll: { padding: 16, paddingBottom: 40 },
    listItem: {
      borderRadius: 16,
      padding: 16,
      backgroundColor: theme.surface,
      marginBottom: 10,
      flexDirection: "row",
      gap: 12,
      alignItems: "flex-start",
    },
    listName: { fontSize: 15, fontWeight: "700", color: theme.text },
    listAddr: { fontSize: 13, color: theme.textMuted, marginTop: 2 },
    listMeta: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
    countLbl: {
      fontSize: 12,
      color: theme.textMuted,
      textAlign: "center",
      marginBottom: 4,
    },
  });

  if (loading)
    return (
      <SafeAreaView style={[s.safe, s.center]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={s.errorText}>Finding nearby Catholic churches...</Text>
      </SafeAreaView>
    );

  if (error || !location)
    return (
      <SafeAreaView style={[s.safe, s.center]}>
        <Text style={{ fontSize: 40 }}>⛪</Text>
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
        <Text style={s.topTitle}>⛪ Parish Finder</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Search */}
      <View style={s.searchBox}>
        <MaterialCommunityIcons
          name="magnify"
          size={18}
          color={theme.textMuted}
        />
        <TextInput
          style={s.searchInput}
          placeholder="Search parishes..."
          placeholderTextColor={theme.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Toggle */}
      <View style={s.toggleRow}>
        {(["map", "list"] as ViewMode[]).map((v) => (
          <TouchableOpacity
            key={v}
            style={[
              s.toggleBtn,
              {
                backgroundColor: viewMode === v ? theme.primary : theme.surface,
              },
            ]}
            onPress={() => setViewMode(v)}
          >
            <Text
              style={[
                s.toggleLbl,
                { color: viewMode === v ? "#fff" : theme.textMuted },
              ]}
            >
              {v === "map" ? "🗺️ Map" : `📋 List (${filtered.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* MAP */}
      {viewMode === "map" && (
        <View style={{ flex: 1 }}>
          <MapView
            style={s.map}
            initialRegion={{
              latitude: location.lat,
              longitude: location.lng,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
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
                  backgroundColor: theme.primary,
                  borderRadius: 20,
                  padding: 6,
                }}
              >
                <MaterialCommunityIcons name="account" size={16} color="#fff" />
              </View>
            </Marker>
            {filtered.map((p) => (
              <Marker
                key={p.id}
                coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                onPress={() => setSelected(p)}
              >
                <View
                  style={{
                    backgroundColor:
                      selected?.id === p.id ? theme.primary : "#166534",
                    borderRadius: 20,
                    padding: 6,
                  }}
                >
                  <MaterialCommunityIcons
                    name="church"
                    size={16}
                    color="#fff"
                  />
                </View>
              </Marker>
            ))}
          </MapView>

          {selected && (
            <View style={s.card}>
              <Text style={s.cardName}>⛪ {selected.name}</Text>
              <Text style={s.cardAddr}>{selected.address}</Text>
              {selected.openingHours && (
                <Text style={s.cardMeta}>🕐 {selected.openingHours}</Text>
              )}
              <View style={s.cardBtns}>
                <TouchableOpacity
                  style={s.dirBtn}
                  onPress={() => openDirections(selected)}
                >
                  <Text style={s.dirBtnLbl}>📍 Directions</Text>
                </TouchableOpacity>
                {selected.website && (
                  <TouchableOpacity
                    style={s.webBtn}
                    onPress={() => Linking.openURL(selected.website!)}
                  >
                    <Text style={s.webBtnLbl}>🌐 Website</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      )}

      {/* LIST */}
      {viewMode === "list" && (
        <ScrollView
          contentContainerStyle={s.listScroll}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 ? (
            <Text style={[s.errorText, { marginTop: 40 }]}>
              No parishes found.
            </Text>
          ) : (
            filtered.map((p) => (
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
                    backgroundColor: "#16653422",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="church"
                    size={22}
                    color="#166534"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.listName}>{p.name}</Text>
                  <Text style={s.listAddr}>{p.address}</Text>
                  {p.phone && <Text style={s.listMeta}>📞 {p.phone}</Text>}
                  {p.openingHours && (
                    <Text style={s.listMeta}>🕐 {p.openingHours}</Text>
                  )}
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
