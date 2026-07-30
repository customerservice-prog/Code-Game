import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getWorldsWithProgress } from "@/lib/curriculum";
import { getWorldVisual } from "@/lib/world-visuals";
import { getUserGameStats } from "@/lib/gamification";

export default async function WorldMapPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const [worlds, stats] = await Promise.all([
    getWorldsWithProgress(session.user.id),
    getUserGameStats(session.user.id),
  ]);

  return (
    <main className="min-h-screen bg-background text-text p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">World Map</h1>
          <p className="text-text-muted mt-2 max-w-2xl">
            Each world groups related modules and lessons. Worlds without
            launch-quality lessons yet are marked Upcoming and do not count
            toward your progress.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="border border-border rounded-lg bg-panel px-4 py-2 text-center min-w-[90px]">
            <p className="text-xs text-text-muted">⚡ XP</p>
            <p className="text-lg font-semibold">{stats.totalXp}</p>
          </div>
          <div className="border border-border rounded-lg bg-panel px-4 py-2 text-center min-w-[90px]">
            <p className="text-xs text-text-muted">🔥 Streak</p>
            <p className="text-lg font-semibold">{stats.currentStreak}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {worlds.map((world) => {
          const visual = getWorldVisual(world.slug);
          const pct =
            world.totalLessons > 0
              ? Math.round((world.completedLessons / world.totalLessons) * 100)
              : 0;

          return (
            <div
              key={world.id}
              className={`rounded-lg bg-panel p-4 flex flex-col justify-between border border-border border-t-4 transition-transform duration-motion ${
                world.isUpcoming ? "opacity-60" : "hover:-translate-y-1 hover:shadow-lg"
              }`}
              style={{ borderTopColor: visual.accent }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl leading-none" aria-hidden="true">
                      {visual.icon}
                    </span>
                    <h2 className="font-medium">{world.title}</h2>
                  </div>
                  {world.isUpcoming && (
                    <span className="text-xs uppercase tracking-wide text-text-muted border border-border rounded-sm px-2 py-0.5 whitespace-nowrap">
                      🔒 Upcoming
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-muted mt-1">{world.summary}</p>
              </div>

              {!world.isUpcoming && (
                <div className="mt-4">
                  <div className="h-2 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-success transition-all duration-motion"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-2">
                    {world.completedLessons} / {world.totalLessons} lessons complete
                    {pct === 100 ? " 🎉" : ""}
                  </p>
                  <Link
                    href={`/world-map/${world.slug}`}
                    className="inline-block text-sm text-primary hover:underline mt-1"
                  >
                    Enter world →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
