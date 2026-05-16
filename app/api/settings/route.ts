import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const data = await getSettings();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    await updateSettings(body as Record<string, string>);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
