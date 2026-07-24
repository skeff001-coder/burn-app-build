import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { useLevel } from "@/context/LevelContext";
import { LEVEL_ACTIONS } from "@/data/levelActions";

const GAUGE_SIZE = 168;
const STROKE = 10;
const RADIUS = (GAUGE_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function BurnGauge({ pct, kcal }: { pct: number; kcal: number }) {
  const colors = useColors();
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

  return (
    <View style={{ width: GAUGE_SIZE, height: GAUGE_SIZE, alignSelf: "center" }}>
      <Svg width={GAUGE_SIZE} height={GAUGE_SIZE}>
        <Circle
          cx={GAUGE_SIZE / 2}
          cy={GAUGE_SIZE / 2}
          r={RADIUS}
          stroke={colors.border}
          strokeWidth={STROKE}
          fill="none"
        />
        <Circle
          cx={GAUGE_SIZE / 2}
          cy={GAUGE_SIZE / 2}
          r={RADIUS}
          stroke={colors.neatGreen}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={offset}
          fill="none"
          rotation={-90}
          origin={`${GAUGE_SIZE / 2}, ${GAUGE_SIZE / 2}`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.gaugeCenter}>
          <Text style={[styles.gaugeKcal, { color: colors.foreground }]}>{kcal}</Text>
          <Text style={[styles.gaugeLabel, { color: colors.mutedForeground }]}>kcal burned today</Text>
        </View>
      </View>
    </View>
  );
}

export default function TodayScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { todayCalories, streak, logAction, loggedActionIds } = useApp();
  const { maxAccessibleLevel, nextLevel } = useLevel();

  const availableActions = useMemo(
    () => LEVEL_ACTIONS.filter((a) => a.packLevel <= maxAccessibleLevel).slice(0, 8),
    [maxAccessibleLevel],
  );

  // Rough target just for the gauge fill — the real target logic lives in LevelContext.
  const target = maxAccessibleLevel <= 2 ? 180 : 250 + (maxAccessibleLevel - 3) * 100;
  const pct = (todayCalories / target) * 100;

  const handleLog = (action: (typeof LEVEL_ACTIONS)[number]) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logAction(action);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32, paddingHorizontal: 20 }}
      >
        <Text style={[styles.eyebrow, { color: colors.orange }]}>EFFORTLESS BURN</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {nextLevel ? `You're building toward Level ${nextLevel}.` : "You've unlocked every level."}
        </Text>

        <View style={[styles.gaugeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <BurnGauge pct={pct} kcal={todayCalories} />
          <View style={styles.streakRow}>
            <Ionicons name="flame" size={14} color={colors.orange} />
            <Text style={[styles.streakText, { color: colors.mutedForeground }]}>{streak}-day streak</Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>LOG AN EXERCISE SNACK</Text>
        <View style={{ gap: 10 }}>
          {availableActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={() => handleLog(action)}
              activeOpacity={0.8}
              style={[styles.actionRow, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={styles.actionEmoji}>{action.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionName, { color: colors.foreground }]}>{action.name}</Text>
                <Text style={[styles.actionKcal, { color: colors.mutedForeground }]}>+{action.kcal} kcal</Text>
              </View>
              <View style={[styles.addBtn, { backgroundColor: colors.neatGreenDim }]}>
                <Ionicons name="add" size={18} color={colors.neatGreen} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  eyebrow: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 3 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", marginTop: 6, letterSpacing: -0.3 },
  gaugeCard: { borderRadius: 24, borderWidth: 1, padding: 24, marginTop: 20, alignItems: "center" },
  gaugeCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  gaugeKcal: { fontSize: 30, fontFamily: "Inter_700Bold" },
  gaugeLabel: { fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 0.3, marginTop: 2 },
  streakRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14 },
  streakText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1.5, marginTop: 28, marginBottom: 12 },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12 },
  actionEmoji: { fontSize: 20 },
  actionName: { fontSize: 14, fontFamily: "Inter_500Medium" },
  actionKcal: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  addBtn: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
});
