import type { SiteSettings } from "@/lib/content";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace("#", "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function mix(c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }, t: number) {
  return {
    r: Math.round(c1.r * (1 - t) + c2.r * t),
    g: Math.round(c1.g * (1 - t) + c2.g * t),
    b: Math.round(c1.b * (1 - t) + c2.b * t),
  };
}

function rgbStr({ r, g, b }: { r: number; g: number; b: number }) {
  return `${r} ${g} ${b}`;
}

export function BrandStyle({ settings }: { settings: SiteSettings }) {
  const brand = hexToRgb(settings.primaryColor || "#0ea5e9");
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 15, g: 23, b: 42 };

  const scale = {
    "--brand-50": rgbStr(mix(brand, white, 0.92)),
    "--brand-100": rgbStr(mix(brand, white, 0.82)),
    "--brand-200": rgbStr(mix(brand, white, 0.65)),
    "--brand-300": rgbStr(mix(brand, white, 0.45)),
    "--brand-400": rgbStr(mix(brand, white, 0.2)),
    "--brand-500": rgbStr(brand),
    "--brand-600": rgbStr(mix(brand, black, 0.15)),
    "--brand-700": rgbStr(mix(brand, black, 0.3)),
    "--brand-800": rgbStr(mix(brand, black, 0.45)),
    "--brand-900": rgbStr(mix(brand, black, 0.6)),
  };

  const css = `:root{${Object.entries(scale)
    .map(([k, v]) => `${k}:${v};`)
    .join("")}}`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
