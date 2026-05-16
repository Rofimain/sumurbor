# Security Checklist

Production-ready security guidelines for this codebase.

## Environment variables

- **NEVER** commit `.env`, `.env.local`, or `.dev.vars` (already in `.gitignore`).
- **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` to the browser (no `NEXT_PUBLIC_` prefix).
- Production secrets live in **Cloudflare Workers Secrets** (`npx wrangler secret put`).
- Local dev secrets in `.dev.vars`.

## JWT

- `JWT_SECRET` must be at least 32 random bytes (`openssl rand -base64 32`).
- Token TTL: 7 days. Auto-rotate by changing the secret (invalidates all sessions).
- HS256 algorithm (jose).

## Admin auth

- Constant-time string compare to prevent timing attacks.
- Rate limit: 10 attempts / 15 minutes per IP (in-memory, best effort on Workers).
- httpOnly + secure + sameSite=lax cookie.

## Supabase

- Row Level Security enabled on all tables (`supabase-schema.sql`).
- Public anon role: SELECT only (articles only if `published = true`).
- Service role: full access, used **server-side only**.

## HTTP Headers (`next.config.mjs`)

- Content Security Policy
- Strict-Transport-Security (HSTS)
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy

## Reporting

If you discover a security issue, please email the maintainer privately — do not open a public issue.
