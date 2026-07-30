"use server";

// Server action for marking a lesson complete. Kept in its own file with
// "use server" so it can be called directly from a client component
// (src/app/world-map/[worldSlug]/[lessonSlug]/mark-complete-button.tsx)
// without exposing any Prisma or session logic to the browser.
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LESSON_XP, getUserGameStats } from "@/lib/gamification";

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
