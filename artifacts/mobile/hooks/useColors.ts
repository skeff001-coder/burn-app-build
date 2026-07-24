import colors from "@/constants/colors";

// Effortless Burn is dark-theme only by design, so this hook is a simple
// pass-through today. Kept as a hook (rather than a plain import) so a
// light theme can be added later without touching every screen.
export function useColors() {
  return colors;
}
