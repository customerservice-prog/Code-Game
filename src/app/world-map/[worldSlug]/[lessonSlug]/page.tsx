import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getLessonBySlug, getOrCreateLessonProgress } from "@/lib/curriculum";
import { lessonContentSchema } from "@/lib/lesson-content";
import { LessonContent } from "@/components/lesson-content";
import { MarkCompleteButton } from "./mark-complete-button";
import { MissionSolver, type MissionForClient } from "./mission-solver";

export default async function LessonPage({
  params,
}: {
  params: { worldSlug: string; lessonSlug: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const lesson = await getLessonBySlug(
    params.worldSlug,
    params.lessonSlug,
    session.user.id
  );
  if (!lesson) {
    notFound();
  }

  const parsedContent = lessonContentSchema.safeParse(lesson.content);

  // Recording that the learner opened this lesson (without marking it
  // complete) happens here rather than in the page markup, keeping the
  // write out of the render path's control flow.
  const progress = await getOrCreateLessonProgress(session.user.id, lesson.id);

  // Only the fields the client actually needs are sent down - solutionCode
  // and the full test spec never leave the server (CLAUDE.md section 5).
  const missionsForClient: MissionForClient[] = lesson.missions.map(
    (mission) => ({
      id: mission.id,
      title: mission.title,
      type: mission.type,
      prompt: mission.prompt,
      options: (mission.options as string[] | null) ?? null,
      starterCode: mission.starterCode,
      explanation: mission.explanation,
      xpReward: mission.xpReward,
      difficulty: mission.difficulty,
      alreadyPassed: mission.attempts.length > 0,
    })
  );

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

      {missionsForClient.length > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <h2 className="text-lg font-medium">🎮 Missions</h2>
          <p className="text-sm text-text-muted mt-1">
            Solve each mission for real - your answer is graded on the
            server and awards XP the first time you get it right.
          </p>
          <MissionSolver missions={missionsForClient} />
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
