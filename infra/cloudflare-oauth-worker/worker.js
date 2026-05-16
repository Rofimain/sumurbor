/**
 * Cloudflare Worker — GitHub OAuth proxy untuk Decap CMS
 *
 * Worker ini menggantikan Netlify OAuth provider supaya admin Decap CMS
 * bisa login pakai akun GitHub langsung tanpa Netlify.
 *
 * Deploy:
 *   1. Pasang Wrangler:   npm install -g wrangler
 *   2. Login:             wrangler login
 *   3. Edit wrangler.toml di folder ini (set name, route)
 *   4. Set secret:        wrangler secret put GITHUB_CLIENT_ID
 *                         wrangler secret put GITHUB_CLIENT_SECRET
 *   5. Deploy:            wrangler deploy
 *
 * GitHub OAuth App settings:
 *   - Homepage URL:           https://sumurbor.rofimain.com
 *   - Authorization callback: https://oauth-sumurbor.rofimain.com/callback
 */

const HTML_CALLBACK = (payload) => `<!doctype html>
<html><head><meta charset="utf-8" /><title>Authorizing…</title>
<style>
  body { font: 14px/1.5 -apple-system, system-ui, sans-serif; color: #334155;
         display: grid; place-items: center; min-height: 100vh; margin: 0; }
  .box { text-align: center; max-width: 380px; padding: 24px; }
  .ok { color: #16a34a; font-weight: 600; }
</style></head>
<body><div class="box">
<p class="ok">Authorized</p>
<p>This window should close automatically. If not, you may close it manually.</p>
</div>
<script>
  (function () {
    var payload = ${JSON.stringify(payload)};
    function sendMessage(status, content) {
      var msg = "authorization:github:" + status + ":" + JSON.stringify(content);
      window.opener && window.opener.postMessage(msg, "*");
    }
    window.addEventListener("message", function (e) {
      if (e.data === "authorizing:github") sendMessage("success", payload);
    }, false);
    sendMessage("success", payload);
    setTimeout(function () { try { window.close(); } catch (e) {} }, 800);
  })();
</script>
</body></html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+/g, "/");

    if (path === "/auth") {
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: `${url.origin}/callback`,
        scope: "repo,user",
        state: crypto.randomUUID(),
      });
      return Response.redirect(
        `https://github.com/login/oauth/authorize?${params}`,
        302,
      );
    }

    if (path === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) return new Response("Missing code", { status: 400 });

      const tokenRes = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code,
          }),
        },
      );
      const tokenData = await tokenRes.json();

      const payload = tokenData.access_token
        ? { token: tokenData.access_token, provider: "github" }
        : { error: tokenData.error ?? "auth_failed" };

      return new Response(HTML_CALLBACK(payload), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("OAuth proxy: /auth or /callback", { status: 404 });
  },
};
