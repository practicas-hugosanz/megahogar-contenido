#!/usr/bin/env node
// Construye _site/ para GitHub Pages: el panel (docs/), la cola de publicación y los vídeos que referencia.
//   node scripts/build-site.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "_site");
const queueFile = path.join(root, "megahogar-reels", "publish", "queue.json");
const publishDir = path.dirname(queueFile);

fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(out)) fs.rmSync(path.join(out, f), { recursive: true, force: true });
fs.mkdirSync(path.join(out, "videos"), { recursive: true });

// Panel
fs.cpSync(path.join(root, "docs"), out, { recursive: true });
fs.copyFileSync(path.join(root, "megahogar-reels", "assets", "logo-megahogar.png"), path.join(out, "logo.png"));

// Cola y vídeos (los vídeos se referencian relativos a megahogar-reels/)
const queue = JSON.parse(fs.readFileSync(queueFile, "utf8"));
const base = path.resolve(publishDir, "..");
let copied = 0;
for (const item of queue) {
  const src = path.resolve(base, item.video);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(out, "videos", path.basename(src)));
    copied++;
  } else {
    console.warn("AVISO: no existe", item.video);
  }
}
fs.writeFileSync(path.join(out, "queue.json"), JSON.stringify(queue, null, 2));
fs.writeFileSync(
  path.join(out, "site.json"),
  JSON.stringify({ repo: process.env.GITHUB_REPOSITORY || "practicas-hugosanz/megahogar-contenido", built: new Date().toISOString() })
);
fs.writeFileSync(path.join(out, ".nojekyll"), "");
console.log(`Panel construido en _site/ (${queue.length} piezas, ${copied} vídeos).`);
