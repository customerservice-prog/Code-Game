// Server-side data access helpers for the curriculum engine.
// Kept out of page components per CLAUDE.md section 5's rule against
// putting important business logic directly in page components.
import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@prisma/client";

export async function getWorldsWithProgress(userId: string) {
  const worlds = await prisma.world.findMany({
    orderBy: { order: "asc" },
    include: {
      modules: {
        where: { status: ContentStatus.PUBLISHED },
        include: {
          lessons: {
            where: { status: ContentStatus.PUBLISHED },
            include: {
              lessonProgress: { where: { userId } },
            },
          },
        },
      },
    },
  });

  return worlds.map((world) => {
    const lessons = world.modules.flatMap((m) => m.lessons);
    const totalLessons = lessons.length;
    const completedLessons = lessons.filter((l) =>
      l.lessonProgress.some((p) => p.completedAt)
    ).length;

    return {
      id: world.id,
      slug: world.slug,
      title: world.title,
      summary: world.summary,
      order: world.order,
      // Worlds without any published lessons yet are "Upcoming" per
      // CLAUDE.md section 11 - never presented as complete or empty shells.
      isUpcoming: totalLessons === 0,
      totalLessons,
      completedLessons,
    };
  });
}

export async function getWorldBySlug(slug: string, userId: string) {
  return prisma.world.findUnique({
    where: { slug },
    include: {
      modules: {
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { order: "asc" },
        include: {
          lessons: {
            where: { status: ContentStatus.PUBLISHED },
            orderBy: { order: "asc" },
            include: {
              lessonProgress: { where: { userId } },
            },
          },
        },
      },
    },
  });
}

export async function getLessonBySlug(worldSlug: string, lessonSlug: string) {
  return prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      status: ContentStatus.PUBLISHED,
      module: { world: { slug: worldSlug } },
    },
    include: {
      module: { include: { world: true } },
      missions: {
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { difficulty: "asc" },
      },
    },
  });
}

export async function getOrCreateLessonProgress(userId: string, lessonId: string) {
  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
  if (existing) {
    return existing;
  }
  return prisma.lessonProgress.create({ data: { userId, lessonId } });
}
