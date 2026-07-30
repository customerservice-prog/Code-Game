import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getLessonBySlug, getOrCreateLessonProgress } from "@/lib/curriculum";
import { lessonContentSchema } from "@/lib/lesson-content";
import { LessonContent } from "@/components/lesson-content";
import { MarkCompleteButton } from "./mark-complete-button";

export default async function LessonPage({
  params,
}: {
  params: { worldSlug: string; lessonSlug: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const lesson = await getLessonBySlug(params.worldSlug, params.lessonSlug);
  if (!lesson) {
    notFound();
  }

  const parsedContent = lessonContentSchema.safeParse(lesson.content);

  // Recording that the learner opened this lesson (without marking it
  // complete) happens here rather than in the page markup, keeping the
  // write out of the render path's control flow.
  const progress = await getOrCreateLessonProgress(session.user.id, lesson.id);

  return (
    <main className="min-h-screen bg-background text-text p-8 max-w-3xl mx-auto">
      <Link
        href={`/world-map/${params.worldSlug}`}
        className="text-sm text-primary hover:underline"
      >
        ← Back to {lesson.module.world.title}
      </Link>

      <h1 className="text-2xl font-semibold mt-3">{lesson.title}</h1>

      <div className="mt-6">
        {parsedContent.success ? (
          <LessonContent blocks={parsedContent.data} />
        ) : (
          <p className="text-error text-sm">
            This lesson&apos;s content could not be displayed because it does
            not match the expected format.
          </p>
        )}
      </div>

      {lesson.missions.length > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <h2 className="text-lg font-medium">Missions</h2>
          <p className="text-sm text-text-muted mt-1">
            Interactive mission solving and grading is not built yet - this is
            a preview of what is coming.
          </p>
          <div className="space-y-3 mt-3">
            {lesson.missions.map((mission) => (
              <div
                key={mission.id}
                className="border border-border rounded-md bg-panel p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{mission.title}</p>
                  <span className="text-xs text-text-muted">
                    {mission.xpReward} XP
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Type: {mission.type}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-border pt-6">
        <MarkCompleteButton
          lessonId={lesson.id}
          worldSlug={params.worldSlug}
          initiallyCompleted={Boolean(progress.completedAt)}
        />
      </div>
    </main>
  );
}
