import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getWorldBySlug } from "@/lib/curriculum";

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

  return (
    <main className="min-h-screen bg-background text-text p-8 max-w-3xl mx-auto">
      <Link href="/world-map" className="text-sm text-primary hover:underline">
        ← World Map
      </Link>
      <h1 className="text-2xl font-semibold mt-3">{world.title}</h1>
      <p className="text-text-muted mt-1">{world.summary}</p>

      <div className="mt-6 space-y-6">
        {world.modules.map((module) => (
          <div key={module.id}>
            <h2 className="text-lg font-medium">{module.title}</h2>
            <p className="text-sm text-text-muted">{module.summary}</p>
            <div className="mt-2 space-y-2">
              {module.lessons.map((lesson) => {
                const isComplete = lesson.lessonProgress.some((p) => p.completedAt);
                return (
                  <Link
                    key={lesson.id}
                    href={`/world-map/${world.slug}/${lesson.slug}`}
                    className="flex items-center justify-between border border-border rounded-md bg-panel p-3 hover:border-primary"
                  >
                    <span>{lesson.title}</span>
                    <span
                      className={`text-xs ${
                        isComplete ? "text-success" : "text-text-muted"
                      }`}
                    >
                      {isComplete ? "Complete" : "Start"}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {world.modules.length === 0 && (
          <p className="text-text-muted text-sm">
            This world does not have any published modules yet.
          </p>
        )}
      </div>
    </main>
  );
}
