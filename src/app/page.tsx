import { appConfig } from "@/lib/config";

// Public landing page placeholder.
// Per CLAUDE.md section 10, this should explain the product without
// exposing private learning data, and link to sign-in.
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-text flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold">{appConfig.name}</h1>
      <p className="text-text-muted max-w-xl text-center">
        {appConfig.description} This is a starter scaffold - the full
        learning experience described in CLAUDE.md still needs to be built.
      </p>
      <a
        href="/sign-in"
        className="rounded-md bg-primary px-4 py-2 text-white"
      >
        Sign in
      </a>
    </main>
  );
}
