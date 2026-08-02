import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppProvider } from "@/context/AppContext";
import { IAPProvider } from "@/context/IAPContext";
import { LevelProvider } from "@/context/LevelContext";
import { LevelUpModal } from "@/components/LevelUpModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Alert } from "react-native";

// TEMPORARY diagnostic handler — catches JS errors that happen outside
// React's render phase (event handlers, useEffect, async callbacks), which
// ErrorBoundary alone can't catch. Native .ips crash logs never contain the
// actual JS error text, so this surfaces it on-screen instead of letting
// the app hard-abort silently. Remove once the real bug is found and fixed.
const defaultErrorHandler = ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler((error, isFatal) => {
  Alert.alert(
    isFatal ? "Fatal JS Error" : "JS Error",
    `${error?.name ?? "Error"}: ${error?.message ?? "no message"}\n\n${error?.stack ?? "no stack"}`,
    [{ text: "OK" }]
  );
  // Deliberately NOT calling defaultErrorHandler here — that would trigger
  // the native abort before you can read the alert. Once we've diagnosed
  // the real bug, delete this whole block to restore normal crash behavior.
});

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <LevelUpModal />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppProvider>
            <IAPProvider>
              <LevelProvider>
                <RootLayoutNav />
              </LevelProvider>
            </IAPProvider>
          </AppProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
