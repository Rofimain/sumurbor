import { NextResponse } from "next/server";
import { getSettings } from "@/lib/db";
import { siteConfig } from "@/data";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET() {
  const db: Record<string, string> = await getSettings().catch(
    () => ({}) as Record<string, string>,
  );
  return NextResponse.json({
    brandName: db.site_name || siteConfig.brandName,
    tagline: db.tagline || siteConfig.tagline,
    description: db.description || siteConfig.description,
    phone: db.phone || siteConfig.phone,
    phoneDisplay: db.phone_display || siteConfig.phoneDisplay,
    whatsapp: db.whatsapp || siteConfig.whatsapp,
    email: db.email || siteConfig.email,
    address: db.address || siteConfig.address.street,
    city: db.city || siteConfig.address.city,
    region: db.region || siteConfig.address.region,
    postalCode: db.postal_code || siteConfig.address.postalCode,
    businessHours: db.business_hours || siteConfig.businessHours,
    googleMapsUrl: db.google_maps_url || siteConfig.googleMapsUrl,
    instagram: db.instagram || siteConfig.social.instagram,
    facebook: db.facebook || siteConfig.social.facebook,
    linkedin: db.linkedin || siteConfig.social.linkedin,
    youtube: db.youtube || siteConfig.social.youtube,
    tiktok: db.tiktok || siteConfig.social.tiktok,
    foundingYear: db.founding_year || String(siteConfig.foundingYear),
  });
}
