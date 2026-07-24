import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useIAP } from "@/context/IAPContext";

// Update these with the real live App Store links when available.
const SISTER_LINKS = [
  {
    key: "whatsupdog",
    name: "What's Up Dog!",
    tagline: "Our sister app for dog breed heritage",
    icon: "paw-outline" as const,
    color: "#86EFAC",
    url: "https://apps.apple.com/app/id6771118261",
  },
  {
    key: "byte2eat",
    name: "Byte 2 Eat",
    tagline: "Our sister app for fridge-to-recipe scanning",
    icon: "restaurant-outline" as const,
    color: "#FF6B2B",
    url: "https://apps.apple.com/app/id6772287626",
  },
  {
    key: "onjjem",
    name: "ONJJEM",
    tagline: "Our sister company for personalised photo gifts",
    icon: "gift-outline" as const,
    color: "#C9A24B",
    url: "https://onjjem.com",
  },
];

export default function MoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { restore } = useIAP();

  const openLink = async (url: string) => {
    const ok = await Linking.canOpenURL(url);
    if (ok) Linking.openURL(url);
  };

  const handleRestore = async () => {
    try {
      await restore();
      Alert.alert("Purchases restored", "Any previous unlocks have been restored.");
    } catch {
      Alert.alert("Nothing to restore", "No previous purchases were found.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32, paddingHorizontal: 20 }}
      >
        <Text style={[styles.eyebrow, { color: colors.orange }]}>MORE</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Settings</Text>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>OUR OTHER APPS &amp; COMPANY</Text>
        <View style={{ gap: 10 }}>
          {SISTER_LINKS.map((s) => (
            <TouchableOpacity
              key={s.key}
              onPress={() => openLink(s.url)}
              activeOpacity={0.8}
              style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.iconWrap, { backgroundColor: s.color + "22" }]}>
                <Ionicons name={s.icon} size={17} color={s.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowName, { color: colors.foreground }]}>{s.name}</Text>
                <Text style={[styles.rowTagline, { color: colors.mutedForeground }]}>{s.tagline}</Text>
              </View>
              <Ionicons name="open-outline" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: 28 }]}>PURCHASES</Text>
        <TouchableOpacity
          onPress={handleRestore}
          style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={[styles.rowName, { color: colors.foreground }]}>Restore purchases</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  eyebrow: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 3 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", marginTop: 6, letterSpacing: -0.3 },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1.5, marginTop: 24, marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 13 },
  iconWrap: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  rowName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  rowTagline: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
});
