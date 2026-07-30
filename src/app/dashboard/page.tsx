// Learner dashboard placeholder.
// Per CLAUDE.md sections 9-10, this page should show onboarding status,
// world map progress, daily goal, streak, and recommended next action.
// This route is now protected by real NextAuth session checks (see
// src/lib/auth.ts) - unauthenticated visitors are redirected to /sign-in.
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-background text-text p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-text-muted mt-2">
        Signed in as {session.user.email}. Real dashboard widgets (progress,
        streak, recommended next lesson) still need to be implemented.
      </p>
    </main>
  );
}
