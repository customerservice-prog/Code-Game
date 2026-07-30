import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getWorldsWithProgress } from "@/lib/curriculum";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const worlds = await getWorldsWithProgress(session.user.id);
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

      <div className="border border-border rounded-md bg-panel p-4 mt-6 max-w-md">
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
        Streak, XP, and recommended-next-lesson widgets are not implemented
        yet - only real lesson progress is shown above.
      </p>
    </main>
  );
}
