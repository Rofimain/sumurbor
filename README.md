# Rofimain Drilling — Sumur Bor & Bored Pile

Website company profile premium dengan custom CMS, dibuat untuk **deploy ke Cloudflare Workers** + **Supabase** sebagai database & media storage.

> **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · Cloudflare Workers (via OpenNext) · Tema **putih elegan + light blue**.

---

## Fitur

- **Frontend public** (Indonesian-only): Beranda, Tentang, Layanan, Proyek, Artikel, Kontak.
- **Custom admin CMS** (`/admin`) dengan JWT cookie auth — bukan Decap. Kelola layanan, proyek, artikel, tim, testimoni, media, dan pengaturan global.
- **Image upload** ke Supabase Storage (bucket `media`).
- **SEO end-to-end**: metadata + Open Graph + Twitter Card + dynamic `sitemap.xml` + `robots.txt` + JSON-LD (`LocalBusiness`, `Service`, `BreadcrumbList`, `Article`, `FAQPage`).
- **Form kontak** via [Web3Forms](https://web3forms.com) (gratis), fallback ke WhatsApp jika key kosong.
- **Floating WhatsApp button** dengan pesan pre-fill.
- **Rate-limited login** + httpOnly secure cookie.
- **Production-ready security headers** (CSP, HSTS, X-Frame-Options, Permissions-Policy, dll).
- **Deploy Cloudflare Workers** via `@opennextjs/cloudflare`.

---

## Struktur

```
.
├── app/                     # Next.js App Router
│   ├── (public)             # /, /tentang, /layanan, /proyek, /artikel, /kontak
│   ├── admin/               # CMS — sidebar + CRUD pages
│   ├── api/                 # auth, settings, services, projects, articles, team, testimonials, upload, media
│   ├── sitemap.ts           # Dynamic sitemap
│   └── robots.ts            # Robots
├── components/
│   ├── admin/               # Drawer, headers — admin shell
│   ├── layout/              # Navbar, Footer
│   └── ui/                  # Cards, ContactForm, ImageUploader, JsonLd, etc.
├── data/                    # Static fallback siteConfig
├── lib/                     # supabase, db, auth, utils, seo
├── public/
│   ├── _headers             # Cache-Control for static assets
│   └── robots.txt
├── types/                   # TypeScript interfaces
├── middleware.ts            # JWT auth + rate limit
├── supabase-schema.sql      # Schema + RLS + defaults
├── supabase-seed.sql        # Sample data (optional)
├── next.config.mjs
├── open-next.config.ts      # OpenNext Cloudflare config
└── wrangler.jsonc           # Workers config
```

---

## 1. Setup Supabase

1. Buka [supabase.com](https://supabase.com) → **New Project** (Free Tier cukup).
2. Catat dari **Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY` (rahasia, **jangan commit**)
3. Buka **SQL Editor** → tempel isi `supabase-schema.sql` → **Run**.
4. (Opsional) Tempel `supabase-seed.sql` → Run untuk data contoh.
5. Buka **Storage** → **Create bucket** → nama **`media`** → centang **Public**.

---

## 2. Setup lokal

```bash
# Install deps
npm install

# Copy env template & isi
cp .env.example .env.local
# Edit .env.local:
#   NEXT_PUBLIC_SUPABASE_URL=
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=
#   SUPABASE_SERVICE_ROLE_KEY=
#   ADMIN_EMAIL=admin@rofimain.com
#   ADMIN_PASSWORD=<password kuat>
#   JWT_SECRET=<random 32+ chars, generate via: openssl rand -base64 32>
#   NEXT_PUBLIC_SITE_URL=http://localhost:3000
#   NEXT_PUBLIC_WEB3FORMS_KEY=  (optional, lihat Step 4)

# Dev (Node.js runtime — sama seperti Next.js biasa)
npm run dev

# Preview di runtime Workers (mirip production)
npm run preview
```

Buka [http://localhost:3000](http://localhost:3000) untuk public site, [http://localhost:3000/admin](http://localhost:3000/admin) untuk login admin.

---

## 3. Deploy ke Cloudflare Workers

### Prasyarat

- Akun Cloudflare (gratis).
- `wrangler` sudah login: `npx wrangler login`.

### Set secrets (server-side env vars)

```bash
# Set semua secrets (akan prompt nilai)
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put JWT_SECRET
npx wrangler secret put NEXT_PUBLIC_SITE_URL          # https://sumurbor.rofimain.com
npx wrangler secret put NEXT_PUBLIC_WEB3FORMS_KEY     # optional
```

### Deploy

```bash
npm run deploy
```

Wrangler akan:
1. `next build` → kompilasi Next.js.
2. `opennextjs-cloudflare build` → adapt untuk Workers runtime.
3. Upload `.open-next/worker.js` + static assets ke Cloudflare.
4. URL default: `https://sumurbor.<your-account>.workers.dev`.

### Custom Domain

1. Cloudflare Dashboard → **Workers & Pages** → pilih worker `sumurbor`.
2. **Settings → Triggers → Custom Domains → Add Custom Domain**.
3. Tambahkan `sumurbor.rofimain.com` — Cloudflare akan otomatis bikin DNS record + provisioning SSL.

### Cek deployment

- Visit `https://sumurbor.rofimain.com` → public site.
- Visit `https://sumurbor.rofimain.com/admin` → login dengan `ADMIN_EMAIL` + `ADMIN_PASSWORD`.

---

## 4. (Opsional) Contact Form via Web3Forms

1. Daftar di [web3forms.com](https://web3forms.com) (gratis, no signup needed for basic).
2. Generate access key untuk email tujuan kamu.
3. Set sebagai env var:
   ```bash
   npx wrangler secret put NEXT_PUBLIC_WEB3FORMS_KEY
   ```
   atau di Cloudflare dashboard: **Settings → Variables → Add variable**.

> Tanpa key: form akan otomatis fallback membuka WhatsApp dengan pesan pre-filled.

---

## 5. Admin Panel

URL: `/admin/login`

Fitur:
- **Dashboard** dengan ringkasan jumlah konten per entitas.
- **Layanan**: CRUD layanan (icon, fitur, tahapan proses, FAQ, urutan, featured).
- **Proyek**: CRUD proyek (kategori, lokasi, spesifikasi, galeri, tag, status).
- **Artikel**: CRUD blog post dengan markdown sederhana (`##`, `###`, `-`, `1.`, `>`).
- **Tim**: anggota tim (nama, role, bio, foto, social).
- **Testimoni**: testimoni klien dengan rating bintang.
- **Media**: galeri semua file upload + copy URL.
- **Pengaturan**: brand, kontak, sosial media.

### Tambah admin lain?

Saat ini single-admin via env var. Untuk multi-admin di future, ganti `lib/auth.ts` untuk lookup user dari tabel Supabase + bcrypt hash.

---

## 6. Customization

### Ganti tema warna

Edit `tailwind.config.ts` → `theme.extend.colors.brand` (palette `50`–`950`).
Untuk warna utama, ubah CSS variable `--brand-*` di `app/globals.css`.

### Ganti brand name / logo

Edit `data/index.ts` (static fallback) atau langsung dari `/admin/pengaturan` (override).
Logo SVG inline di `components/layout/Navbar.tsx` dan `Footer.tsx`.

### Tambah halaman baru

1. Buat folder di `app/<slug>/page.tsx`.
2. Tambah link di `components/layout/Navbar.tsx` (`NAV_ITEMS`).
3. (Opsional) tambah ke `app/sitemap.ts` (`STATIC_PATHS`).

---

## 7. Security checklist (sebelum production)

- [ ] `JWT_SECRET` random ≥32 char (jangan pakai default).
- [ ] `ADMIN_PASSWORD` strong, **bukan** "admin/password/12345".
- [ ] `SUPABASE_SERVICE_ROLE_KEY` di Cloudflare Secrets (bukan `vars`).
- [ ] RLS aktif di semua tabel Supabase (sudah otomatis dari schema).
- [ ] Custom domain pakai full TLS (otomatis di Cloudflare).
- [ ] `.env.local` & `.dev.vars` di `.gitignore` (sudah).
- [ ] Cek security headers di production: `curl -I https://sumurbor.rofimain.com | grep -i content-security`.

---

## 8. Maintenance

- **Update deps:** `npm outdated` → `npm install <pkg>@latest`.
- **Rotate secrets:** `npx wrangler secret put <NAME>` lalu redeploy.
- **Backup DB:** Supabase Dashboard → Database → Backups (free tier: 7 hari).
- **Logs:** `npx wrangler tail` untuk live logs production.

---

## License

MIT
