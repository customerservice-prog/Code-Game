"use client";

// Real sign-in page wired to NextAuth credentials auth (see src/lib/auth.ts).
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Incorrect email or password.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-background text-text flex items-center justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-border bg-panel p-6 flex flex-col gap-4"
      >
        <h1 className="text-xl font-semibold">Sign in</h1>
        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
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
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-sm text-text-muted text-center">
          No account?{" "}
          <a href="/sign-up" className="underline">
            Sign up
          </a>
        </p>
      </form>
    </main>
  );
}
