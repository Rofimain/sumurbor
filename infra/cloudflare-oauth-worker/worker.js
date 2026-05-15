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
 *   - Authorization callback: https://oauth.sumurbor.rofimain.com/callback
 */

const HTML_CALLBACK = (payload) => `<!doctype html>
<html><head><meta charset="utf-8" /><title>Authorizing…</title></head>
<body><script>
  (function () {
    function sendMessage(status, content) {
      var msg = "authorization:github:" + status + ":" + JSON.stringify(content);
      window.opener && window.opener.postMessage(msg, "*");
    }
    window.addEventListener("message", function (e) {
      if (e.data === "authorizing:github") sendMessage("success", ${JSON.stringify(payload)});
    }, false);
    sendMessage("success", ${JSON.stringify(payload)});
  })();
</script>
<p>Authorizing… you may close this window.</p>
</body></html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Step 1: redirect ke GitHub OAuth
    if (url.pathname === "/auth") {
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

    // Step 2: callback — tukar code dengan access token
    if (url.pathname === "/callback") {
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
