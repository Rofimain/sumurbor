import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";

interface FileObject {
  name: string;
  updated_at?: string;
  created_at?: string;
  metadata?: { size?: number; mimetype?: string };
}

async function listFolder(
  admin: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  folder: string,
): Promise<{ url: string; name: string; size?: number; created_at?: string }[]> {
  const { data, error } = await admin.storage
    .from("media")
    .list(folder, { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (error || !data) return [];

  const out: {
    url: string;
    name: string;
    size?: number;
    created_at?: string;
  }[] = [];
  for (const item of data as FileObject[]) {
    if (!item.metadata) {
      // subfolder — recurse one level only
      const subfolder = folder ? `${folder}/${item.name}` : item.name;
      const nested = await listFolder(admin, subfolder);
      out.push(...nested);
    } else {
      const path = folder ? `${folder}/${item.name}` : item.name;
      const { data: pub } = admin.storage.from("media").getPublicUrl(path);
      out.push({
        url: pub.publicUrl,
        name: item.name,
        size: item.metadata?.size,
        created_at: item.created_at,
      });
    }
  }
  return out;
}

export async function GET() {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Storage belum dikonfigurasi" },
      { status: 503 },
    );
  }
  const files = await listFolder(admin, "");
  return NextResponse.json({ files });
}
