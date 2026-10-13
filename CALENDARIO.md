# Calendario de publicación · @megahogar.es

Horas en hora peninsular española. Nada se publica solo hasta que apruebes cada pieza (`node publish/instagram.mjs --approve <n>`) y el script tenga el token.

| Día | Hora | Pieza | Formato | Cómo se publica |
|---|---|---|---|---|
| Mié 14 oct | 19:00 | ¿Tu lavadora huele a humedad? | Reel 15 s | Automático (script) |
| Vie 16 oct | 19:00 | ¿Has comprado un frigorífico que no cabía? | Reel 16 s | Automático (script) |
| Lun 19 oct | 19:00 | ¿Aclaras los platos antes del lavavajillas? | Reel 14 s | Automático (script) |
| Mié 21 oct | 19:00 | Carrusel: ¿Qué tamaño de TV elegir? | Carrusel 6 slides | Manual (el script aún no publica carruseles) |

Archivos:
- Reels: `megahogar-directo/renders/directo-lavadora.mp4`, `directo-frigorifico.mp4`, `directo-lavavajillas.mp4`
- Carrusel: `megahogar-carrusel/slides/slide-1.png` … `slide-6.png`
- Cola de publicación: `megahogar-reels/publish/queue.json` (captions y fechas, todo en estado `draft`)

## Textos de cada publicación
Están en `megahogar-reels/publish/queue.json` (Reels). Caption del carrusel:

> ¿Qué tamaño de tele te conviene según la distancia a tu sofá? 📺 Guárdalo para cuando elijas la tuya y cuéntanos en comentarios cuántas pulgadas tienes.
> 👉 Pregúntanos sin compromiso en tu tienda Megahogar o en megahogar.es.
> #megahogar #television #tv #hogar #electrodomesticos

## Antes de aprobar cada pieza
- [ ] Alguien de la tienda ha revisado los consejos (ver `REVISION-TIPS.md`).
- [ ] Has escuchado la voz del Reel (pronunciación de "Megahogar", "No Frost").
- [ ] Carrusel: decidido qué se recomienda en el tramo de 3 a 3,5 m.
- [ ] Música: opcional. Si quieres, añade un audio en tendencia desde la app al publicar a mano (la API no permite el audio con licencia de Instagram).

## Después de publicar (primera hora, lo que más ayuda al alcance)
- Responder a todos los comentarios.
- Compartir el Reel a stories con el sticker de encuesta ("¿Lo hacías?").
- Fijar el comentario con el enlace a megahogar.es.
- Etiquetar la ubicación de la tienda en la publicación.

## Semana siguiente (propuesta)
- Lun 26 oct: Reel de oferta con la plantilla de liquidación (precios confirmados).
- Mié 28 oct: nuevo Reel "directo" (por ejemplo, el aire acondicionado o la TV).
- Vie 30 oct: carrusel o Reel de producto de la tienda con material propio.

## Cómo activar la publicación automática
1. Cuenta Profesional + app de Meta + token (ver `megahogar-reels/LEEME.md`).
2. Rellenar `megahogar-reels/publish/.env`.
3. `node publish/instagram.mjs --approve all` (o `--approve 0`, `1`, `2` uno a uno) y, para que se publique solo, `powershell -ExecutionPolicy Bypass -File publish\schedule-windows.ps1` (el PC debe estar encendido a la hora).
