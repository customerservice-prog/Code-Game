"use server";

// Server actions for the lesson page: marking a lesson complete, and
// grading interactive mission submissions. Kept in their own file with
// "use server" so they can be called directly from client components
// (mark-complete-button.tsx, mission-solver.tsx) without exposing any
// Prisma or session logic to the browser.
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { ContentStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  LESSON_XP,
  getUserGameStats,
  masteryLevelFromScore,
} from "@/lib/gamification";
import { gradeSubmission, type MissionTestSpec } from "@/lib/mission-grading";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export async function markLessonComplete(lessonId: string, worldSlug: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Never trust a client-supplied lessonId blindly - confirm it is a real
  // lesson before recording progress against it (CLAUDE.md section 5: never
  // trust user-provided IDs).
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    throw new Error("Lesson not found");
  }

  const existingProgress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
  const alreadyCompleted = !!existingProgress?.completedAt;

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { completedAt: new Date() },
    create: { userId, lessonId, completedAt: new Date() },
  });

  // Streaks count consecutive calendar days with at least one lesson
  // completed. Only update the streak the first time a lesson is
  // completed - repeat completions of the same lesson don't inflate it.
  let currentStreak = 0;
  if (!alreadyCompleted) {
    const today = new Date();
    const todayStart = startOfDay(today);
    const existingStreak = await prisma.streak.findUnique({ where: { userId } });
    const lastActiveStart = existingStreak?.lastActiveDate
      ? startOfDay(new Date(existingStreak.lastActiveDate))
      : null;

    let newCurrent = 1;
    if (lastActiveStart) {
      const diffDays = Math.round(
        (todayStart.getTime() - lastActiveStart.getTime()) / (24 * 60 * 60 * 1000)
      );
      if (diffDays === 0) {
        newCurrent = existingStreak!.currentStreak;
      } else if (diffDays === 1) {
        newCurrent = existingStreak!.currentStreak + 1;
      } else {
        newCurrent = 1;
      }
    }
    const newLongest = existingStreak
      ? Math.max(existingStreak.longestStreak, newCurrent)
      : newCurrent;

    const updatedStreak = await prisma.streak.upsert({
      where: { userId },
      update: { currentStreak: newCurrent, longestStreak: newLongest, lastActiveDate: today },
      create: { userId, currentStreak: newCurrent, longestStreak: newLongest, lastActiveDate: today },
    });
    currentStreak = updatedStreak.currentStreak;
  } else {
    const existingStreak = await prisma.streak.findUnique({ where: { userId } });
    currentStreak = existingStreak?.currentStreak ?? 0;
  }

  revalidatePath(`/world-map/${worldSlug}`);
  revalidatePath("/world-map");
  revalidatePath("/dashboard");

  // Re-fetch derived stats so the client can show an up-to-date level and
  // XP-to-next-level progress bar right after completing a lesson.
  const stats = await getUserGameStats(userId);

  return {
    xpAwarded: alreadyCompleted ? 0 : LESSON_XP,
    currentStreak,
    alreadyCompleted,
    level: stats.level,
    xpIntoLevel: stats.xpIntoLevel,
    xpForNextLevel: stats.xpForNextLevel,
  };
}

// Grades a single mission submission for real, server-side. Never trusts
// the client-supplied missionId or submission shape (CLAUDE.md section 5):
// the mission is always re-fetched and confirmed PUBLISHED before grading,
// and the submission is narrowed with typeof checks inside gradeSubmission.
export async function submitMissionAttempt(missionId: string, submission: unknown) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
    include: {
      tests: true,
      missionSkills: true,
      lesson: { include: { module: { include: { world: true } } } },
    },
  });

  if (!mission || mission.status !== ContentStatus.PUBLISHED) {
    throw new Error("Mission not found");
  }

  const testSpec = mission.tests[0]?.expected as unknown as
    | MissionTestSpec
    | undefined;
  if (!testSpec) {
    throw new Error("This mission has no grading rules configured yet.");
  }

  const { passed, feedback } = gradeSubmission(
    testSpec,
    submission,
    mission.explanation
  );

  const previousPass = await prisma.missionAttempt.findFirst({
    where: { userId, missionId, passed: true },
  });
  const isFirstPass = passed && !previousPass;

  const attemptCount = await prisma.missionAttempt.count({
    where: { userId, missionId },
  });

  // XP is only ever awarded on a mission's first successful attempt, so
  // retrying an already-solved mission can't be used to farm extra XP.
  const xpAwarded = isFirstPass ? mission.xpReward : 0;

  await prisma.missionAttempt.create({
    data: {
      userId,
      missionId,
      attemptNo: attemptCount + 1,
      passed,
      score: passed ? 100 : 0,
      xpAwarded,
    },
  });

  // Bump related skill mastery only on a genuine first pass, to avoid
  // inflating mastery scores via repeat submissions of an already-solved
  // mission.
  if (isFirstPass) {
    for (const missionSkill of mission.missionSkills) {
      const existing = await prisma.userSkill.findUnique({
        where: {
          userId_skillId: { userId, skillId: missionSkill.skillId },
        },
      });
      const newScore = Math.min(100, (existing?.masteryScore ?? 0) + 20);
      await prisma.userSkill.upsert({
        where: {
          userId_skillId: { userId, skillId: missionSkill.skillId },
        },
        update: {
          masteryScore: newScore,
          masteryLevel: masteryLevelFromScore(newScore),
        },
        create: {
          userId,
          skillId: missionSkill.skillId,
          masteryScore: newScore,
          masteryLevel: masteryLevelFromScore(newScore),
        },
      });
    }
  }

  const worldSlug = mission.lesson.module.world.slug;
  revalidatePath(`/world-map/${worldSlug}/${mission.lesson.slug}`);
  revalidatePath("/world-map");
  revalidatePath("/dashboard");

  const stats = await getUserGameStats(userId);

  return {
    passed,
    feedback,
    xpAwarded,
    totalXp: stats.totalXp,
    level: stats.level,
    xpIntoLevel: stats.xpIntoLevel,
    xpForNextLevel: stats.xpForNextLevel,
  };
}
