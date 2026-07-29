"use client";

// Wraps the app in NextAuth's SessionProvider so client components can call
// useSession()/signIn()/signOut() (see src/lib/auth.ts for server-side config).
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
