import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FREE_LEVEL_TARGETS, LEVEL_PACKS } from "@/data/levelActions";
import { useApp } from "@/context/AppContext";
import { useIAP } from "@/context/IAPContext";

export type UnlockLevel = 1 | 2 | 3 | 4 | 5;

const ACTIVE_LEVEL_KEY = "effortless-burn:active-level";

function targetFor(level: UnlockLevel): number {
  if (level === 1 || level === 2) return FREE_LEVEL_TARGETS[level];
  return LEVEL_PACKS[level].dailyCalorieTarget;
}

interface LevelContextValue {
  maxAccessibleLevel: UnlockLevel;
  activeLevel: UnlockLevel; // level the user chose to work on (<= maxAccessibleLevel)
  setActiveLevel: (level: UnlockLevel) => void;
  unlockedLevel: UnlockLevel | null; // level whose target was hit today
  nextLevel: UnlockLevel | null; // next paid level available to buy
  showLevelUpPrompt: boolean;
  dismissLevelUpPrompt: () => void;
}

const LevelContext = createContext<LevelContextValue | null>(null);

export function LevelProvider({ children }: { children: React.ReactNode }) {
  const { todayCalories } = useApp();
  const { isLevelOwned } = useIAP();
  const [dismissedForDate, setDismissedForDate] = useState<string | null>(null);

  // Highest level reachable in sequence — paid levels only count if every
  // level below them (3, then 4) has also been bought.
  const maxAccessibleLevel: UnlockLevel = useMemo(() => {
    let level: UnlockLevel = 2;
    if (isLevelOwned(3)) level = 3;
    if (level === 3 && isLevelOwned(4)) level = 4;
    if (level === 4 && isLevelOwned(5)) level = 5;
    return level;
  }, [isLevelOwned]);

  const [selectedLevel, setSelectedLevel] = useState<UnlockLevel | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ACTIVE_LEVEL_KEY).then((v) => {
      const n = Number(v);
      if (n >= 1 && n <= 5) setSelectedLevel(n as UnlockLevel);
    });
  }, []);

  const activeLevel: UnlockLevel =
    selectedLevel !== null && selectedLevel <= maxAccessibleLevel ? selectedLevel : maxAccessibleLevel;

  const setActiveLevel = useCallback((level: UnlockLevel) => {
    setSelectedLevel(level);
    AsyncStorage.setItem(ACTIVE_LEVEL_KEY, String(level)).catch(() => {});
  }, []);

  const nextLevel: UnlockLevel | null = maxAccessibleLevel < 5 ? ((maxAccessibleLevel + 1) as UnlockLevel) : null;

  const hitTargetToday = todayCalories >= targetFor(maxAccessibleLevel);
  const unlockedLevel: UnlockLevel | null = hitTargetToday ? maxAccessibleLevel : null;

  const todayKey = new Date().toISOString().slice(0, 10);
  const alreadyDismissedToday = dismissedForDate === todayKey;

  const showLevelUpPrompt =
    hitTargetToday &&
    nextLevel !== null &&
    !isLevelOwned(nextLevel as 3 | 4 | 5) &&
    !alreadyDismissedToday;

  const dismissLevelUpPrompt = () => setDismissedForDate(todayKey);

  return (
    <LevelContext.Provider
      value={{ maxAccessibleLevel, activeLevel, setActiveLevel, unlockedLevel, nextLevel, showLevelUpPrompt, dismissLevelUpPrompt }}
    >
      {children}
    </LevelContext.Provider>
  );
}

export function useLevel() {
  const ctx = useContext(LevelContext);
  if (!ctx) throw new Error("useLevel must be used within LevelProvider");
  return ctx;
}
