# OAuth Proxy untuk Decap CMS

Worker kecil di Cloudflare yang menggantikan Netlify Identity supaya admin
Decap CMS bisa login pakai akun GitHub.

## Setup (sekali saja)

### 1. Buat GitHub OAuth App

Buka https://github.com/settings/developers → **New OAuth App**:

| Field | Value |
|---|---|
| Application name | Sumurbor Admin |
| Homepage URL | https://sumurbor.rofimain.com |
| Authorization callback URL | https://oauth-sumurbor.rofimain.com/callback |

Simpan, lalu catat **Client ID** dan generate **Client Secret**.

### 2. Deploy Worker

```bash
cd infra/cloudflare-oauth-worker
npm install -g wrangler        # sekali saja, kalau belum punya
wrangler login                 # auth ke akun Cloudflare

wrangler secret put GITHUB_CLIENT_ID
# paste Client ID dari step 1

wrangler secret put GITHUB_CLIENT_SECRET
# paste Client Secret dari step 1

wrangler deploy
```

### 3. Pasang custom domain `oauth-sumurbor.rofimain.com`

> **Kenapa pakai hyphen, bukan titik?**
> Cloudflare Workers Custom Domains di plan Free/Pro hanya mengizinkan
> subdomain **single-level** (langsung di bawah apex). Karena itu
> `oauth.sumurbor.rofimain.com` ditolak ("Invalid subdomain"), kita pakai
> `oauth-sumurbor.rofimain.com` (satu level, dipisah hyphen).

Pilih **salah satu** dari dua cara di bawah.

#### Cara A — Via dashboard Cloudflare (rekomendasi)

UI Cloudflare 2025 sudah tidak punya tab "Triggers" lagi. Custom domain sekarang ada langsung di Settings worker atau tab Domains.

1. Buka [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages** → klik worker `sumurbor-oauth`
3. Tab **Domains** (atau **Settings → Domains & Routes** di UI lama)
4. Klik **Add** → pilih **Custom Domains**
5. Di field **Subdomain**, isi: `oauth-sumurbor`
   - Bagian `.rofimain.com` sudah otomatis ter-append (greyed out)
   - **Jangan ada titik** di field ini — Cloudflare hanya terima huruf, angka, hyphen
6. Klik **Add domain**
7. Cloudflare otomatis bikin DNS record + SSL cert (~30 detik)

Verify: buka `https://oauth-sumurbor.rofimain.com/auth` di browser — harus redirect ke halaman login GitHub.

#### Cara B — Via wrangler.toml (declarative)

Edit `wrangler.toml` di folder ini, uncomment block `routes`:

```toml
routes = [
  { pattern = "oauth-sumurbor.rofimain.com/*", zone_name = "rofimain.com" }
]
```

Lalu redeploy:

```bash
wrangler deploy
```

Wrangler otomatis bikin DNS record + cert. Note: `zone_name` harus sama dengan apex domain yang sudah ada di akun Cloudflare kamu (`rofimain.com`).

#### Catatan: jangan bikin CNAME manual

Untuk Worker, **jangan** bikin DNS CNAME manual ke `<worker>.workers.dev`. Cloudflare handle routing internal lewat fitur Custom Domain. CNAME manual ke `.workers.dev` malah bikin 522/525 error.

#### Mau pakai subdomain nested (`oauth.sumurbor.rofimain.com`)?

Bisa, tapi tidak via Worker Custom Domains. Workaround-nya:
1. Bikin worker tetap pakai single-level `oauth-sumurbor.rofimain.com`
2. Di DNS zone `rofimain.com`, tambah CNAME `oauth.sumurbor` → `oauth-sumurbor.rofimain.com` (proxied: ON)
3. Update `base_url` di `config.yml` + GitHub OAuth callback ke versi nested

Tapi ini menambah hop tanpa benefit nyata. **Rekomendasi: pakai `oauth-sumurbor.rofimain.com` saja.**

### 4. Update Decap CMS config

`public/admin/config.yml` sudah dikonfigurasi pakai `base_url: https://oauth-sumurbor.rofimain.com`.

## Test

Buka https://sumurbor.rofimain.com/admin → "Login with GitHub" → harus
redirect ke GitHub → balik ke admin dengan session aktif.

## Keamanan

- Hanya user dengan akses tulis ke repo `Rofimain/sumurbor` yang bisa
  commit konten dari admin
- Add collaborator via GitHub repo settings, bukan share password
- Worker tidak menyimpan token — hanya proxying OAuth flow
