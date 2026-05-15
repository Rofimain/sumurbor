# Sumurbor — Rofimain Drilling

Website company profile untuk jasa sumur bor & pondasi bor pile, dibangun dengan
Next.js 15 (static export), Tailwind CSS, dan Decap CMS untuk panel admin.
Deploy gratis di Cloudflare Pages, sumber kode di GitHub.

**Live**: https://sumurbor.rofimain.com
**Admin**: https://sumurbor.rofimain.com/admin
**Repo**: https://github.com/Rofimain/sumurbor

---

## Fitur

- Static export Next.js 15 (App Router) — hosting gratis di mana saja
- Dual bahasa **Indonesia (ID)** dan **English (EN)** dengan hreflang
- Konten dikelola via admin web (`/admin`) — Decap CMS dengan login GitHub
- **Semua editable lewat admin**: logo, warna brand, nama, kontak, sosmed,
  layanan, proyek, artikel, halaman tentang
- SEO lengkap: meta tags, OG image, canonical, sitemap.xml, robots.txt,
  JSON-LD (LocalBusiness, Service, Article, FAQPage, BreadcrumbList)
- WhatsApp floating button + tombol call
- Form kontak via Web3Forms (gratis 250 submit/bulan)
- Cloudflare Pages: unlimited bandwidth, otomatis SSL, 100% gratis komersial

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 + React 19 + TypeScript |
| Styling | Tailwind CSS 3 |
| Konten | Markdown + JSON (di folder `content/`) |
| Admin CMS | Decap CMS (open source) |
| Hosting | Cloudflare Pages |
| OAuth proxy | Cloudflare Worker |
| Form | Web3Forms (free tier) |

---

## Setup lokal

```bash
git clone https://github.com/Rofimain/sumurbor.git
cd sumurbor
npm install
npm run dev
```

Buka http://localhost:3000.

### Build static

```bash
npm run build
# output di folder ./out
```

---

## Struktur folder

```
.
├── content/                    # konten (markdown + json) — DI-EDIT VIA /admin
│   ├── articles/{id,en}/*.md
│   ├── services/{id,en}/*.md
│   ├── projects/{id,en}/*.md
│   ├── about/about.json
│   └── settings/general.json   # brand, logo, kontak, sosmed
├── public/
│   ├── admin/                  # Decap CMS bundle + config
│   ├── images/                 # gambar
│   ├── _headers                # Cloudflare headers
│   └── _redirects              # Cloudflare redirects
├── src/
│   ├── app/
│   │   ├── [lang]/             # routing per-bahasa
│   │   ├── sitemap.ts          # generate /sitemap.xml
│   │   └── robots.ts           # generate /robots.txt
│   ├── components/
│   ├── i18n/                   # dictionaries id.json & en.json
│   ├── lib/                    # content loader + seo helpers
│   └── styles/
├── infra/cloudflare-oauth-worker/   # OAuth proxy untuk admin login
└── scripts/
```

---

## Deployment ke Cloudflare Pages

Sekali setup, semua deploy berikutnya otomatis tiap `git push`.

### 1. Push ke GitHub

```bash
git remote add origin https://github.com/Rofimain/sumurbor.git
git branch -M main
git push -u origin main
```

### 2. Connect ke Cloudflare Pages

