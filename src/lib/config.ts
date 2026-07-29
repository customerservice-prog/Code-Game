// Centralized application configuration.
// Per CLAUDE.md section 2: the application name, description, and other
// product-level values must be configurable from a single place rather
// than hard-coded throughout the app.

export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "CodeQuest Academy",
  description:
    "A private, game-based full-stack coding education platform.",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@example.com",
  logoText: "CQ",
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? "development",

  defaults: {
    xp: {
      lessonComplete: 10,
      missionFirstAttempt: 15,
      missionSuccess: 10,
      noHintBonus: 5,
      reviewComplete: 5,
      bossChallenge: 30,
      capstoneMilestone: 50,
    },
    dailyGoalXp: 20,
  },

  featureFlags: {
    aiTutorEnabled: process.env.NEXT_PUBLIC_AI_TUTOR_ENABLED === "true",
    registrationMode: (process.env.NEXT_PUBLIC_REGISTRATION_MODE ??
      "invite-only") as "invite-only" | "open" | "disabled",
    maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true",
  },
} as const;

export type AppConfig = typeof appConfig;
