import { NextResponse } from "next/server";
import {
  deleteService,
  getServices,
  upsertService,
} from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const data = await getServices();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await upsertService(body);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await deleteService(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
