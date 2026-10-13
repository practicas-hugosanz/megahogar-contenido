# Megahogar · contenido de Instagram (@megahogar.es)

Proyecto para crear y publicar contenido de redes de **Megahogar Electrodomésticos** (tienda de electrodomésticos en la provincia de Alicante, web megahogar.es). Idioma de todo el contenido: **español de España**.

## Marca
- Colores: azul marino `#1F2D5F`, naranja `#E8541E`, celeste `#BFCFFF`, blanco.
- Tipografía: **Oswald** (700 para titulares, 400 para textos). Es la que se incrusta sin descargar nada; la de la marca parece Barlow Condensed.
- Logo: `megahogar-reels/assets/logo-megahogar.png` (recorte de una publicación, fondo blanco).
- Tono: cercano, con humor y de experto del hogar. Los tips deben ser útiles y ciertos; nunca inventar cifras ni afirmaciones técnicas.

## Estrategia de contenido
- Más tips que ofertas (regla 3:1). Las ofertas, con precios confirmados (los de la web pueden diferir de los del vídeo de liquidación).
- Formato estrella: Reel "directo" (15 s): gancho en pregunta, giro con "Spoiler", consejo con vídeo real, truco con vídeo real, cierre "Guarda esto" + @megahogar.es + logo.
- Siempre: gancho en el primer segundo, texto grande dentro de la zona segura de Reels (y 250 a 1650, x ≤ 1000), llamada a guardar o comentar.

## Proyectos (cada carpeta es un proyecto HyperFrames independiente)
| Carpeta | Qué es |
|---|---|
| `megahogar-directo/` | **Plantilla principal.** Reels con texto cinético + vídeo real + voz + sonido. |
| `megahogar-reels/` | Plantilla de Reel de **ofertas** (producto, precio, descuento) y la herramienta de publicación en `publish/`. |
| `megahogar-tips/` | Versión anterior de tips con tarjetas (descartada; no está en GitHub). |
| `megahogar-carrusel/` | Carrusel de 6 diapositivas (PNG 1080x1350) sobre el tamaño de TV. |
| `CALENDARIO.md`, `REVISION-TIPS.md` | Calendario de publicación y comprobaciones de contenido. |

## Flujo para un Reel "directo" nuevo (megahogar-directo)
1. Guion corto (≈ 40 palabras) con gancho, giro, 2 consejos y cierre. Humor ligero. Revisar que los consejos sean ciertos.
2. Voz con el conector de ElevenLabs (`creative_generate_speech`, voz **Gala** `Wi5NZQRxyOb3Jx4r0hrI`, modelo `eleven_v4`, 1 toma). Descargar el MP3 a `audio/<nombre>.mp3`.
3. Transcribir en local para sacar los tiempos: convertir a wav 16 kHz mono y `npx hyperframes transcribe a.wav --language es --engine parakeet --json`.
4. Clips de stock verticales (Pexels, licencia gratuita comercial) que ilustren cada consejo. **Pedir permiso al usuario antes de descargar** y convertirlos con ffmpeg a 1080x1920, 30 fps, sin audio, H.264 (crf 23) en `assets/stock/`.
5. Crear `data/<nombre>.json` (copiar uno existente) con palabras, tiempos (de la transcripción), clips y duración total.
6. `bash render-directo.sh <nombre>` genera `renders/directo-<nombre>.mp4`. Mirar fotogramas antes de dar por bueno (texto fuera de pantalla, solapes).
7. Añadir caption y fecha a `megahogar-reels/publish/queue.json` (estado `draft`).

## Publicación en Instagram
- Herramienta: `megahogar-reels/publish/` (`instagram.mjs`, `build-queue.mjs`, `schedule-windows.ps1`). Guía en `megahogar-reels/LEEME.md`.
- API oficial "Instagram API with Instagram Login". Requiere cuenta Profesional y token en `publish/.env` (lo crea y guarda **la persona dueña de la cuenta**; Claude nunca debe pedirlo ni escribirlo).
- Nada se publica sin estado `approved` y sin `--publish`. Los carruseles aún se publican a mano.

## GitHub
- Repositorio público `practicas-hugosanz/megahogar-contenido`. Trabajar en una **rama nueva** por Reel y abrir un **Pull Request**; la aprobación es fusionarlo con la pieza en estado `approved`.
- `.github/workflows/publicar.yml` publica cada hora lo aprobado y vencido usando los secrets `IG_USER_ID` e `IG_ACCESS_TOKEN` (los pone una persona, nunca Claude).
- Los clips de stock no se suben (`megahogar-directo/fetch-stock.sh` los descarga). Antes de hacer commit, comprobar que no hay claves, tokens ni rutas personales.

- Panel web (solo lectura) en `docs/index.html`, publicado en https://practicas-hugosanz.github.io/megahogar-contenido/. Se reconstruye con `node scripts/build-site.mjs` al cambiar la cola o los vídeos.

## Reglas
- No publicar ni enviar nada en nombre de la tienda sin confirmación expresa.
- No descargar archivos sin permiso del usuario (indicar nombre, origen y tamaño).
- No usar imágenes de marcas, personas o series sin licencia; no memes con derechos.
- Precios, descuentos y especificaciones se confirman con la tienda o la web antes de publicar.
- Tras editar una composición, ejecutar `npx hyperframes check` en su carpeta.
- Rutas largas: si el render da `ENAMETOOLONG`, copiar el proyecto a una ruta corta (por ejemplo `C:\hf\proyecto`).
