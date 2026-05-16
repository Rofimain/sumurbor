import { NextResponse } from "next/server";
import {
  deleteTestimonial,
  getTestimonials,
  upsertTestimonial,
} from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getTestimonials());
}

export async function POST(req: Request) {
  try {
    return NextResponse.json(await upsertTestimonial(await req.json()));
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
    await deleteTestimonial(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
