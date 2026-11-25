import type { CapacitorConfig } from "@capacitor/cli";
/* Synthetic fixture: a store-ready Capacitor game config. */
const config: CapacitorConfig = {
  appId: "com.example.game",
  appName: "Example Game",
  webDir: "dist",
  loggingBehavior: "debug",
  server: { hostname: "localhost", androidScheme: "https" },
  android: { allowMixedContent: false },
};
export default config;
