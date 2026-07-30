import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getWorldsWithProgress } from "@/lib/curriculum";
import { getUserGameStats } from "@/lib/gamification";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const [worlds, stats] = await Promise.all([
    getWorldsWithProgress(session.user.id),
    getUserGameStats(session.user.id),
  ]);
  const activeWorlds = worlds.filter((w) => !w.isUpcoming);
  const totalLessons = activeWorlds.reduce((sum, w) => sum + w.totalLessons, 0);
  const completedLessons = activeWorlds.reduce(
    (sum, w) => sum + w.completedLessons,
    0
  );

  return (
    <main className="min-h-screen bg-background text-text p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-text-muted mt-2">Signed in as {session.user.email}.</p>

      <div className="flex flex-wrap gap-4 mt-6">
        <div className="border border-border rounded-lg bg-panel p-4 min-w-[160px]">
          <p className="text-sm text-text-muted">⚡ Total XP</p>
          <p className="text-2xl font-semibold mt-1">{stats.totalXp}</p>
        </div>
        <div className="border border-border rounded-lg bg-panel p-4 min-w-[160px]">
          <p className="text-sm text-text-muted">🔥 Current streak</p>
          <p className="text-2xl font-semibold mt-1">
            {stats.currentStreak} {stats.currentStreak === 1 ? "day" : "days"}
          </p>
        </div>
        <div className="border border-border rounded-lg bg-panel p-4 min-w-[160px]">
          <p className="text-sm text-text-muted">🏆 Longest streak</p>
          <p className="text-2xl font-semibold mt-1">
            {stats.longestStreak} {stats.longestStreak === 1 ? "day" : "days"}
          </p>
        </div>
      </div>

      <div className="border border-border rounded-md bg-panel p-4 mt-4 max-w-md">
        <p className="text-sm text-text-muted">Lesson progress</p>
        <p className="text-xl font-medium mt-1">
          {completedLessons} / {totalLessons} lessons complete
        </p>
        <Link
          href="/world-map"
          className="inline-block mt-3 text-sm text-primary hover:underline"
        >
          Go to World Map →
        </Link>
      </div>

      <p className="text-text-muted mt-6 text-sm max-w-2xl">
        Achievements and mission XP are not implemented yet - the XP above is
        earned only from completed lessons, and streaks count consecutive
        calendar days with at least one lesson completed.
      </p>
    </main>
  );
}
