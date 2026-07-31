import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useLevel } from "@/context/LevelContext";
import { useIAP } from "@/context/IAPContext";
import { LEVEL_PACKS, FREE_LEVEL_TARGETS, LEVEL_ACTIONS } from "@/data/levelActions";

const FREE_LEVEL_NAMES: Record<1 | 2, string> = {
  1: "Desk Rookie",
  2: "Corridor Cadet",
};

export default function LevelsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { maxAccessibleLevel } = useLevel();
  const { isLevelOwned, buyLevel, purchasing } = useIAP();

  // Which owned pack's exercise list is currently open in the modal, if any.
  const [detailLevel, setDetailLevel] = useState<3 | 4 | 5 | null>(null);

  const handleUnlock = async (level: 3 | 4 | 5) => {
    try {
      await buyLevel(level);
    } catch (e: any) {
      Alert.alert("Purchase failed", e?.message ?? "Please try again.");
    }
  };

  const detailPack = detailLevel ? LEVEL_PACKS[detailLevel] : null;
  const detailActions = detailLevel
    ? LEVEL_ACTIONS.filter((a) => a.packLevel === detailLevel)
    : [];

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

            const CardWrapper = owned ? TouchableOpacity : View;
            const wrapperProps = owned
              ? { activeOpacity: 0.7, onPress: () => setDetailLevel(level) }
              : {};

            return (
              <CardWrapper
                key={level}
                {...wrapperProps}
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
                  <View style={styles.ownedRight}>
                    <View style={[styles.ownedPill, { backgroundColor: pack.dimColor }]}>
                      <Text style={[styles.ownedText, { color: pack.color }]}>Owned</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
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
              </CardWrapper>
            );
          })}
        </View>
      </ScrollView>

      {/* Exercise detail modal — opens when tapping an owned pack */}
      <Modal
        visible={detailLevel !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDetailLevel(null)}
      >
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
          <TouchableOpacity
            onPress={() => setDetailLevel(null)}
            style={[styles.modalClose, { backgroundColor: colors.card }]}
          >
            <Ionicons name="close" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingHorizontal: 20 }}
          >
            {detailPack && (
              <View style={styles.modalHeader}>
                <View style={[styles.modalEmojiWrap, { backgroundColor: detailPack.dimColor }]}>
                  <Text style={{ fontSize: 34 }}>{detailPack.emoji}</Text>
                </View>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>{detailPack.name}</Text>
                <Text style={[styles.modalSubtitle, { color: detailPack.color }]}>
                  {detailPack.dailyCalorieTarget} kcal/day target
                </Text>
              </View>
            )}

            <Text style={[styles.modalSectionLabel, { color: colors.mutedForeground }]}>
              EXERCISES AT THIS LEVEL
            </Text>

            <View style={{ gap: 10 }}>
              {detailActions.map((action) => (
                <View
                  key={action.id}
                  style={[styles.actionRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <Text style={{ fontSize: 22 }}>{action.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <View style={styles.actionTopRow}>
                      <Text style={[styles.actionName, { color: colors.foreground }]}>{action.name}</Text>
                      <Text style={[styles.actionKcal, { color: detailPack?.color ?? colors.foreground }]}>
                        {action.kcal} kcal
                      </Text>
                    </View>
                    <Text style={[styles.actionDesc, { color: colors.mutedForeground }]}>
                      {action.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  ownedRight: { alignItems: "flex-end", gap: 6 },
  ownedPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  ownedText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  unlockPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, minWidth: 64, alignItems: "center" },
  unlockPillText: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#000" },

  modal: { flex: 1, paddingTop: 12 },
  modalHandle: { width: 40, height: 5, borderRadius: 3, alignSelf: "center", marginBottom: 8 },
  modalClose: {
    position: "absolute",
    top: 16,
    right: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  modalHeader: { alignItems: "center", marginTop: 24, marginBottom: 28 },
  modalEmojiWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  modalTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  modalSubtitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 4 },
  modalSectionLabel: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 1.5, marginBottom: 10 },
  actionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  actionTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  actionName: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold" },
  actionKcal: { fontSize: 13, fontFamily: "Inter_700Bold" },
  actionDesc: { fontSize: 12.5, fontFamily: "Inter_400Regular", lineHeight: 17, marginTop: 4 },
});
