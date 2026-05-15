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
| Authorization callback URL | https://oauth.sumurbor.rofimain.com/callback |

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

### 3. Pasang custom domain

Di dashboard Cloudflare:

1. **DNS** → tambah `CNAME` `oauth.sumurbor` → `<worker>.workers.dev` (proxied: ON)
2. **Workers & Pages → sumurbor-oauth → Settings → Triggers → Custom Domains** → add `oauth.sumurbor.rofimain.com`

### 4. Update Decap CMS config

`public/admin/config.yml` sudah dikonfigurasi pakai `base_url: https://oauth.sumurbor.rofimain.com`.

## Test

Buka https://sumurbor.rofimain.com/admin → "Login with GitHub" → harus
redirect ke GitHub → balik ke admin dengan session aktif.

## Keamanan

- Hanya user dengan akses tulis ke repo `Rofimain/sumurbor` yang bisa
  commit konten dari admin
- Add collaborator via GitHub repo settings, bukan share password
- Worker tidak menyimpan token — hanya proxying OAuth flow
