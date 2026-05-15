#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");

const cloudflareFiles = ["_headers", "_redirects"];
for (const file of cloudflareFiles) {
  const src = path.join(root, "public", file);
  const dest = path.join(out, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`[post-build] copied ${file} -> out/`);
  }
}
