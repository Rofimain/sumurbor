import { NextResponse } from "next/server";
import {
  deleteArticle,
  getArticles,
  upsertArticle,
} from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getArticles());
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json(await upsertArticle(body));
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
    await deleteArticle(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
