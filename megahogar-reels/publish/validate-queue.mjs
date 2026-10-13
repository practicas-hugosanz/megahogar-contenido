#!/usr/bin/env node
// Comprueba publish/queue.json antes de publicar o de fusionar un cambio.
//   node publish/validate-queue.mjs
// Sale con código 1 si hay errores.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const queuePath = path.join(here, "queue.json");

const STATUS = new Set(["draft", "approved", "published", "failed"]);
const errors = [];
const warnings = [];

let queue;
try {
  queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
} catch (e) {
  console.error("ERROR: queue.json no es un JSON válido:", e.message);
  process.exit(1);
}
if (!Array.isArray(queue)) {
  console.error("ERROR: queue.json debe ser una lista.");
  process.exit(1);
}

queue.forEach((it, i) => {
  const id = `#${i} ${it.title || it.video || ""}`.trim();
  if (!it.video) errors.push(`${id}: falta "video".`);
  else if (!fs.existsSync(path.resolve(root, it.video))) errors.push(`${id}: no existe el vídeo ${it.video}.`);
  if (!it.caption || !it.caption.trim()) errors.push(`${id}: falta "caption".`);
  else {
    if (it.caption.length > 2200) errors.push(`${id}: el caption tiene ${it.caption.length} caracteres (máx. 2200).`);
    const tags = (it.caption.match(/#[\p{L}\p{N}_]+/gu) || []).length;
    if (tags > 30) errors.push(`${id}: ${tags} hashtags (máx. 30).`);
    if (tags === 0) warnings.push(`${id}: el caption no tiene hashtags.`);
  }
  if (!STATUS.has(it.status)) errors.push(`${id}: estado "${it.status}" no válido (draft, approved, published o failed).`);
  if (!it.scheduled_at || Number.isNaN(Date.parse(it.scheduled_at))) errors.push(`${id}: "scheduled_at" no es una fecha válida (ISO 8601).`);
  else if (it.status === "draft" && Date.parse(it.scheduled_at) < Date.now()) warnings.push(`${id}: está en borrador y su fecha ya pasó.`);
  if (it.status === "failed") warnings.push(`${id}: falló la publicación: ${it.error || "sin detalle"}`);
});

const approved = queue.filter((q) => q.status === "approved").length;
console.log(`Cola: ${queue.length} piezas · ${approved} aprobadas · ${queue.filter((q) => q.status === "published").length} publicadas.`);
warnings.forEach((w) => console.log("AVISO:", w));
errors.forEach((e) => console.error("ERROR:", e));
process.exit(errors.length ? 1 : 0);
