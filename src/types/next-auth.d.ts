// Extends NextAuth's built-in types so the rest of the app can read
// session.user.id and session.user.role with real type safety instead of
// unsafe "as any" casts (CLAUDE.md section 5 disallows "any" unless
// unavoidable and documented).
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}
