import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getWorldsWithProgress } from "@/lib/curriculum";

export default async function WorldMapPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const worlds = await getWorldsWithProgress(session.user.id);

  return (
    <main className="min-h-screen bg-background text-text p-8">
      <h1 className="text-2xl font-semibold">World Map</h1>
      <p className="text-text-muted mt-2 max-w-2xl">
        Each world groups related modules and lessons. Worlds without
        launch-quality lessons yet are marked Upcoming and do not count
        toward your progress.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {worlds.map((world) => (
          <div
            key={world.id}
            className="border border-border rounded-md bg-panel p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{world.title}</h2>
                {world.isUpcoming && (
                  <span className="text-xs uppercase tracking-wide text-text-muted border border-border rounded-sm px-2 py-0.5">
                    Upcoming
                  </span>
                )}
              </div>
              <p className="text-sm text-text-muted mt-1">{world.summary}</p>
            </div>

            {!world.isUpcoming && (
              <div className="mt-4">
                <p className="text-xs text-text-muted mb-2">
                  {world.completedLessons} / {world.totalLessons} lessons complete
                </p>
                <Link
                  href={`/world-map/${world.slug}`}
                  className="inline-block text-sm text-primary hover:underline"
                >
                  Enter world →
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
