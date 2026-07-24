import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useLevel } from "@/context/LevelContext";
import { useIAP } from "@/context/IAPContext";
import { LEVEL_PACKS, FREE_LEVEL_TARGETS } from "@/data/levelActions";

const FREE_LEVEL_NAMES: Record<1 | 2, string> = {
  1: "Desk Rookie",
  2: "Corridor Cadet",
};

export default function LevelsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { maxAccessibleLevel } = useLevel();
  const { isLevelOwned, buyLevel, purchasing } = useIAP();

  const handleUnlock = async (level: 3 | 4 | 5) => {
    try {
      await buyLevel(level);
    } catch (e: any) {
      Alert.alert("Purchase failed", e?.message ?? "Please try again.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32, paddingHorizontal: 20 }}
      >
        <Text style={[styles.eyebrow, { color: colors.orange }]}>DESK DUNGEON</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Your levels</Text>

        <View style={{ gap: 12, marginTop: 20 }}>
          {([1, 2] as const).map((level) => {
            const done = maxAccessibleLevel > level || maxAccessibleLevel === level;
            return (
              <View key={level} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.badgeCircle, { backgroundColor: colors.neatGreenDim }]}>
                  <Text style={[styles.badgeNum, { color: colors.neatGreen }]}>{level}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardName, { color: colors.foreground }]}>{FREE_LEVEL_NAMES[level]}</Text>
                  <Text style={[styles.cardMeta, { color: colors.mutedForeground }]}>
                    Free · {FREE_LEVEL_TARGETS[level]} kcal/day target
                  </Text>
                </View>
              </View>
            );
          })}

          {([3, 4, 5] as const).map((level) => {
            const pack = LEVEL_PACKS[level];
            const owned = isLevelOwned(level);
            const isPurchasing = purchasing === pack.productId;
            const locked = !owned && level > maxAccessibleLevel + 1;

            return (
              <View
                key={level}
                style={[
                  styles.card,
                  { backgroundColor: colors.card, borderColor: owned ? pack.color : colors.border, borderWidth: owned ? 2 : 1 },
                ]}
              >
                <View style={[styles.badgeCircle, { backgroundColor: pack.dimColor }]}>
                  <Text style={{ fontSize: 18 }}>{pack.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardName, { color: colors.foreground }]}>{pack.name}</Text>
                  <Text style={[styles.cardMeta, { color: colors.mutedForeground }]}>
                    {owned ? `Unlocked · ${pack.dailyCalorieTarget} kcal/day target` : pack.tagline}
                  </Text>
                </View>
                {owned ? (
                  <View style={[styles.ownedPill, { backgroundColor: pack.dimColor }]}>
                    <Text style={[styles.ownedText, { color: pack.color }]}>Owned</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleUnlock(level)}
                    disabled={locked || isPurchasing}
                    style={[styles.unlockPill, { backgroundColor: pack.color, opacity: locked ? 0.4 : 1 }]}
                  >
                    {isPurchasing ? (
                      <ActivityIndicator size="small" color="#000" />
                    ) : (
                      <Text style={styles.unlockPillText}>{pack.price}</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  eyebrow: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 3 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", marginTop: 6, letterSpacing: -0.3 },
  card: { flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 18, borderWidth: 1, padding: 14 },
  badgeCircle: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  badgeNum: { fontSize: 15, fontFamily: "Inter_700Bold" },
  cardName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  cardMeta: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  ownedPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  ownedText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  unlockPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, minWidth: 64, alignItems: "center" },
  unlockPillText: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#000" },
});
