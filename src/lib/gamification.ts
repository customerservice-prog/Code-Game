// Shared gamification helpers: XP totals, levels, streaks, and
// achievements. Kept out of page components per CLAUDE.md section 5's
// rule against putting important business logic directly in page
// components.
//
// XP is intentionally derived (not stored) from completed lessons so it
// never drifts out of sync with real progress: totalXp = completed lessons
// * LESSON_XP. Levels are derived from totalXp. Streaks are tracked in the
// Streak model and updated by the markLessonComplete server action.
// Achievements are derived entirely from real progress data below -
// nothing here is faked or hardcoded to look impressive.
import { prisma } from "@/lib/prisma";

export const LESSON_XP = 20;
export const LEVEL_XP = 100;

export function getLevelInfo(totalXp: number) {
  const level = Math.floor(totalXp / LEVEL_XP) + 1;
  const xpIntoLevel = totalXp % LEVEL_XP;
  return {
    level,
    xpIntoLevel,
    xpForNextLevel: LEVEL_XP,
    levelProgressPct: Math.round((xpIntoLevel / LEVEL_XP) * 100),
  };
}

export async function getUserGameStats(userId: string) {
  const [completedCount, streak] = await Promise.all([
    prisma.lessonProgress.count({
      where: { userId, completedAt: { not: null } },
    }),
    prisma.streak.findUnique({ where: { userId } }),
  ]);

  const totalXp = completedCount * LESSON_XP;

  return {
    totalXp,
    currentStreak: streak?.currentStreak ?? 0,
    longestStreak: streak?.longestStreak ?? 0,
    ...getLevelInfo(totalXp),
  };
}

export interface Achievement {
  id: string;
  icon: string;
  label: string;
  description: string;
  earned: boolean;
}

// Achievements are computed from progress data the caller already loaded
// (the dashboard page fetches worlds/stats anyway) rather than this
// helper running its own extra queries.
export function getAchievements(input: {
  completedLessons: number;
  currentStreak: number;
  longestStreak: number;
  worldsCompleted: number;
}): Achievement[] {
  const { completedLessons, currentStreak, longestStreak, worldsCompleted } =
    input;

  return [
    {
      id: "first-lesson",
      icon: "🌱",
      label: "First Steps",
      description: "Complete your first lesson.",
      earned: completedLessons >= 1,
    },
    {
      id: "five-lessons",
      icon: "📘",
      label: "Getting Serious",
      description: "Complete 5 lessons.",
      earned: completedLessons >= 5,
    },
    {
      id: "streak-starter",
      icon: "🔥",
      label: "Streak Starter",
      description: "Complete a lesson today to start a streak.",
      earned: currentStreak >= 1,
    },
    {
      id: "streak-keeper",
      icon: "🔥🔥",
      label: "Streak Keeper",
      description: "Reach a 3-day streak.",
      earned: longestStreak >= 3,
    },
    {
      id: "world-graduate",
      icon: "🏅",
      label: "World Graduate",
      description: "Complete every lesson in a world.",
      earned: worldsCompleted >= 1,
    },
  ];
}
