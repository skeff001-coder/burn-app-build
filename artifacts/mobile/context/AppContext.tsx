import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NeatAction } from "@/data/levelActions";

// Kept from the original build so existing installs don't lose their
// streak/history on this rebuild — do not change this key.
const STORAGE_KEY = "@bitesize_move_v2";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export interface DaySnapshot {
  date: string;
  kcal: number;
}

interface StoredState {
  date: string;
  todayCalories: number;
  loggedActionIds: string[];
  streak: number;
  historyDays: DaySnapshot[];
}

interface AppContextValue {
  todayCalories: number;
  loggedActionIds: string[];
  streak: number;
  historyDays: DaySnapshot[];
  logAction: (action: NeatAction) => void;
  isLoaded: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

function defaultState(): StoredState {
  return { date: todayKey(), todayCalories: 0, loggedActionIds: [], streak: 0, historyDays: [] };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoredState>(defaultState());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      let loaded = defaultState();
      if (data) {
        try {
          loaded = { ...defaultState(), ...JSON.parse(data) };
        } catch {}
      }
      setState(rollForwardIfNeeded(loaded));
      setIsLoaded(true);
    });
  }, []);

  // If the app was closed over a day boundary, archive yesterday's total,
  // update the streak, and reset today's counter.
  function rollForwardIfNeeded(prev: StoredState): StoredState {
    const today = todayKey();
    if (prev.date === today) return prev;

    const wasActiveYesterday = prev.date === yesterdayKey() && prev.todayCalories > 0;
    const nextStreak = wasActiveYesterday ? prev.streak + 1 : prev.todayCalories > 0 ? 1 : 0;

    const nextHistory = [...prev.historyDays, { date: prev.date, kcal: prev.todayCalories }].slice(-30);

    return {
      date: today,
      todayCalories: 0,
      loggedActionIds: [],
      streak: nextStreak,
      historyDays: nextHistory,
    };
  }

  const persist = useCallback((next: StoredState) => {
    setState(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const logAction = useCallback(
    (action: NeatAction) => {
      setState((prev) => {
        const rolled = rollForwardIfNeeded(prev);
        const next: StoredState = {
          ...rolled,
          todayCalories: rolled.todayCalories + action.kcal,
          loggedActionIds: [...rolled.loggedActionIds, action.id],
        };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  return (
    <AppContext.Provider
      value={{
        todayCalories: state.todayCalories,
        loggedActionIds: state.loggedActionIds,
        streak: state.streak,
        historyDays: state.historyDays,
        logAction,
        isLoaded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
