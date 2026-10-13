---
name: megahogar-reel
description: Crea un Reel de Instagram para Megahogar (@megahogar.es, tienda de electrodomésticos) con guion con humor, voz de ElevenLabs, clips reales de stock, texto cinético y sonido, y lo deja en la cola de publicación para revisarlo. Úsalo cuando el usuario diga cosas como "hazme un reel de megahogar de...", "crea un reel para megahogar sobre...", "un reel de tips de megahogar" o pida contenido para @megahogar.es.
---

# Reel de Megahogar

El proyecto vive en: `__RUTA__`

## Qué hacer

1. **Moverse al proyecto.** Cambia el directorio de trabajo a `__RUTA__` (si la sesión no está allí, usa la herramienta de cambio de directorio con esa ruta absoluta). Si la carpeta no existe, dile al usuario que ejecute otra vez el instalador (`instalar.ps1`) y para.
2. **Actualizar.** Ejecuta `git pull` en esa carpeta para traer la última versión del flujo, las plantillas y las instrucciones.
3. **Leer `CLAUDE.md`** de la raíz del proyecto y seguirlo: marca, estrategia, flujo del Reel "directo", publicación y reglas. Es la fuente de verdad; esta habilidad solo te lleva hasta ahí.
4. **Guion primero.** Propón el guion (≈ 40 palabras, humor ligero, consejos ciertos) y espera el visto bueno del usuario antes de gastar créditos de voz o descargar nada.
5. **Voz.** Usa el conector de ElevenLabs (`creative_generate_speech`, voz Gala, 1 toma). Si el conector no está disponible, dile al usuario cómo conectarlo (Ajustes > Conectores) y espera.
6. **Clips.** Busca clips de stock verticales en Pexels. Antes de descargarlos, muestra al usuario la lista (ID, qué se ve, tamaño) y pide permiso. Los clips ya usados están en `megahogar-directo/assets/stock/LEEME.md`; `bash megahogar-directo/fetch-stock.sh` los descarga.
7. **Montaje.** Crea `megahogar-directo/data/<nombre>.json` a partir de uno existente, genera el vídeo con `bash render-directo.sh <nombre>` y revisa fotogramas de cada bloque antes de dar el vídeo por bueno.
8. **Entrega.** Enséñale el vídeo, deja el caption en `megahogar-reels/publish/queue.json` en estado `draft` y, si el usuario quiere, abre un Pull Request en una rama nueva. Nunca marques como `approved` ni publiques sin que el usuario lo pida expresamente.

## Reglas que no se saltan
- No inventes datos, cifras ni precios; los consejos deben ser ciertos y se avisa al usuario de lo que debe validar la tienda.
- No descargues nada sin permiso del usuario.
- No pidas ni escribas tokens ni claves (Instagram, ElevenLabs, GitHub). Las ponen las personas en los secretos del repositorio.
- Contenido en español de España, con la marca de `CLAUDE.md`.
