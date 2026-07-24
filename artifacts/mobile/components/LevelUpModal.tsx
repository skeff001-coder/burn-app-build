import React from "react";
import { View, Text, Modal, Pressable, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useLevel } from "@/context/LevelContext";
import { useIAP } from "@/context/IAPContext";
import { LEVEL_PACKS, LEVEL_ACTIONS } from "@/data/levelActions";

export function LevelUpModal() {
  const colors = useColors();
  const { unlockedLevel, nextLevel, showLevelUpPrompt, dismissLevelUpPrompt } = useLevel();
  const { buyLevel, restore, purchasing } = useIAP();

  if (!showLevelUpPrompt || !nextLevel || nextLevel < 3) return null;

  const pack = LEVEL_PACKS[nextLevel as 3 | 4 | 5];
  const isPurchasing = purchasing === pack.productId;

  const handleUnlock = async () => {
    try {
      await buyLevel(nextLevel as 3 | 4 | 5);
    } catch (e: any) {
      Alert.alert("Purchase failed", e?.message ?? "Please try again.");
    }
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
    <Modal visible={showLevelUpPrompt} transparent animationType="slide" onRequestClose={dismissLevelUpPrompt}>
      <Pressable style={styles.overlay} onPress={dismissLevelUpPrompt}>
        <Pressable style={[styles.sheet, { backgroundColor: colors.card }]} onPress={() => {}}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={[styles.badge, { backgroundColor: colors.neatGreenDim }]}>
            <Ionicons name="checkmark-circle" size={16} color={colors.neatGreen} />
            <Text style={[styles.badgeText, { color: colors.neatGreen }]}>
              Level {unlockedLevel} daily target hit! 🎉
            </Text>
          </View>

          <View style={styles.packHeader}>
            <Text style={styles.packEmoji}>{pack.emoji}</Text>
            <View style={styles.packInfo}>
              <Text style={[styles.packName, { color: colors.foreground }]}>
                Level {nextLevel} — {pack.name}
              </Text>
              <Text style={[styles.packTagline, { color: colors.mutedForeground }]}>{pack.tagline}</Text>
            </View>
            <View style={[styles.pricePill, { backgroundColor: pack.dimColor }]}>
              <Text style={[styles.priceText, { color: pack.color }]}>{pack.price}</Text>
            </View>
          </View>

          <View style={[styles.targetRow, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Ionicons name="flag-outline" size={14} color={colors.mutedForeground} />
            <Text style={[styles.targetText, { color: colors.mutedForeground }]}>
              Daily target upgrades to{" "}
              <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>
                {pack.dailyCalorieTarget} kcal
              </Text>
            </Text>
          </View>

          <View style={[styles.mysteryBox, { backgroundColor: pack.dimColor, borderColor: pack.color + "40" }]}>
            <Ionicons name="lock-closed" size={20} color={pack.color} />
            <Text style={[styles.mysteryText, { color: pack.color }]}>
              {LEVEL_ACTIONS.filter((a) => a.packLevel === nextLevel).length} moves waiting for you.
              {"\n"}Unlock to reveal them.
            </Text>
          </View>

          <Pressable
            onPress={handleUnlock}
            disabled={!!purchasing}
            style={({ pressed }) => [
              styles.unlockBtn,
              { backgroundColor: pack.color, opacity: pressed || !!purchasing ? 0.7 : 1 },
            ]}
          >
            <Ionicons name={isPurchasing ? "hourglass-outline" : "lock-open-outline"} size={18} color="#000" />
            <Text style={styles.unlockBtnText}>
              {isPurchasing ? "Processing…" : `Unlock Level ${nextLevel} for ${pack.price}`}
            </Text>
          </Pressable>

          <Pressable onPress={handleRestore} style={styles.restoreBtn}>
            <Text style={[styles.restoreText, { color: colors.mutedForeground }]}>Restore purchases</Text>
          </Pressable>

          <Pressable onPress={dismissLevelUpPrompt} disabled={!!purchasing} style={styles.laterBtn}>
            <Text style={[styles.laterText, { color: colors.mutedForeground }]}>Maybe later</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, gap: 16 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 4 },
  badge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, alignSelf: "flex-start" },
  badgeText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  packHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  packEmoji: { fontSize: 32 },
  packInfo: { flex: 1, gap: 3 },
  packName: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  packTagline: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  pricePill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, flexShrink: 0 },
  priceText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  targetRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 11, borderRadius: 10, borderWidth: 1 },
  targetText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  mysteryBox: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 14, borderWidth: 1 },
  mysteryText: { fontSize: 15, fontFamily: "Inter_700Bold", flex: 1, lineHeight: 22 },
  unlockBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 16 },
  unlockBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#000" },
  restoreBtn: { alignItems: "center", paddingVertical: 2 },
  restoreText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  laterBtn: { alignItems: "center", paddingVertical: 4 },
  laterText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
