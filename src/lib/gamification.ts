// Shared gamification helpers: XP totals, levels, streaks, and
// achievements. Kept out of page components per CLAUDE.md section 5's
// rule against putting important business logic directly in page
// components.
//
// XP is intentionally derived (not stored as a running total) so it never
// drifts out of sync with real progress: totalXp = completed lessons *
// LESSON_XP, plus the sum of xpAwarded across all of the user's mission
// attempts. xpAwarded is only ever set to a non-zero value on a mission's
// first successful attempt (see submitMissionAttempt in actions.ts), so
// summing every attempt's xpAwarded is equivalent to summing "first pass"
// XP without needing a separate distinct-per-mission query. Levels are
// derived from totalXp. Streaks are tracked in the Streak model and
// updated by the markLessonComplete server action. Achievements are
// derived entirely from real progress data below - nothing here is faked
// or hardcoded to look impressive.
import { prisma } from "@/lib/prisma";
import { MasteryLevel } from "@prisma/client";

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

// Maps a 0-100 skill mastery score onto the MasteryLevel enum. Used when a
// passed mission attempt bumps a learner's UserSkill.masteryScore.
export function masteryLevelFromScore(score: number): MasteryLevel {
  if (score <= 0) return MasteryLevel.NOT_STARTED;
  if (score < 20) return MasteryLevel.INTRODUCED;
  if (score < 40) return MasteryLevel.PRACTICING;
  if (score < 60) return MasteryLevel.DEVELOPING;
  if (score < 80) return MasteryLevel.PROFICIENT;
  return MasteryLevel.MASTERED;
}

export async function getUserGameStats(userId: string) {
  const [completedCount, streak, missionXpAgg, passedMissions] =
    await Promise.all([
      prisma.lessonProgress.count({
        where: { userId, completedAt: { not: null } },
      }),
      prisma.streak.findUnique({ where: { userId } }),
      prisma.missionAttempt.aggregate({
        where: { userId },
        _sum: { xpAwarded: true },
      }),
      prisma.missionAttempt.findMany({
        where: { userId, passed: true },
        distinct: ["missionId"],
        select: { missionId: true },
      }),
    ]);

  const missionXp = missionXpAgg._sum.xpAwarded ?? 0;
  const completedMissions = passedMissions.length;
  const totalXp = completedCount * LESSON_XP + missionXp;

  return {
    totalXp,
    completedMissions,
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
  completedMissions: number;
}): Achievement[] {
  const {
    completedLessons,
    currentStreak,
    longestStreak,
    worldsCompleted,
    completedMissions,
  } = input;

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
    {
      id: "first-mission",
      icon: "🎯",
      label: "Mission Accepted",
      description: "Solve your first interactive mission.",
      earned: completedMissions >= 1,
    },
    {
      id: "five-missions",
      icon: "🧩",
      label: "Problem Solver",
      description: "Solve 5 interactive missions.",
      earned: completedMissions >= 5,
    },
    {
      id: "ten-missions",
      icon: "🏆",
      label: "Mission Master",
      description: "Solve 10 interactive missions.",
      earned: completedMissions >= 10,
    },
  ];
}
