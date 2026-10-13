#!/usr/bin/env node
// Genera publish/queue.json (estado "draft") a partir de data/lote-prueba.json y los MP4 de renders/.
//   node publish/build-queue.mjs [--start 2026-10-14] [--hour 19] [--every 2]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const argv = process.argv.slice(2);
const val = (f, d) => (argv.includes(f) ? argv[argv.indexOf(f) + 1] : d);

const rows = JSON.parse(fs.readFileSync(path.join(root, "data", process.env.BATCH || "lote-prueba.json"), "utf8"));
const hour = Number(val("--hour", 19));
const every = Number(val("--every", 2));
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const [y, m, d] = val("--start", tomorrow).split("-").map(Number);

const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

const queue = rows.map((r, i) => {
  const when = new Date(y, m - 1, d + i * every, hour, 0, 0);
  const video = `renders/reel-${i}-${r.brand}.mp4`;
  const caption = [
    `${r.category} ${r.brand} ${r.model} con un ${r.discount}% de descuento: ${r.price}€ 🔥`,
    "",
    "Liquidación por cambio de exposición en Megahogar.",
    "",
    "📍 Pásate por tu tienda Megahogar o consíguelo en megahogar.es",
    "",
    `#megahogar #electrodomesticos #ofertas #liquidacion #${slug(r.category)} #${slug(r.brand)}`,
  ].join("\n");
  return { video, caption, scheduled_at: when.toISOString(), status: "draft" };
});

fs.writeFileSync(path.join(here, "queue.json"), JSON.stringify(queue, null, 2) + "\n");
console.log(`queue.json creado con ${queue.length} Reels en estado "draft". Revisa los textos y aprueba con: node publish/instagram.mjs --approve all`);
