import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Enable Cloudflare R2 incremental cache later by uncommenting:
  // incrementalCache: r2IncrementalCache,
});
