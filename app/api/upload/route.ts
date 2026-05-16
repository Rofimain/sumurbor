import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];
const MAX_SIZE = 10 * 1024 * 1024;

function sanitizeFolder(s: string) {
  return (s || "misc").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 50) || "misc";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = sanitizeFolder(String(formData.get("folder") || ""));

    if (!file)
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 },
      );
    if (!ALLOWED_TYPES.includes(file.type))
      return NextResponse.json(
        { error: "Tipe file tidak didukung (JPEG/PNG/WebP/GIF/AVIF)" },
        { status: 400 },
      );
    if (file.size > MAX_SIZE)
      return NextResponse.json(
        { error: "Ukuran file maks 10MB" },
        { status: 400 },
      );
    if (file.size === 0)
      return NextResponse.json({ error: "File kosong" }, { status: 400 });

    const admin = getSupabaseAdminClient();
    if (!admin)
      return NextResponse.json(
        { error: "Storage belum dikonfigurasi" },
        { status: 503 },
      );

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const safeName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 9)}.${ext}`;
    const buffer = new Uint8Array(await file.arrayBuffer());

    const { error } = await admin.storage
      .from("media")
      .upload(safeName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data } = admin.storage.from("media").getPublicUrl(safeName);
    return NextResponse.json({ url: data.publicUrl });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || !String(url).includes("/media/")) {
      return NextResponse.json({ error: "URL tidak valid" }, { status: 400 });
    }
    const admin = getSupabaseAdminClient();
    if (admin) {
      const path = String(url).split("/media/")[1];
      if (path) await admin.storage.from("media").remove([path]);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
