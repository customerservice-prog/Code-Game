// Public registration endpoint.
// Only active when FEATURE_PUBLIC_REGISTRATION=true (see CLAUDE.md section 9).
// Creates a new LEARNER user with a securely hashed password.
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).max(100).optional(),
});

export async function POST(request: Request) {
  if (process.env.FEATURE_PUBLIC_REGISTRATION !== "true") {
    return NextResponse.json(
      { error: "Public registration is currently disabled." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: parsed.data.name,
      role: "LEARNER",
    },
  });

  return NextResponse.json({ ok: true });
}
