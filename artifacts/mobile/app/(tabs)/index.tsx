import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Share } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { useLevel } from "@/context/LevelContext";
import { LEVEL_ACTIONS } from "@/data/levelActions";

const GAUGE_SIZE = 176;
const STROKE = 11;
const RADIUS = (GAUGE_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function BurnGauge({ pct, kcal, smashed, color }: { pct: number; kcal: number; smashed: boolean; color: string }) {
  const colors = useColors();
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

  return (
    <View style={{ width: GAUGE_SIZE, height: GAUGE_SIZE, alignSelf: "center" }}>
      <Svg width={GAUGE_SIZE} height={GAUGE_SIZE}>
        <Circle cx={GAUGE_SIZE / 2} cy={GAUGE_SIZE / 2} r={RADIUS} stroke={colors.border} strokeWidth={STROKE} fill="none" />
        <Circle
          cx={GAUGE_SIZE / 2}
          cy={GAUGE_SIZE / 2}
          r={RADIUS}
          stroke={color}
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
          {smashed && <Text style={styles.gaugeCrown}>🏆</Text>}
          <Text style={[styles.gaugeKcal, { color: colors.foreground }]}>{kcal}</Text>
          <Text style={[styles.gaugeLabel, { color: colors.mutedForeground }]}>
            {smashed ? "target smashed!" : "kcal burned today"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

function WeeklyChart({ historyDays, todayCalories }: { historyDays: { date: string; kcal: number }[]; todayCalories: number }) {
  const colors = useColors();

  const days = useMemo(() => {
    const result: { label: string; kcal: number; isToday: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const isToday = i === 0;
      const found = historyDays.find((h) => h.date === key);
      result.push({
        label: DAY_LETTERS[d.getDay()],
        kcal: isToday ? todayCalories : found?.kcal ?? 0,
        isToday,
      });
    }
    return result;
  }, [historyDays, todayCalories]);

  const max = Math.max(...days.map((d) => d.kcal), 100);

  return (
    <View style={styles.weekRow}>
      {days.map((d, i) => {
        const height = Math.max(6, (d.kcal / max) * 64);
        return (
          <View key={i} style={styles.weekCol}>
            <View style={styles.weekBarTrack}>
              <View
                style={[
                  styles.weekBarFill,
                  {
                    height,
                    backgroundColor: d.isToday ? colors.orange : colors.neatGreen,
                    opacity: d.kcal > 0 ? 1 : 0.25,
                  },
                ]}
              />
            </View>
            <Text style={[styles.weekLabel, { color: d.isToday ? colors.orange : colors.mutedForeground }]}>
              {d.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function TodayScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { todayCalories, streak, logAction, loggedActionIds, historyDays } = useApp();
  const { maxAccessibleLevel, nextLevel } = useLevel();

  const [justLoggedId, setJustLoggedId] = useState<string | null>(null);

  const availableActions = useMemo(
    () => LEVEL_ACTIONS.filter((a) => a.packLevel <= maxAccessibleLevel).slice(0, 12),
    [maxAccessibleLevel],
  );

  // Today's wins — every distinct action logged today, with how many times.
  const todaysWins = useMemo(() => {
    const counts = new Map<string, number>();
    loggedActionIds.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1));
    return Array.from(counts.entries())
      .map(([id, count]) => {
        const action = LEVEL_ACTIONS.find((a) => a.id === id);
        return action ? { action, count } : null;
      })
      .filter((x): x is { action: (typeof LEVEL_ACTIONS)[number]; count: number } => x !== null)
      .reverse();
  }, [loggedActionIds]);

  // Rough target just for the gauge fill — the real target logic lives in LevelContext.
  const target = maxAccessibleLevel <= 2 ? 180 : 250 + (maxAccessibleLevel - 3) * 100;
  const pct = (todayCalories / target) * 100;
  const smashed = todayCalories >= target;
  const gaugeColor = smashed ? "#C9A24B" : colors.neatGreen;

  const handleLog = (action: (typeof LEVEL_ACTIONS)[number]) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logAction(action);
    setJustLoggedId(action.id);
    setTimeout(() => setJustLoggedId((current) => (current === action.id ? null : current)), 900);
  };

  const handleShare = async () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const streakLine = streak > 1 ? ` and I'm on a ${streak}-day streak` : "";
    try {
      await Share.share({
        message: `Just burned ${todayCalories} kcal today without setting foot in a gym${streakLine} 🔥 Effortless Burn turns everyday movement into real results.`,
      });
    } catch {}
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32, paddingHorizontal: 20 }}
      >
        <Text style={[styles.eyebrow, { color: colors.orange }]}>EFFORTLESS BURN</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {smashed
            ? "Today's target: smashed. 🏆"
            : nextLevel
            ? `You're building toward Level ${nextLevel}.`
            : "You've unlocked every level."}
        </Text>

        <View style={[styles.gaugeCard, { backgroundColor: colors.card, borderColor: smashed ? gaugeColor : colors.border, borderWidth: smashed ? 2 : 1 }]}>
          <BurnGauge pct={pct} kcal={todayCalories} smashed={smashed} color={gaugeColor} />
          <View style={styles.streakRow}>
            <Ionicons name="flame" size={14} color={colors.orange} />
            <Text style={[styles.streakText, { color: colors.mutedForeground }]}>{streak}-day streak</Text>
          </View>

          <TouchableOpacity
            onPress={handleShare}
            activeOpacity={0.85}
            style={[styles.shareBtn, { backgroundColor: colors.orange }]}
          >
            <Ionicons name="share-social-outline" size={16} color="#0a0e1a" />
            <Text style={styles.shareBtnText}>Share your burn</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>THIS WEEK</Text>
        <View style={[styles.weekCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <WeeklyChart historyDays={historyDays} todayCalories={todayCalories} />
        </View>

        {todaysWins.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>TODAY'S WINS</Text>
            <View style={{ gap: 8, marginBottom: 4 }}>
              {todaysWins.map(({ action, count }) => (
                <View key={action.id} style={[styles.winRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={styles.actionEmoji}>{action.emoji}</Text>
                  <Text style={[styles.winName, { color: colors.foreground }]}>{action.name}</Text>
                  {count > 1 && (
                    <View style={[styles.winCountPill, { backgroundColor: colors.neatGreenDim }]}>
                      <Text style={[styles.winCountText, { color: colors.neatGreen }]}>×{count}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>LOG AN EXERCISE SNACK</Text>
        <View style={{ gap: 10 }}>
          {availableActions.map((action) => {
            const isJustLogged = justLoggedId === action.id;
            return (
              <TouchableOpacity
                key={action.id}
                onPress={() => handleLog(action)}
                activeOpacity={0.8}
                style={[
                  styles.actionRow,
                  {
                    backgroundColor: isJustLogged ? colors.neatGreenDim : colors.card,
                    borderColor: isJustLogged ? colors.neatGreen : colors.border,
                  },
                ]}
              >
                <Text style={styles.actionEmoji}>{action.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.actionName, { color: colors.foreground }]}>{action.name}</Text>
                  <Text style={[styles.actionKcal, { color: colors.mutedForeground }]}>+{action.kcal} kcal</Text>
                </View>
                <View style={[styles.addBtn, { backgroundColor: isJustLogged ? colors.neatGreen : colors.neatGreenDim }]}>
                  <Ionicons
                    name={isJustLogged ? "checkmark" : "add"}
                    size={18}
                    color={isJustLogged ? "#0a0e1a" : colors.neatGreen}
                  />
                </View>
              </TouchableOpacity>
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

  gaugeCard: { borderRadius: 24, borderWidth: 1, padding: 24, marginTop: 20, alignItems: "center" },
  gaugeCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  gaugeCrown: { fontSize: 20, marginBottom: 2 },
  gaugeKcal: { fontSize: 30, fontFamily: "Inter_700Bold" },
  gaugeLabel: { fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 0.3, marginTop: 2 },
  streakRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14 },
  streakText: { fontSize: 12, fontFamily: "Inter_500Medium" },

  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginTop: 16,
    alignSelf: "stretch",
  },
  shareBtnText: { fontSize: 13.5, fontFamily: "Inter_700Bold", color: "#0a0e1a" },

  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1.5, marginTop: 28, marginBottom: 12 },

  weekCard: { borderRadius: 18, borderWidth: 1, padding: 16 },
  weekRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  weekCol: { alignItems: "center", gap: 6, flex: 1 },
  weekBarTrack: { height: 64, justifyContent: "flex-end" },
  weekBarFill: { width: 16, borderRadius: 8 },
  weekLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold" },

  winRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  winName: { flex: 1, fontSize: 13.5, fontFamily: "Inter_500Medium" },
  winCountPill: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999 },
  winCountText: { fontSize: 11.5, fontFamily: "Inter_700Bold" },

  actionRow: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12 },
  actionEmoji: { fontSize: 20 },
  actionName: { fontSize: 14, fontFamily: "Inter_500Medium" },
  actionKcal: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  addBtn: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
});
