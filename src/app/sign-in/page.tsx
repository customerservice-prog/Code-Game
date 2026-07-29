// Sign-in page placeholder.
// Per CLAUDE.md sections 4 and 9, real authentication (NextAuth or similar)
// with rate limiting, secure sessions, and helpful error states must be
// implemented here - this file only establishes the route and basic markup.
export default function SignInPage() {
  return (
    <main className="min-h-screen bg-background text-text flex items-center justify-center p-8">
      <form className="w-full max-w-sm rounded-lg border border-border bg-panel p-6 flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            name="email"
            className="rounded-md border border-border bg-background px-3 py-2"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            name="password"
            className="rounded-md border border-border bg-background px-3 py-2"
            required
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-white"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
