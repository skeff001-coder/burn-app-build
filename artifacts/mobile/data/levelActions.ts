import colors from "@/constants/colors";

export type UnlockLevel = 1 | 2 | 3 | 4 | 5;

export interface LevelPack {
  productId: string;
  name: string;
  tagline: string;
  emoji: string;
  price: string;
  color: string;
  dimColor: string;
  dailyCalorieTarget: number;
}

// Product IDs match what's configured in App Store Connect — do not change
// these without also updating the products there, or purchases will fail.
export const LEVEL_PACKS: Record<3 | 4 | 5, LevelPack> = {
  3: {
    productId: "com.effortlessburn.app.active",
    name: "Active Pack",
    tagline: "More movement, bigger burns",
    emoji: "🔥",
    price: "£1.99",
    color: colors.neatGreen,
    dimColor: colors.neatGreenDim,
    dailyCalorieTarget: 250,
  },
  4: {
    productId: "com.effortlessburn.app.fitness",
    name: "Fitness Pack",
    tagline: "Structured cardio snacks",
    emoji: "⚡",
    price: "£2.99",
    color: colors.orange,
    dimColor: colors.orangeDim,
    dailyCalorieTarget: 350,
  },
  5: {
    productId: "com.effortlessburn.app.gladiator",
    name: "Gladiator Pack",
    tagline: "The full Desk Dungeon",
    emoji: "🏆",
    price: "£4.99",
    color: "#C9A24B",
    dimColor: "#C9A24B22",
    dailyCalorieTarget: 500,
  },
};

export const FREE_LEVEL_TARGETS: Record<1 | 2, number> = {
  1: 100,
  2: 180,
};

export interface NeatAction {
  id: string;
  name: string;
  emoji: string;
  kcal: number;
  packLevel: UnlockLevel;
}

// Levels 1–2 are free. Levels 3–5 are revealed only after unlocking the
// matching pack in LEVEL_PACKS — keep packLevel in sync with that table.
export const LEVEL_ACTIONS: NeatAction[] = [
  // Level 1 — free
  { id: "stairs", name: "Take the stairs", emoji: "🪜", kcal: 12, packLevel: 1 },
  { id: "pace_calls", name: "Pace during calls", emoji: "📞", kcal: 18, packLevel: 1 },
  { id: "desk_stretch", name: "Stand desk stretch", emoji: "🧍", kcal: 8, packLevel: 1 },
  { id: "walk_kettle", name: "Walk to boil the kettle", emoji: "☕", kcal: 6, packLevel: 1 },
  { id: "park_further", name: "Park further away", emoji: "🚗", kcal: 15, packLevel: 1 },

  // Level 2 — free
  { id: "carry_shopping", name: "Carry the shopping", emoji: "🛍️", kcal: 22, packLevel: 2 },
  { id: "vacuum", name: "Vacuum a room", emoji: "🧹", kcal: 28, packLevel: 2 },
  { id: "window_squats", name: "Squats while brushing teeth", emoji: "🦷", kcal: 10, packLevel: 2 },
  { id: "dog_walk_extra", name: "Extra lap on the dog walk", emoji: "🐕", kcal: 35, packLevel: 2 },
  { id: "garden_tidy", name: "10 minutes of gardening", emoji: "🌱", kcal: 30, packLevel: 2 },

  // Level 3 — Active Pack
  { id: "brisk_walk", name: "15-minute brisk walk", emoji: "🚶", kcal: 70, packLevel: 3 },
  { id: "stair_sprints", name: "Stair sprints ×5", emoji: "🏃", kcal: 45, packLevel: 3 },
  { id: "cleaning_circuit", name: "Full room cleaning circuit", emoji: "🧽", kcal: 55, packLevel: 3 },
  { id: "bike_errand", name: "Cycle instead of drive", emoji: "🚲", kcal: 90, packLevel: 3 },

  // Level 4 — Fitness Pack
  { id: "hiit_snack", name: "5-minute HIIT snack", emoji: "💥", kcal: 60, packLevel: 4 },
  { id: "jump_rope", name: "Jump rope ×2 minutes", emoji: "🪢", kcal: 35, packLevel: 4 },
  { id: "hill_walk", name: "Hill or incline walk", emoji: "⛰️", kcal: 100, packLevel: 4 },
  { id: "desk_burpees", name: "Desk burpee break", emoji: "🤸", kcal: 40, packLevel: 4 },

  // Level 5 — Gladiator Pack
  { id: "full_workout", name: "20-minute bodyweight workout", emoji: "🏋️", kcal: 160, packLevel: 5 },
  { id: "stair_marathon", name: "10-floor stair marathon", emoji: "🏢", kcal: 130, packLevel: 5 },
  { id: "sprint_intervals", name: "Sprint intervals ×6", emoji: "🔥", kcal: 110, packLevel: 5 },
];
