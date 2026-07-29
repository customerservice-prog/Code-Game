// Learner dashboard placeholder.
// Per CLAUDE.md sections 9-10, this page should show onboarding status,
// world map progress, daily goal, streak, and recommended next action.
// This route is not yet protected by real authentication - see CLAUDE.md
// section 9 (Authentication flow) before treating this as production-ready.
export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background text-text p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-text-muted mt-2">
        This is a placeholder. Real dashboard widgets (progress, streak,
        recommended next lesson) still need to be implemented.
      </p>
    </main>
  );
}
