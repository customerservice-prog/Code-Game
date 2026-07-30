"use server";

// Server action for marking a lesson complete. Kept in its own file with
// "use server" so it can be called directly from a client component
// (src/app/world-map/[worldSlug]/[lessonSlug]/mark-complete-button.tsx)
// without exposing any Prisma or session logic to the browser.
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { completedAt: new Date() },
    create: { userId, lessonId, completedAt: new Date() },
  });

  revalidatePath(`/world-map/${worldSlug}`);
  revalidatePath("/world-map");
  revalidatePath("/dashboard");
}
