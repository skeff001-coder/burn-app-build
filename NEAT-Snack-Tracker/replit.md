# Effortless Burn

A React Native / Expo mobile app for NEAT (Non-Exercise Activity Thermogenesis) and exercise snacks — passive calorie burn tracking with zero gym required.

## Run & Operate

- `pnpm --filter @workspace/mobile run dev` — run the Expo dev server
- `pnpm --filter @workspace/mobile run typecheck` — typecheck the mobile app
- Expo SDK 54, expo-router v4 (file-based routing)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo SDK 54, expo-router v6, React Native
- State: React Context + AsyncStorage
- Animation: react-native-reanimated
- Icons: @expo/vector-icons (Ionicons)
- Fonts: Inter (expo-google-fonts)
- Charts: react-native-svg (custom SVG line chart)

## Where things live

- `artifacts/mobile/app/(tabs)/` — tab screens (index, activities, streaks, history)
- `artifacts/mobile/context/AppContext.tsx` — main app state + history tracking
- `artifacts/mobile/context/PremiumContext.tsx` — 3-tier IAP state (cardio 49p, domestic 49p, bundle 99p)
- `artifacts/mobile/components/PaywallModal.tsx` — multi-option paywall sheet
- `artifacts/mobile/data/actions.ts` — 33 NEAT actions, MET values, category metadata
- `artifacts/mobile/constants/colors.ts` — dark theme palette
- `artifacts/mobile/store-metadata.txt` — App Store keyword list

## Architecture decisions

- Single AsyncStorage key `@bitesize_move_v2` for main app state (including history snapshots)
- History snapshots (`historyDays`) written on every `logAction` call and archived on day rollover
- Premium gated via three independent AsyncStorage flags; `isCardioUnlocked` / `isDomesticUnlocked` are derived booleans (pack OR bundle)
- Notifications gated exclusively by `isFullBundleUnlocked` (99p tier)
- All gamification (XP rank, calorie comparisons) runs on the free tier

## Product

Effortless Burn helps users burn more calories passively throughout the day through NEAT micro-movements, desk exercises, and lazy domestic hacks. Features: calorie tracking via MET science, streak system, XP leveling ("Desk Dungeon"), 7-day history graph, WhatsApp share, and three premium IAP packs.

## User preferences

- App name: Effortless Burn
- Dark theme: #0A0A0A bg, #86EFAC green, #FF6B2B orange
- Freemium: free core + cardio pack 49p + domestic pack 49p + full bundle 99p
- Always run `pnpm --filter @workspace/mobile run typecheck` before delivering

## Gotchas

- `pnpm dev` at root does not work — use `restart_workflow` for the mobile artifact
- `as const` arrays require explicit `(typeof ARRAY)[number]` type annotation on `let` variables
- "Unexpected text node" warnings in browser are harmless React Native web quirks
