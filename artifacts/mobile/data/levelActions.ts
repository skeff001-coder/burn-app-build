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
    productId: "com.effortlessburn.pack.active",
    name: "Active Pack",
    tagline: "More movement, bigger burns",
    emoji: "🔥",
    price: "£0.99",
    color: colors.neatGreen,
    dimColor: colors.neatGreenDim,
    dailyCalorieTarget: 250,
  },
  4: {
    productId: "com.effortlessburn.pack.fitness",
    name: "Fitness Pack",
    tagline: "Structured cardio snacks",
    emoji: "⚡",
    price: "£1.49",
    color: colors.orange,
    dimColor: colors.orangeDim,
    dailyCalorieTarget: 350,
  },
  5: {
    productId: "com.effortlessburn.pack.gladiator",
    name: "Gladiator Pack",
    tagline: "The full Desk Dungeon",
    emoji: "🏆",
    price: "£1.99",
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
  description: string;
}

// Levels 1–2 are free. Levels 3–5 are revealed only after unlocking the
// matching pack in LEVEL_PACKS — keep packLevel in sync with that table.
export const LEVEL_ACTIONS: NeatAction[] = [
  // ────────────────────────────────────────────────────────────
  // Level 1 — free
  // ────────────────────────────────────────────────────────────
  {
    id: "stairs",
    name: "Take the stairs",
    emoji: "🪜",
    kcal: 12,
    packLevel: 1,
    description: "Works your quads, glutes and calves while gently raising your heart rate.",
  },
  {
    id: "pace_calls",
    name: "Pace during calls",
    emoji: "📞",
    kcal: 18,
    packLevel: 1,
    description: "Light, steady cardio that keeps your hip flexors and calves active instead of static.",
  },
  {
    id: "desk_stretch",
    name: "Stand desk stretch",
    emoji: "🧍",
    kcal: 8,
    packLevel: 1,
    description: "Loosens the spine, shoulders and hip flexors after long stretches of sitting.",
  },
  {
    id: "walk_kettle",
    name: "Walk to boil the kettle",
    emoji: "☕",
    kcal: 6,
    packLevel: 1,
    description: "A small burst of calf and glute activation that breaks up sitting time.",
  },
  {
    id: "park_further",
    name: "Park further away",
    emoji: "🚗",
    kcal: 15,
    packLevel: 1,
    description: "Builds up your daily walking volume and works your calves and glutes.",
  },
  {
    id: "calf_raises",
    name: "Calf raises at the sink ×20",
    emoji: "🦵",
    kcal: 14,
    packLevel: 1,
    description: "Strengthens the calves and improves ankle stability — great for balance.",
  },
  {
    id: "shoulder_rolls",
    name: "Shoulder rolls ×20",
    emoji: "🔄",
    kcal: 6,
    packLevel: 1,
    description: "Releases tension in the traps and rotator cuff built up from screen time.",
  },
  {
    id: "seated_marches",
    name: "Seated marching ×1 min",
    emoji: "🪑",
    kcal: 10,
    packLevel: 1,
    description: "Activates the hip flexors and core even while you stay seated.",
  },
  {
    id: "water_walk",
    name: "Walk to refill your water bottle",
    emoji: "🚰",
    kcal: 7,
    packLevel: 1,
    description: "An easy step-count boost with light glute and calf engagement.",
  },
  {
    id: "doorway_stretch",
    name: "Doorway chest stretch",
    emoji: "🚪",
    kcal: 5,
    packLevel: 1,
    description: "Opens up the chest and front shoulders, countering a hunched desk posture.",
  },

  // ────────────────────────────────────────────────────────────
  // Level 2 — free
  // ────────────────────────────────────────────────────────────
  {
    id: "carry_shopping",
    name: "Carry the shopping",
    emoji: "🛍️",
    kcal: 22,
    packLevel: 2,
    description: "Builds forearm and bicep strength, plus core stability from carrying an uneven load.",
  },
  {
    id: "vacuum",
    name: "Vacuum a room",
    emoji: "🧹",
    kcal: 28,
    packLevel: 2,
    description: "Engages your core, shoulders and legs through repeated pushing and reaching.",
  },
  {
    id: "window_squats",
    name: "Squats while brushing teeth",
    emoji: "🦷",
    kcal: 10,
    packLevel: 2,
    description: "Sneaks in quad and glute activation during a routine you do every day anyway.",
  },
  {
    id: "dog_walk_extra",
    name: "Extra lap on the dog walk",
    emoji: "🐕",
    kcal: 35,
    packLevel: 2,
    description: "Builds cardio endurance and leg strength with sustained low-impact walking.",
  },
  {
    id: "garden_tidy",
    name: "10 minutes of gardening",
    emoji: "🌱",
    kcal: 30,
    packLevel: 2,
    description: "Works the lower back, hamstrings and grip strength through bending and reaching.",
  },
  {
    id: "bag_carry_both",
    name: "Carry bags in both hands",
    emoji: "👜",
    kcal: 20,
    packLevel: 2,
    description: "A balanced load that builds grip strength and core stability on both sides.",
  },
  {
    id: "tiptoe_walk",
    name: "Walk on tiptoes for 30 seconds",
    emoji: "🩰",
    kcal: 12,
    packLevel: 2,
    description: "Strengthens the calves and sharpens balance and ankle control.",
  },
  {
    id: "stair_two_step",
    name: "Take stairs two at a time",
    emoji: "🪜",
    kcal: 26,
    packLevel: 2,
    description: "A bigger range of motion means more glute and quad activation than normal stairs.",
  },
  {
    id: "standing_desk_switch",
    name: "Switch to standing for an hour",
    emoji: "🧍‍♂️",
    kcal: 18,
    packLevel: 2,
    description: "Keeps your core and leg stabiliser muscles gently engaged instead of switched off.",
  },
  {
    id: "brisk_errand",
    name: "Brisk walk to a nearby shop",
    emoji: "🏪",
    kcal: 32,
    packLevel: 2,
    description: "Moderate cardio that builds walking endurance over a real-world errand.",
  },

  // ────────────────────────────────────────────────────────────
  // Level 3 — Active Pack
  // ────────────────────────────────────────────────────────────
  {
    id: "brisk_walk",
    name: "15-minute brisk walk",
    emoji: "🚶",
    kcal: 70,
    packLevel: 3,
    description: "Steady-state cardio that strengthens the heart and builds walking stamina.",
  },
  {
    id: "stair_sprints",
    name: "Stair sprints ×5",
    emoji: "🏃",
    kcal: 45,
    packLevel: 3,
    description: "Explosive power work for the quads, glutes and calves.",
  },
  {
    id: "cleaning_circuit",
    name: "Full room cleaning circuit",
    emoji: "🧽",
    kcal: 55,
    packLevel: 3,
    description: "Constant movement working the shoulders, core and legs in one go.",
  },
  {
    id: "bike_errand",
    name: "Cycle instead of drive",
    emoji: "🚲",
    kcal: 90,
    packLevel: 3,
    description: "Low-impact cardio that builds quad and glute endurance over distance.",
  },
  {
    id: "desk_squats",
    name: "Desk squats ×30",
    emoji: "🦵",
    kcal: 35,
    packLevel: 3,
    description: "Strengthens the quads and glutes and improves knee stability.",
  },
  {
    id: "resistance_band",
    name: "Resistance band circuit",
    emoji: "🎗️",
    kcal: 50,
    packLevel: 3,
    description: "Builds shoulder, arm and upper-back strength under light constant tension.",
  },
  {
    id: "skipping_warmup",
    name: "Skipping rope warm-up",
    emoji: "🪢",
    kcal: 40,
    packLevel: 3,
    description: "Raises your heart rate fast while working the calves and coordination.",
  },
  {
    id: "wall_sit",
    name: "Wall sit challenge (2 min)",
    emoji: "🧱",
    kcal: 30,
    packLevel: 3,
    description: "Isometric hold that builds serious quad and core endurance.",
  },
  {
    id: "extended_dog_walk",
    name: "Extended dog walk",
    emoji: "🐕‍🦺",
    kcal: 65,
    packLevel: 3,
    description: "Sustained cardio that works the calves and glutes over a longer distance.",
  },
  {
    id: "step_ups",
    name: "Step-ups ×40",
    emoji: "🪃",
    kcal: 48,
    packLevel: 3,
    description: "Unilateral leg strength work targeting the glutes and quads one side at a time.",
  },

  // ────────────────────────────────────────────────────────────
  // Level 4 — Fitness Pack
  // ────────────────────────────────────────────────────────────
  {
    id: "hiit_snack",
    name: "5-minute HIIT snack",
    emoji: "💥",
    kcal: 60,
    packLevel: 4,
    description: "A short, intense burst that spikes your heart rate for full-body calorie burn.",
  },
  {
    id: "jump_rope",
    name: "Jump rope ×2 minutes",
    emoji: "🪢",
    kcal: 35,
    packLevel: 4,
    description: "Fast-paced cardio that works the calves and shoulders together.",
  },
  {
    id: "hill_walk",
    name: "Hill or incline walk",
    emoji: "⛰️",
    kcal: 100,
    packLevel: 4,
    description: "Builds glute and hamstring strength while boosting cardio fitness.",
  },
  {
    id: "desk_burpees",
    name: "Desk burpee break",
    emoji: "🤸",
    kcal: 40,
    packLevel: 4,
    description: "A full-body explosive movement hitting the chest, legs and core at once.",
  },
  {
    id: "kettlebell_swings",
    name: "Kettlebell swings ×50",
    emoji: "🏋️‍♀️",
    kcal: 85,
    packLevel: 4,
    description: "A powerful hip-hinge movement that builds the glutes, hamstrings and lower back.",
  },
  {
    id: "mountain_climbers",
    name: "Mountain climbers ×100",
    emoji: "⛰️",
    kcal: 70,
    packLevel: 4,
    description: "Builds core and shoulder endurance while spiking your heart rate.",
  },
  {
    id: "lunges",
    name: "Walking lunges ×40",
    emoji: "🚶‍♂️",
    kcal: 55,
    packLevel: 4,
    description: "Unilateral quad and glute strength work that also improves balance.",
  },
  {
    id: "plank_hold",
    name: "Plank hold challenge (2 min)",
    emoji: "🧘",
    kcal: 30,
    packLevel: 4,
    description: "Deep core and shoulder stability work from a single sustained position.",
  },
  {
    id: "shadow_boxing",
    name: "Shadow boxing (5 min)",
    emoji: "🥊",
    kcal: 75,
    packLevel: 4,
    description: "Fast-paced cardio that works the shoulders, arms and rotational core.",
  },
  {
    id: "tabata_sprints",
    name: "Tabata sprint intervals",
    emoji: "⏱️",
    kcal: 95,
    packLevel: 4,
    description: "High-intensity intervals that maximise calorie burn in minimal time.",
  },

  // ────────────────────────────────────────────────────────────
  // Level 5 — Gladiator Pack (the hardest tier)
  // ────────────────────────────────────────────────────────────
  {
    id: "full_workout",
    name: "20-minute bodyweight workout",
    emoji: "🏋️",
    kcal: 160,
    packLevel: 5,
    description: "A full-body strength and conditioning session using just your bodyweight.",
  },
  {
    id: "stair_marathon",
    name: "10-floor stair marathon",
    emoji: "🏢",
    kcal: 130,
    packLevel: 5,
    description: "A serious test of cardio and leg endurance under sustained load.",
  },
  {
    id: "sprint_intervals",
    name: "Sprint intervals ×6",
    emoji: "🔥",
    kcal: 110,
    packLevel: 5,
    description: "Maximum-effort cardio that builds fast-twitch muscle power.",
  },
  {
    id: "stair_updowns",
    name: "20 stair up-and-down runs",
    emoji: "🪜",
    kcal: 140,
    packLevel: 5,
    description: "An intense leg endurance and cardiovascular challenge working quads, glutes and calves.",
  },
  {
    id: "press_ups",
    name: "50 press-ups",
    emoji: "💪",
    kcal: 90,
    packLevel: 5,
    description: "Builds the chest, shoulders, triceps and core through classic pressing strength.",
  },
  {
    id: "squat_century",
    name: "100 squats challenge",
    emoji: "🦿",
    kcal: 150,
    packLevel: 5,
    description: "A serious quad and glute endurance test across high volume.",
  },
  {
    id: "spartan_circuit",
    name: "Full Spartan circuit (10 moves)",
    emoji: "⚔️",
    kcal: 180,
    packLevel: 5,
    description: "A complete full-body strength and conditioning gauntlet — the toughest session in the app.",
  },
  {
    id: "battle_rope",
    name: "Battle rope blast (5 min)",
    emoji: "🪢",
    kcal: 120,
    packLevel: 5,
    description: "Explosive upper-body and core power work with a huge calorie burn.",
  },
  {
    id: "rucksack_walk",
    name: "Weighted rucksack walk (30 min)",
    emoji: "🎒",
    kcal: 170,
    packLevel: 5,
    description: "Builds full-body endurance by walking under extra load.",
  },
  {
    id: "hill_sprints",
    name: "Hill sprints ×8",
    emoji: "⛰️",
    kcal: 150,
    packLevel: 5,
    description: "Maximum leg power and cardiovascular capacity work on an incline.",
  },
];
