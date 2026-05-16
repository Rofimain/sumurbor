import { NextResponse } from "next/server";
import { signIn, signOut } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password diperlukan" },
        { status: 400 },
      );
    }
    const ok = await signIn(email, password);
    if (!ok) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE() {
  await signOut();
  return NextResponse.json({ ok: true });
}
