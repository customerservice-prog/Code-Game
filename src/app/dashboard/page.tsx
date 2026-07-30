import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getWorldsWithProgress } from "@/lib/curriculum";
import { getUserGameStats, getAchievements } from "@/lib/gamification";

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
  const worldsCompleted = activeWorlds.filter(
    (w) => w.totalLessons > 0 && w.completedLessons === w.totalLessons
  ).length;

  const achievements = getAchievements({
    completedLessons,
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    worldsCompleted,
  });

  return (
    <main className="min-h-screen bg-background text-text p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-text-muted mt-2">Signed in as {session.user.email}.</p>

      <div className="flex flex-wrap gap-4 mt-6">
        <div
          className="rounded-lg bg-gradient-to-br from-panel to-background border border-primary p-4 min-w-[160px]"
          style={{ boxShadow: "0 0 14px -4px var(--color-primary)" }}
        >
          <p className="text-sm text-text-muted">⚡ Total XP</p>
          <p className="text-2xl font-semibold mt-1 text-primary">{stats.totalXp}</p>
        </div>
        <div
          className="rounded-lg bg-gradient-to-br from-panel to-background border border-success p-4 min-w-[180px]"
          style={{ boxShadow: "0 0 14px -4px var(--color-success)" }}
        >
          <p className="text-sm text-text-muted">⭐ Level</p>
          <p className="text-2xl font-semibold mt-1 text-success">{stats.level}</p>
          <div className="h-1.5 w-full rounded-full bg-border overflow-hidden mt-2">
            <div
              className="h-full rounded-full bg-success transition-all duration-motion"
              style={{ width: `${stats.levelProgressPct}%` }}
            />
          </div>
          <p className="text-xs text-text-muted mt-1">
            {stats.xpIntoLevel} / {stats.xpForNextLevel} XP to next level
          </p>
        </div>
        <div
          className="rounded-lg bg-gradient-to-br from-panel to-background border border-warning p-4 min-w-[160px]"
          style={{ boxShadow: "0 0 14px -4px var(--color-warning)" }}
        >
          <p className="text-sm text-text-muted">🔥 Current streak</p>
          <p className="text-2xl font-semibold mt-1 text-warning">
            {stats.currentStreak} {stats.currentStreak === 1 ? "day" : "days"}
          </p>
        </div>
        <div
          className="rounded-lg bg-gradient-to-br from-panel to-background border border-info p-4 min-w-[160px]"
          style={{ boxShadow: "0 0 14px -4px var(--color-info)" }}
        >
          <p className="text-sm text-text-muted">🏆 Longest streak</p>
          <p className="text-2xl font-semibold mt-1 text-info">
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

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-3 max-w-3xl">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`rounded-lg border p-3 text-center transition-transform duration-motion ${
                a.earned
                  ? "border-success bg-panel hover:-translate-y-1"
                  : "border-border bg-panel opacity-40"
              }`}
              title={a.description}
            >
              <p className="text-2xl leading-none">{a.icon}</p>
              <p className="text-xs mt-1 font-medium">{a.label}</p>
              <p className="text-[10px] text-text-muted mt-0.5">
                {a.earned ? "Earned" : "Locked"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-text-muted mt-6 text-sm max-w-2xl">
        Achievements above are derived from your real lesson and streak
        progress. Mission XP is not implemented yet, so the XP shown here
        comes only from completed lessons.
      </p>
    </main>
  );
}
