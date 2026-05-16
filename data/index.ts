// Static site config — fallback when Supabase settings are not yet seeded.
// Once admin updates settings via /admin/pengaturan, /api/settings/public merges
// DB values on top of this.

export const siteConfig = {
  brandName: "Rofimain Drilling",
  tagline: "Spesialis Sumur Bor & Pondasi Bor Pile",
  description:
    "Kontraktor sumur bor & pondasi bor pile profesional. Layanan presisi, peralatan modern, dan garansi pengerjaan.",
  siteUrl: "https://sumurbor.rofimain.com",
  ogImage: "/images/og-default.png",
  logo: "",
  logoLight: "",
  favicon: "/favicon.ico",
  primaryColor: "#0EA5E9",
  phone: "+62 812 3456 7890",
  phoneDisplay: "+62 812-3456-7890",
  whatsapp: "6281234567890",
  email: "halo@sumurbor.rofimain.com",
  address: {
    street: "Jl. Contoh No. 123",
    district: "Kebayoran Baru",
    city: "Jakarta Selatan",
    region: "DKI Jakarta",
    postalCode: "12110",
    country: "Indonesia",
  },
  googleMapsUrl: "https://maps.google.com/?q=-6.244,106.800",
  businessHours: "Senin–Sabtu, 08.00–17.00 WIB",
  foundingYear: 2015,
  areaServed: [
    "Jakarta",
    "Bogor",
    "Depok",
    "Tangerang",
    "Bekasi",
    "Bandung",
    "Surabaya",
  ],
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
  },
} as const;

// Static stats shown on home / about (hardcoded — represents real numbers
// that don't churn enough to warrant DB storage).
export const stats = [
  {
    value: "10+",
    label: "Tahun Pengalaman",
    description: "Sejak 2015 di industri pondasi",
  },
  {
    value: "200+",
    label: "Proyek Selesai",
    description: "Hunian, komersial, industri",
  },
  {
    value: "50+",
    label: "Klien Korporat",
    description: "Developer & pabrik tepercaya",
  },
  {
    value: "100%",
    label: "Quality Test",
    description: "PIT/PDA setiap titik bor",
  },
];

export const certifications = [
  "SBU Pelaksana Konstruksi BG009",
  "SKK Konstruksi — Ahli Geoteknik",
  "ISO 9001:2015 (dalam proses)",
  "Anggota INKINDO",
];

export const values = [
  {
    title: "Presisi",
    body: "Setiap titik bor dieksekusi sesuai spesifikasi engineering.",
  },
  {
    title: "Transparan",
    body: "Laporan progres harian dengan dokumentasi visual.",
  },
  {
    title: "Aman",
    body: "K3 sebagai prioritas: zero accident target di setiap proyek.",
  },
  {
    title: "On-time",
    body: "Komitmen jadwal yang realistis dan dipertanggungjawabkan.",
  },
];

export const trustBadges = [
  "Bersertifikat SKA/SKT",
  "Garansi Pengerjaan",
  "Survei On-site Gratis",
];

export const whyUs = [
  {
    title: "Peralatan Modern",
    body: "Rig bor dan alat geoteknik kalibrasi terbaru untuk akurasi tinggi.",
    icon: "Cog",
  },
  {
    title: "Tim Bersertifikat",
    body: "Operator dan engineer dengan sertifikasi SKA/SKT yang masih berlaku.",
    icon: "Users",
  },
  {
    title: "Transparan & On-Time",
    body: "Laporan progres harian dan komitmen waktu pengerjaan jelas.",
    icon: "Clock",
  },
  {
    title: "Garansi Pengerjaan",
    body: "Setiap pekerjaan disertai garansi sesuai BoQ yang disepakati.",
    icon: "ShieldCheck",
  },
];