1. Buka [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages → Connect to Git**
2. Pilih repo `Rofimain/sumurbor`
3. Build settings:
   - **Framework preset**: `Next.js (Static HTML Export)`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: (kosong)
   - **Environment variables**:
     - `NODE_VERSION` = `20`
     - `NEXT_PUBLIC_WEB3FORMS_KEY` = `<your_web3forms_access_key>` (opsional, untuk form kontak)
4. **Save and Deploy** → tunggu ~2 menit → dapat URL `*.pages.dev`

### 3. Pasang custom domain `sumurbor.rofimain.com`

Asumsi domain `rofimain.com` sudah di Cloudflare:

1. Pages → project → **Custom domains** → **Set up a custom domain**
2. Masukkan `sumurbor.rofimain.com` → Cloudflare otomatis membuat CNAME
3. Tunggu SSL provision (~1 menit) — selesai

### 4. Setup admin OAuth (untuk `/admin`)

Lihat panduan lengkap di [`infra/cloudflare-oauth-worker/README.md`](./infra/cloudflare-oauth-worker/README.md).

Ringkasnya:
1. Buat GitHub OAuth App
2. Deploy Cloudflare Worker (`wrangler deploy`)
3. Pasang subdomain `oauth-sumurbor.rofimain.com` (single-level, pakai hyphen)
4. Buka `/admin` → login → mulai edit konten

---

## Panduan Admin

### Cara login

1. Buka https://sumurbor.rofimain.com/admin
2. Klik **Login with GitHub**
3. Authorize aplikasi (pertama kali saja)

### Apa yang bisa diedit?

| Collection | Fungsi |
|---|---|
| **Pengaturan Website → Umum** | Nama brand, logo, favicon, warna, kontak, alamat, sosmed, area layanan |
| **Pengaturan Website → Tentang Kami** | Misi, visi, values, sertifikasi (per bahasa) |
| **Layanan** | Tambah/edit layanan (dengan FAQ + fitur) |
| **Artikel** | Tambah/edit artikel blog |
| **Proyek** | Tambah/edit portofolio proyek |

### Konten dual ID/EN

Setiap entri (artikel, layanan, proyek) punya tab **ID** dan **EN**. Tulis di
keduanya supaya pengunjung dari Indonesia dan luar negeri sama-sama dapat
versi bahasa mereka.

### Editorial workflow

Decap CMS pakai mode **editorial_workflow** — setiap perubahan masuk sebagai
draft branch PR di GitHub. Reviewer (owner) klik **Publish** di admin → otomatis
merge ke `main` → Cloudflare Pages rebuild dalam ~90 detik.

### Mengganti logo

1. Login admin → **Pengaturan Website → Umum**
2. Klik field **Logo** → upload SVG/PNG
3. **Save** → publish → tunggu rebuild

### Mengganti warna brand

1. **Pengaturan Website → Umum → Warna Brand**
2. Pilih warna lewat color picker (atau ketik HEX langsung)
3. **Save** → publish → semua tombol, link, dan aksen warna otomatis update

---

## SEO

Yang sudah otomatis:

- `<title>` & `<meta description>` unik per halaman
- Open Graph + Twitter Card di tiap halaman
- `<link rel="canonical">` dan `<link rel="alternate" hreflang>` untuk dual bahasa
- `sitemap.xml` (auto-include semua halaman + alternates)
- `robots.txt` (allow semua, disallow `/admin`)
- JSON-LD:
  - `LocalBusiness` di semua halaman (footer-level data)
  - `Service` di halaman layanan detail
  - `Article` di halaman artikel detail
  - `FAQPage` di halaman layanan yang punya FAQ
  - `BreadcrumbList` di semua halaman selain home
  - `CreativeWork` di halaman proyek detail
- Custom 404 dengan `<meta name=robots content="noindex">`

### Setelah deploy

1. Daftar [Google Search Console](https://search.google.com/search-console)
2. Verify ownership via DNS TXT (lewat Cloudflare DNS, gratis)
3. Submit sitemap: `https://sumurbor.rofimain.com/sitemap.xml`
4. Daftar [Bing Webmaster Tools](https://www.bing.com/webmasters) — submit sitemap juga
5. Daftar [Google Business Profile](https://business.google.com) untuk Local SEO

---

## Form kontak (Web3Forms)

Form kontak default-nya tidak aktif sampai access key diset.

1. Daftar di https://web3forms.com (gratis, hanya butuh email)
2. Copy **Access Key**
3. Di Cloudflare Pages → project → **Settings → Environment variables**:
   - Variable name: `NEXT_PUBLIC_WEB3FORMS_KEY`
   - Value: `<paste access key>`
   - Environment: Production
4. Trigger redeploy

---

## Lisensi

Source code: MIT. Konten dan brand: © Rofimain Drilling.
