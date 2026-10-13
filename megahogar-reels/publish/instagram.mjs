#!/usr/bin/env node
// Publica Reels en Instagram desde publish/queue.json usando la API oficial
// "Instagram API with Instagram Login" (subida resumible: no hace falta alojar el vídeo).
//
// Uso:
//   node publish/instagram.mjs --list                 Muestra la cola
//   node publish/instagram.mjs --approve all|<n>      Marca items como aprobados (n = posición, desde 0)
//   node publish/instagram.mjs --due                  Simulación: qué se publicaría ahora
//   node publish/instagram.mjs --due --publish        Publica de verdad los aprobados y vencidos
//   node publish/instagram.mjs --refresh-token        Renueva el token de larga duración (cada ~50 días)
//   Opciones: --max <n> (máx. publicaciones por ejecución, por defecto 1)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const queuePath = path.join(here, "queue.json");

loadEnv(path.join(here, ".env"));

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f, d) => (argv.includes(f) ? argv[argv.indexOf(f) + 1] : d);

const LIVE = has("--publish");
const HOST = process.env.IG_GRAPH_HOST || "graph.instagram.com";
const VERSION = process.env.IG_API_VERSION || "v23.0";
const USER_ID = process.env.IG_USER_ID;
const TOKEN = process.env.IG_ACCESS_TOKEN;

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

function readQueue() {
  if (!fs.existsSync(queuePath)) throw new Error("No existe publish/queue.json. Ejecuta: node publish/build-queue.mjs");
  return JSON.parse(fs.readFileSync(queuePath, "utf8"));
}
const writeQueue = (q) => fs.writeFileSync(queuePath, JSON.stringify(q, null, 2) + "\n");

async function api(method, p, params = {}) {
  const url = new URL(`https://${HOST}/${VERSION}/${p}`);
  const body = new URLSearchParams();
  const all = { ...params, access_token: TOKEN };
  if (method === "GET") for (const [k, v] of Object.entries(all)) url.searchParams.set(k, v);
  else for (const [k, v] of Object.entries(all)) body.set(k, v);
  const res = await fetch(url, { method, body: method === "GET" ? undefined : body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) throw new Error(`API ${res.status}: ${JSON.stringify(json.error || json)}`);
  return json;
}

async function publishReel(item) {
  const file = path.resolve(root, item.video);
  if (!fs.existsSync(file)) throw new Error(`No existe el vídeo: ${file}`);
  const bytes = fs.readFileSync(file);

  // 1. Contenedor con subida resumible
  const container = await api("POST", `${USER_ID}/media`, {
    media_type: "REELS",
    upload_type: "resumable",
    caption: item.caption,
    share_to_feed: "true",
  });

  // 2. Subir los bytes
  const up = await fetch(container.uri || `https://rupload.facebook.com/ig-api-upload/${VERSION}/${container.id}`, {
    method: "POST",
    headers: { Authorization: `OAuth ${TOKEN}`, offset: "0", file_size: String(bytes.length) },
    body: bytes,
  });
  const upJson = await up.json().catch(() => ({}));
  if (!up.ok || upJson.success === false) throw new Error(`Subida fallida ${up.status}: ${JSON.stringify(upJson)}`);

  // 3. Esperar a que Instagram procese el vídeo
  for (let i = 0; i < 60; i++) {
    const st = await api("GET", container.id, { fields: "status_code,status" });
    if (st.status_code === "FINISHED") break;
    if (st.status_code === "ERROR" || st.status_code === "EXPIRED") throw new Error(`Procesado fallido: ${JSON.stringify(st)}`);
    await new Promise((r) => setTimeout(r, 5000));
    if (i === 59) throw new Error("Tiempo de espera agotado procesando el vídeo");
  }

  // 4. Publicar
  const pub = await api("POST", `${USER_ID}/media_publish`, { creation_id: container.id });
  return pub.id;
}

async function main() {
  if (has("--refresh-token")) {
    if (!TOKEN) throw new Error("Falta IG_ACCESS_TOKEN en publish/.env");
    const r = await api("GET", "refresh_access_token", { grant_type: "ig_refresh_token" });
    console.log(`Token renovado. Caduca en ${Math.round(r.expires_in / 86400)} días. Copia el nuevo valor a publish/.env:\n${r.access_token}`);
    return;
  }

  const queue = readQueue();

  if (has("--list")) {
    queue.forEach((it, i) => console.log(`${i}\t${it.status}\t${it.scheduled_at}\t${it.video}`));
    return;
  }

  if (has("--approve")) {
    const w = val("--approve");
    queue.forEach((it, i) => {
      if ((w === "all" || String(i) === w) && it.status === "draft") it.status = "approved";
    });
    writeQueue(queue);
    console.log("Aprobados. Revisa con --list.");
    return;
  }

  if (has("--due")) {
    const now = Date.now();
    const max = Number(val("--max", 1));
    const due = queue.filter((it) => it.status === "approved" && Date.parse(it.scheduled_at) <= now).slice(0, max);
    if (!due.length) return console.log("Nada que publicar ahora.");
    if (LIVE && (!USER_ID || !TOKEN)) throw new Error("Faltan IG_USER_ID / IG_ACCESS_TOKEN en publish/.env");
    for (const it of due) {
      console.log(`${LIVE ? "PUBLICANDO" : "[simulación]"} ${it.video}\n${it.caption}\n`);
      if (!LIVE) continue;
      try {
        it.media_id = await publishReel(it);
        it.status = "published";
        it.published_at = new Date().toISOString();
        console.log(`Publicado. media_id=${it.media_id}`);
      } catch (e) {
        it.status = "failed";
        it.error = String(e.message || e);
        console.error(`ERROR: ${it.error}`);
      }
      writeQueue(queue);
    }
    return;
  }

  console.log("Uso: --list | --approve all|<n> | --due [--publish] [--max n] | --refresh-token");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
