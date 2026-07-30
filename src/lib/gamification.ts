// Shared gamification helpers: XP totals and streak stats.
// Kept out of page components per CLAUDE.md section 5's rule against
// putting important business logic directly in page components.
//
// XP is intentionally derived (not stored) from completed lessons so it
// never drifts out of sync with real progress: totalXp = completed lessons
// * LESSON_XP. Streaks are tracked in the Streak model and updated by the
// markLessonComplete server action.
import { prisma } from "@/lib/prisma";

export const LESSON_XP = 20;

export async function getUserGameStats(userId: string) {
  const [completedCount, streak] = await Promise.all([
    prisma.lessonProgress.count({
      where: { userId, completedAt: { not: null } },
    }),
    prisma.streak.findUnique({ where: { userId } }),
  ]);

  return {
    totalXp: completedCount * LESSON_XP,
    currentStreak: streak?.currentStreak ?? 0,
    longestStreak: streak?.longestStreak ?? 0,
  };
}
