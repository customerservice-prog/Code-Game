import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getWorldBySlug } from "@/lib/curriculum";
import { getWorldVisual } from "@/lib/world-visuals";

export default async function WorldDetailPage({
  params,
}: {
  params: { worldSlug: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const world = await getWorldBySlug(params.worldSlug, session.user.id);
  if (!world) {
    notFound();
  }

  const visual = getWorldVisual(world.slug);

  return (
    <main className="min-h-screen bg-background text-text p-8 max-w-3xl mx-auto">
      <Link href="/world-map" className="text-sm text-primary hover:underline">
        ← World Map
      </Link>
      <div className="flex items-center gap-3 mt-3">
        <span className="text-3xl leading-none" aria-hidden="true">
          {visual.icon}
        </span>
        <h1 className="text-2xl font-semibold">{world.title}</h1>
      </div>
      <p className="text-text-muted mt-1">{world.summary}</p>

      <div className="mt-6 space-y-6">
        {world.modules.map((module, moduleIndex) => {
          const total = module.lessons.length;
          const completed = module.lessons.filter((l) =>
            l.lessonProgress.some((p) => p.completedAt)
          ).length;
          const modulePct = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <div key={module.id}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">
                  <span className="text-text-muted mr-2">
                    Module {moduleIndex + 1}
                  </span>
                  {module.title}
                </h2>
                <span className="text-xs text-text-muted whitespace-nowrap">
                  {completed} / {total} complete{modulePct === 100 ? " 🎉" : ""}
                </span>
              </div>
              <p className="text-sm text-text-muted">{module.summary}</p>
              <div className="h-1.5 rounded-full bg-border overflow-hidden mt-2">
                <div
                  className="h-full rounded-full bg-success transition-all duration-motion"
                  style={{ width: `${modulePct}%` }}
                />
              </div>
              <div className="mt-3 space-y-2">
                {module.lessons.map((lesson, lessonIndex) => {
                  const isComplete = lesson.lessonProgress.some((p) => p.completedAt);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/world-map/${world.slug}/${lesson.slug}`}
                      className="flex items-center gap-3 border border-border rounded-md bg-panel p-3 transition-transform duration-motion hover:border-primary hover:-translate-y-0.5"
                    >
                      <span
                        className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-medium ${
                          isComplete
                            ? "bg-success text-background"
                            : "border border-border text-text-muted"
                        }`}
                      >
                        {isComplete ? "✓" : lessonIndex + 1}
                      </span>
                      <span className="flex-1">{lesson.title}</span>
                      <span
                        className={`text-xs whitespace-nowrap ${
                          isComplete ? "text-success" : "text-text-muted"
                        }`}
                      >
                        {isComplete ? "Complete" : "Start →"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {world.modules.length === 0 && (
          <p className="text-text-muted text-sm">
            This world does not have any published modules yet.
          </p>
        )}
      </div>
    </main>
  );
}
