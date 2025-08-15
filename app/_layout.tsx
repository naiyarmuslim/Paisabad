import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FinanceProvider } from "@/hooks/finance-store";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack 
      screenOptions={{ 
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: '#0A0A0B',
        },
        headerTintColor: '#FFFFFF',
        contentStyle: {
          backgroundColor: '#0A0A0B',
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="add-transaction" 
        options={{ 
          title: "Add Transaction",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="add-account" 
        options={{ 
          title: "Add Account",
          presentation: "modal",
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <FinanceProvider>
          <RootLayoutNav />
        </FinanceProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}